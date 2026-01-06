import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { PatientEntity } from '../../patient/entities/patient.entity';
import { BatchEntity } from '../../patient/entities/batch.entity';

@Entity('health_check_sessions', { schema: 'health_check' })
@Index(['batchId'])
@Index(['patientId'])
@Index(['status'])
@Index(['createdAt'])
export class VisitEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @ManyToOne(() => PatientEntity, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;

  @Column('uuid')
  batchId: string;

  @ManyToOne(() => BatchEntity, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batchId' })
  batch: BatchEntity;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  @Column('jsonb', { nullable: true, default: {} })
  clinicalData: Record<string, any>;

  @Column('jsonb', { nullable: true, default: {} })
  specialtyRanks: Record<string, number>;

  @Column({
    type: 'enum',
    enum: ['RANK_I', 'RANK_II', 'RANK_III', 'RANK_IV', 'RANK_V', 'FAILED'],
    nullable: true,
  })
  finalRank: 'RANK_I' | 'RANK_II' | 'RANK_III' | 'RANK_IV' | 'RANK_V' | 'FAILED' | null;

  @Column('text', { nullable: true })
  overrideReason: string | null;

  @Column('uuid', { nullable: true })
  overriddenByUserId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('timestamp', { nullable: true })
  completedAt: Date | null;
}
