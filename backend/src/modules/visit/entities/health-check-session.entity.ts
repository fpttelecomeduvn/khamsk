import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { HealthRank, ExaminationType } from '../../../../shared/types';
import { PatientEntity } from '../patient/entities/patient.entity';
import { BatchEntity } from '../patient/entities/batch.entity';
import { UserEntity } from '../auth/entities/user.entity';

@Entity('health_check_sessions', { schema: 'health_check' })
@Index('idx_hcs_patient_id', ['patientId'])
@Index('idx_hcs_batch_id', ['batchId'])
@Index('idx_hcs_checkup_date', ['checkupDate'])
@Index('idx_hcs_examination_type', ['examinationType'])
@Index('idx_hcs_final_rank', ['finalRank'])
@Index('idx_hcs_is_completed', ['isCompleted'])
export class HealthCheckSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => PatientEntity, (p) => p.healthCheckSessions)
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity;

  @Column({ type: 'uuid' })
  batchId: string;

  @ManyToOne(() => BatchEntity, (b) => b.healthCheckSessions)
  @JoinColumn({ name: 'batch_id' })
  batch: BatchEntity;

  @Column({
    type: 'enum',
    enum: ['CIVIL', 'POLICE', 'DRUG_REHAB'],
  })
  examinationType: ExaminationType;

  @Column({ type: 'date' })
  checkupDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  clinicalData: Record<string, any>; // JSONB with dynamic specialty data

  @Column({ type: 'jsonb', nullable: true })
  specialtyRanks: Record<string, number>; // { "internal": 2, "ophthalmology": 3 }

  @Column({
    type: 'enum',
    enum: ['RANK_I', 'RANK_II', 'RANK_III', 'RANK_IV', 'RANK_V', 'FAILED'],
    nullable: true,
  })
  finalRank: HealthRank | string;

  @Column({ type: 'text', nullable: true })
  overrideReason: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'completed_by' })
  completedBy: UserEntity;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
