import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheckSessionEntity } from '../visit/entities/health-check-session.entity';
import { ClinicalService } from './clinical.service';
import { ClinicalController } from './clinical.controller';
import { HealthRankEngine } from './health-rank.engine';

@Module({
  imports: [TypeOrmModule.forFeature([HealthCheckSessionEntity])],
  controllers: [ClinicalController],
  providers: [ClinicalService, HealthRankEngine],
  exports: [ClinicalService, HealthRankEngine],
})
export class ClinicalModule {}
