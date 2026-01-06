import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { FormSchema } from '../../shared/types';

@Entity('form_schemas', { schema: 'health_check' })
@Index(['specialty'])
@Index(['examinationType'])
export class FormSchemaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  specialty: string;

  @Column({
    type: 'enum',
    enum: ['CIVIL', 'POLICE', 'DRUG_REHAB'],
  })
  examinationType: 'CIVIL' | 'POLICE' | 'DRUG_REHAB';

  @Column('jsonb')
  schema: FormSchema[];

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
