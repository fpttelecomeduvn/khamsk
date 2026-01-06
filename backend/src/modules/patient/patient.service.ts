import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientEntity } from './entities/patient.entity';
import { BatchEntity } from './entities/batch.entity';
import { CreatePatientDto, UpdatePatientDto, PatientBulkImportDto, CreateBatchDto } from './dto';
import { ExaminationType } from '../../../../shared/types';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(BatchEntity)
    private batchRepository: Repository<BatchEntity>,
  ) {}

  /**
   * Tạo bệnh nhân mới
   */
  async createPatient(dto: CreatePatientDto): Promise<PatientEntity> {
    // Kiểm tra trùng lặp CMND
    if (dto.idNumber) {
      const existing = await this.patientRepository.findOne({
        where: { idNumber: dto.idNumber },
      });
      if (existing) {
        throw new BadRequestException(
          `Patient with ID number ${dto.idNumber} already exists`,
        );
      }
    }

    const patient = this.patientRepository.create({
      ...dto,
      dateOfBirth: new Date(dto.dateOfBirth),
    });

    return this.patientRepository.save(patient);
  }

  /**
   * Lấy bệnh nhân theo ID
   */
  async getPatientById(id: string): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['healthCheckSessions'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  /**
   * Lấy bệnh nhân theo số CMND
   */
  async getPatientByIdNumber(idNumber: string): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOne({
      where: { idNumber },
      relations: ['healthCheckSessions'],
    });

    return patient;
  }

  /**
   * Cập nhật bệnh nhân
   */
  async updatePatient(
    id: string,
    dto: UpdatePatientDto,
  ): Promise<PatientEntity> {
    const patient = await this.getPatientById(id);

    const updated = this.patientRepository.merge(patient, {
      ...dto,
      dateOfBirth: dto.dateOfBirth
        ? new Date(dto.dateOfBirth)
        : patient.dateOfBirth,
    });

    return this.patientRepository.save(updated);
  }

  /**
   * Lấy tất cả bệnh nhân (có phân trang)
   */
  async getAllPatients(page = 1, limit = 20) {
    const [patients, total] = await this.patientRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items: patients,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * ============ BATCH OPERATIONS ============
   */

  /**
   * Tạo đợt khám mới
   */
  async createBatch(
    dto: CreateBatchDto,
    createdById: string,
  ): Promise<BatchEntity> {
    const batch = this.batchRepository.create({
      ...dto,
      batchDate: new Date(dto.batchDate),
      createdBy: { id: createdById } as any,
    });

    return this.batchRepository.save(batch);
  }

  /**
   * Lấy đợt khám theo ID
   */
  async getBatchById(id: string): Promise<BatchEntity> {
    const batch = await this.batchRepository.findOne({
      where: { id },
      relations: ['healthCheckSessions', 'createdBy'],
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }

    return batch;
  }

  /**
   * Bulk Import: Thêm nhiều bệnh nhân cùng lúc
   */
  async bulkImportPatients(
    dto: PatientBulkImportDto,
    createdById: string,
  ): Promise<{
    batchId: string;
    created: number;
    failed: number;
    errors: Array<{ index: number; message: string }>;
  }> {
    this.logger.log(
      `Starting bulk import: ${dto.patients.length} patients for batch "${dto.batchName}"`,
    );

    // 1. Tạo batch
    const batch = await this.createBatch(
      {
        batchName: dto.batchName,
        batchDate: dto.batchDate,
        examinationType: dto.examinationType,
      },
      createdById,
    );

    // 2. Import bệnh nhân
    const results = {
      created: 0,
      failed: 0,
      errors: [] as Array<{ index: number; message: string }>,
    };

    for (let i = 0; i < dto.patients.length; i++) {
      try {
        const patientDto = dto.patients[i];

        // Kiểm tra trùng lặp CMND
        if (patientDto.idNumber) {
          const existing = await this.patientRepository.findOne({
            where: { idNumber: patientDto.idNumber },
          });
          if (existing) {
            results.failed++;
            results.errors.push({
              index: i,
              message: `Duplicate ID number: ${patientDto.idNumber}`,
            });
            continue;
          }
        }

        const patient = this.patientRepository.create({
          ...patientDto,
          dateOfBirth: new Date(patientDto.dateOfBirth),
        });

        await this.patientRepository.save(patient);
        results.created++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          index: i,
          message: error.message,
        });
        this.logger.error(`Error importing patient at index ${i}:`, error);
      }
    }

    // 3. Update batch count
    batch.totalPatients = results.created;
    await this.batchRepository.save(batch);

    this.logger.log(
      `Bulk import completed: ${results.created} created, ${results.failed} failed`,
    );

    return {
      batchId: batch.id,
      ...results,
    };
  }

  /**
   * Lấy danh sách bệnh nhân chờ khám theo batch
   */
  async getPendingPatientsByBatch(batchId: string) {
    const batch = await this.getBatchById(batchId);

    const patients = await this.patientRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.healthCheckSessions', 'hcs')
      .where('hcs.batch_id = :batchId', { batchId })
      .andWhere('hcs.is_completed = false')
      .orderBy('p.fullName', 'ASC')
      .getMany();

    return {
      batch,
      patients,
      total: patients.length,
    };
  }

  /**
   * Lấy lịch sử khám của bệnh nhân
   */
  async getPatientExaminationHistory(patientId: string) {
    const patient = await this.getPatientById(patientId);

    // Relations sẽ được load bởi eager loading
    const sessions = await this.patientRepository
      .createQueryBuilder('p')
      .where('p.id = :patientId', { patientId })
      .leftJoinAndSelect('p.healthCheckSessions', 'hcs')
      .leftJoinAndSelect('hcs.batch', 'b')
      .orderBy('hcs.checkup_date', 'DESC')
      .getOne();

    return {
      patient,
      examinations: sessions.healthCheckSessions,
      total: sessions.healthCheckSessions.length,
    };
  }

  /**
   * Khóa đợt khám (không cho sửa thêm)
   */
  async lockBatch(batchId: string, lockedById: string): Promise<BatchEntity> {
    const batch = await this.getBatchById(batchId);

    if (batch.isLocked) {
      throw new BadRequestException('Batch is already locked');
    }

    batch.isLocked = true;
    batch.lockedBy = { id: lockedById } as any;
    batch.lockedAt = new Date();

    return this.batchRepository.save(batch);
  }

  /**
   * Tìm kiếm bệnh nhân
   */
  async searchPatients(
    query: string,
    page = 1,
    limit = 20,
  ) {
    const [patients, total] = await this.patientRepository
      .createQueryBuilder('p')
      .where('p.full_name ILIKE :query', { query: `%${query}%` })
      .orWhere('p.id_number = :idNumber', { idNumber: query })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: patients,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}
