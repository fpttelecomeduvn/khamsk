import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCheckSessionEntity } from '../visit/entities/health-check-session.entity';
import { UpdateClinicalDataDto, OverrideHealthRankDto, CalculateHealthRankDto } from './dto';
import { HealthRankEngine } from './health-rank.engine';
import { Specialty } from '../../../../shared/types';

@Injectable()
export class ClinicalService {
  private readonly logger = new Logger(ClinicalService.name);

  constructor(
    @InjectRepository(HealthCheckSessionEntity)
    private sessionRepository: Repository<HealthCheckSessionEntity>,
    private healthRankEngine: HealthRankEngine,
  ) {}

  /**
   * Lấy session khám sức khỏe
   */
  async getSessionById(sessionId: string): Promise<HealthCheckSessionEntity> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['patient', 'batch'],
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    return session;
  }

  /**
   * Cập nhật dữ liệu lâm sàng cho một chuyên khoa
   */
  async updateClinicalData(
    sessionId: string,
    dto: UpdateClinicalDataDto,
    userId: string,
  ): Promise<HealthCheckSessionEntity> {
    const session = await this.getSessionById(sessionId);

    if (session.isCompleted) {
      throw new BadRequestException('Cannot update completed session');
    }

    // Merge với dữ liệu hiện có
    if (!session.clinicalData) {
      session.clinicalData = {};
    }

    session.clinicalData[dto.specialty] = {
      ...session.clinicalData[dto.specialty],
      ...dto.data,
    };

    this.logger.log(
      `Updated clinical data for session ${sessionId}, specialty: ${dto.specialty}`,
    );

    return this.sessionRepository.save(session);
  }

  /**
   * Tính xếp loại sức khỏe tự động
   */
  async calculateHealthRank(
    sessionId: string,
  ): Promise<{
    specialtyRanks: Record<string, number>;
    finalRank: string;
    reasons: string[];
  }> {
    const session = await this.getSessionById(sessionId);

    if (!session.clinicalData || Object.keys(session.clinicalData).length === 0) {
      throw new BadRequestException(
        'No clinical data available for calculation',
      );
    }

    const result = await this.healthRankEngine.calculateFinalRank({
      examinationType: session.examinationType as any,
      clinicalData: session.clinicalData,
    });

    // Lưu kết quả
    session.specialtyRanks = result.specialtyRanks;
    session.finalRank = result.finalRank as any;

    await this.sessionRepository.save(session);

    this.logger.log(
      `Calculated health rank for session ${sessionId}: ${result.finalRank}`,
    );

    return result;
  }

  /**
   * Ghi đè xếp loại (với audit logging)
   */
  async overrideHealthRank(
    sessionId: string,
    dto: OverrideHealthRankDto,
    userId: string,
  ): Promise<HealthCheckSessionEntity> {
    const session = await this.getSessionById(sessionId);

    const oldRank = session.finalRank;

    session.finalRank = dto.finalRank as any;
    session.overrideReason = dto.reason;
    session.completedBy = { id: userId } as any;
    session.completedAt = new Date();
    session.isCompleted = true;

    const updated = await this.sessionRepository.save(session);

    this.logger.log(
      `Override health rank for session ${sessionId}: ${oldRank} -> ${dto.finalRank}, Reason: ${dto.reason}`,
    );

    // TODO: Log to audit_logs table

    return updated;
  }

  /**
   * Hoàn thành session khám
   */
  async completeSession(
    sessionId: string,
    userId: string,
  ): Promise<HealthCheckSessionEntity> {
    const session = await this.getSessionById(sessionId);

    if (session.isCompleted) {
      throw new BadRequestException('Session is already completed');
    }

    session.isCompleted = true;
    session.completedBy = { id: userId } as any;
    session.completedAt = new Date();

    return this.sessionRepository.save(session);
  }

  /**
   * Lấy tất cả sessions của bệnh nhân
   */
  async getPatientSessions(patientId: string) {
    const sessions = await this.sessionRepository.find({
      where: { patientId },
      relations: ['batch'],
      order: { checkupDate: 'DESC' },
    });

    return sessions;
  }

  /**
   * Lấy tất cả sessions chưa hoàn thành của batch
   */
  async getIncompleteSessions(batchId: string) {
    const sessions = await this.sessionRepository.find({
      where: {
        batchId,
        isCompleted: false,
      },
      relations: ['patient'],
      order: { createdAt: 'ASC' },
    });

    return sessions;
  }

  /**
   * Thống kê xếp loại
   */
  async getHealthRankStatistics(batchId: string) {
    const sessions = await this.sessionRepository.find({
      where: { batchId, isCompleted: true },
    });

    const stats = {
      total: sessions.length,
      byRank: {
        'RANK_I': 0,
        'RANK_II': 0,
        'RANK_III': 0,
        'RANK_IV': 0,
        'RANK_V': 0,
        'FAILED': 0,
      },
    };

    for (const session of sessions) {
      if (session.finalRank in stats.byRank) {
        stats.byRank[session.finalRank]++;
      }
    }

    return stats;
  }
}
