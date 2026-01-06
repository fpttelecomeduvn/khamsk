import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { HealthCheckSessionEntity } from '../visit/health-check-session.entity';

@Entity('patients', { schema: 'health_check' })
@Index('idx_patients_id_number', ['idNumber'])
@Index('idx_patients_created_at', ['createdAt'])
export class PatientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  idNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  insuranceCard: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'position' })
  position: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relations
  @OneToMany(
    () => HealthCheckSessionEntity,
    (session) => session.patient,
  )
  healthCheckSessions: HealthCheckSessionEntity[];
}
