import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ExaminationType } from '../../../../shared/types';
import { UserEntity } from '../auth/user.entity';
import { HealthCheckSessionEntity } from '../visit/health-check-session.entity';

@Entity('batches', { schema: 'health_check' })
@Index('idx_batches_batch_date', ['batchDate'])
@Index('idx_batches_examination_type', ['examinationType'])
export class BatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  batchName: string;

  @Column({ type: 'date' })
  batchDate: Date;

  @Column({
    type: 'enum',
    enum: ['CIVIL', 'POLICE', 'DRUG_REHAB'],
  })
  examinationType: ExaminationType;

  @Column({ type: 'int', default: 0 })
  totalPatients: number;

  @Column({ type: 'int', default: 0 })
  completedCount: number;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'locked_by' })
  lockedBy: UserEntity;

  @Column({ type: 'timestamp', nullable: true })
  lockedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relations
  @OneToMany(
    () => HealthCheckSessionEntity,
    (session) => session.batch,
  )
  healthCheckSessions: HealthCheckSessionEntity[];
}
