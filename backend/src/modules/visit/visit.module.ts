import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitEntity } from './entities/visit.entity';
import { PatientEntity } from '../patient/entities/patient.entity';
import { BatchEntity } from '../patient/entities/batch.entity';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VisitEntity, PatientEntity, BatchEntity])],
  providers: [VisitService],
  controllers: [VisitController],
  exports: [VisitService],
})
export class VisitModule {}
