import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitEntity } from './entities/visit.entity';
import { PatientEntity } from '../patient/entities/patient.entity';
import { BatchEntity } from '../patient/entities/batch.entity';
import { CreateVisitDto, CompleteVisitDto } from './dto/visit.dto';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(VisitEntity)
    private readonly visitRepository: Repository<VisitEntity>,
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(BatchEntity)
    private readonly batchRepository: Repository<BatchEntity>,
  ) {}

  async createSession(dto: CreateVisitDto): Promise<VisitEntity> {
    // Verify patient exists
    const patient = await this.patientRepository.findOne({
      where: { id: dto.patientId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient ${dto.patientId} not found`);
    }

    // Verify batch exists and is not locked
    const batch = await this.batchRepository.findOne({
      where: { id: dto.batchId },
    });
    if (!batch) {
      throw new NotFoundException(`Batch ${dto.batchId} not found`);
    }
    if (batch.isLocked) {
      throw new BadRequestException(`Batch ${dto.batchId} is locked`);
    }
    if (batch.isCompleted) {
      throw new BadRequestException(`Batch ${dto.batchId} is already completed`);
    }

    // Create new session
    const session = this.visitRepository.create({
      patientId: dto.patientId,
      batchId: dto.batchId,
      status: 'IN_PROGRESS',
      clinicalData: {},
      specialtyRanks: {},
      finalRank: null,
    });

    return this.visitRepository.save(session);
  }

  async getSession(id: string): Promise<VisitEntity> {
    const session = await this.visitRepository.findOne({
      where: { id },
      relations: ['patient', 'batch'],
    });

    if (!session) {
      throw new NotFoundException(`Session ${id} not found`);
    }

    return session;
  }

  async getPatientSessions(patientId: string): Promise<VisitEntity[]> {
    return this.visitRepository.find({
      where: { patientId },
      relations: ['batch'],
      order: { createdAt: 'DESC' },
    });
  }

  async getBatchSessions(batchId: string): Promise<VisitEntity[]> {
    return this.visitRepository.find({
      where: { batchId },
      relations: ['patient'],
      order: { createdAt: 'ASC' },
    });
  }

  async updateSessionClinicalData(
    id: string,
    specialty: string,
    data: Record<string, any>,
  ): Promise<VisitEntity> {
    const session = await this.getSession(id);

    if (session.status === 'COMPLETED') {
      throw new BadRequestException('Cannot update completed session');
    }

    // Merge specialty data
    session.clinicalData = {
      ...session.clinicalData,
      [specialty]: {
        ...session.clinicalData[specialty],
        ...data,
      },
    };

    return this.visitRepository.save(session);
  }

  async updateSpecialtyRank(
    id: string,
    specialty: string,
    rank: number,
  ): Promise<VisitEntity> {
    const session = await this.getSession(id);

    if (session.status === 'COMPLETED') {
      throw new BadRequestException('Cannot update completed session');
    }

    session.specialtyRanks = {
      ...session.specialtyRanks,
      [specialty]: rank,
    };

    return this.visitRepository.save(session);
  }

  async completeSession(id: string, dto: CompleteVisitDto): Promise<VisitEntity> {
    const session = await this.getSession(id);

    if (session.status === 'COMPLETED') {
      throw new BadRequestException('Session already completed');
    }

    session.status = 'COMPLETED';
    session.finalRank = dto.finalRank as any;
    session.completedAt = new Date();

    return this.visitRepository.save(session);
  }

  async cancelSession(id: string): Promise<VisitEntity> {
    const session = await this.getSession(id);

    if (session.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel completed session');
    }

    session.status = 'CANCELLED';
    return this.visitRepository.save(session);
  }

  async getSessionStatistics(batchId: string): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    cancelled: number;
    rankDistribution: Record<string, number>;
  }> {
    const sessions = await this.getBatchSessions(batchId);

    const rankDistribution: Record<string, number> = {
      RANK_I: 0,
      RANK_II: 0,
      RANK_III: 0,
      RANK_IV: 0,
      RANK_V: 0,
      FAILED: 0,
      PENDING: 0,
    };

    let completed = 0,
      inProgress = 0,
      pending = 0,
      cancelled = 0;

    sessions.forEach((session) => {
      if (session.status === 'COMPLETED') {
        completed++;
        rankDistribution[session.finalRank] = (rankDistribution[session.finalRank] || 0) + 1;
      } else if (session.status === 'IN_PROGRESS') {
        inProgress++;
      } else if (session.status === 'PENDING') {
        pending++;
        rankDistribution['PENDING']++;
      } else if (session.status === 'CANCELLED') {
        cancelled++;
      }
    });

    return {
      total: sessions.length,
      completed,
      inProgress,
      pending,
      cancelled,
      rankDistribution,
    };
  }
}
