import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormSchemaEntity } from './entities/form-schema.entity';
import { CreateFormSchemaDto, UpdateFormSchemaDto } from './dto/form-schema.dto';
import { FormSchema } from '../shared/types';

@Injectable()
export class FormSchemaService {
  constructor(
    @InjectRepository(FormSchemaEntity)
    private readonly formSchemaRepository: Repository<FormSchemaEntity>,
  ) {}

  /**
   * Get form schema for a specialty and examination type
   */
  async getSchema(specialty: string, examinationType: string): Promise<FormSchema[]> {
    const formSchema = await this.formSchemaRepository.findOne({
      where: {
        specialty,
        examinationType: examinationType as any,
        isActive: true,
      },
    });

    if (!formSchema) {
      // Return empty schema if not found (allow dynamic schema configuration)
      return [];
    }

    return formSchema.schema;
  }

  /**
   * Get all active schemas for an examination type
   */
  async getSchemasByExaminationType(examinationType: string): Promise<FormSchemaEntity[]> {
    return this.formSchemaRepository.find({
      where: {
        examinationType: examinationType as any,
        isActive: true,
      },
      order: { specialty: 'ASC' },
    });
  }

  /**
   * Create a new form schema
   */
  async createSchema(dto: CreateFormSchemaDto): Promise<FormSchemaEntity> {
    const formSchema = this.formSchemaRepository.create({
      specialty: dto.specialty,
      examinationType: dto.examinationType as any,
      schema: dto.schema,
      description: dto.description,
      isActive: true,
    });

    return this.formSchemaRepository.save(formSchema);
  }

  /**
   * Update an existing form schema
   */
  async updateSchema(id: string, dto: UpdateFormSchemaDto): Promise<FormSchemaEntity> {
    const formSchema = await this.formSchemaRepository.findOne({ where: { id } });

    if (!formSchema) {
      throw new NotFoundException(`Form schema ${id} not found`);
    }

    Object.assign(formSchema, dto);
    return this.formSchemaRepository.save(formSchema);
  }

  /**
   * Delete (soft delete) a form schema
   */
  async deleteSchema(id: string): Promise<void> {
    const formSchema = await this.formSchemaRepository.findOne({ where: { id } });

    if (!formSchema) {
      throw new NotFoundException(`Form schema ${id} not found`);
    }

    formSchema.isActive = false;
    await this.formSchemaRepository.save(formSchema);
  }

  /**
   * Get all schemas (admin only)
   */
  async getAllSchemas(): Promise<FormSchemaEntity[]> {
    return this.formSchemaRepository.find({
      order: { specialty: 'ASC', examinationType: 'ASC' },
    });
  }

  /**
   * Initialize default form schemas for all examination types
   */
  async initializeDefaultSchemas(): Promise<void> {
    const defaultSchemas = this.getDefaultSchemaConfigurations();

    for (const schema of defaultSchemas) {
      // Check if already exists
      const existing = await this.formSchemaRepository.findOne({
        where: {
          specialty: schema.specialty,
          examinationType: schema.examinationType,
        },
      });

      if (!existing) {
        await this.createSchema(schema);
      }
    }
  }

  /**
   * Default form schema configurations per specialty and examination type
   */
  private getDefaultSchemaConfigurations(): CreateFormSchemaDto[] {
    return [
      {
        specialty: 'Internal Medicine',
        examinationType: 'CIVIL',
        description: 'Civil health check for Internal Medicine',
        schema: [
          {
            fieldName: 'heartRate',
            label: 'Heart Rate (bpm)',
            type: 'number',
            required: true,
            hint: 'Normal: 60-100 bpm',
          },
          {
            fieldName: 'bpSystolic',
            label: 'BP Systolic (mmHg)',
            type: 'number',
            required: true,
            hint: 'Normal: < 130 mmHg',
          },
          {
            fieldName: 'bpDiastolic',
            label: 'BP Diastolic (mmHg)',
            type: 'number',
            required: true,
            hint: 'Normal: < 85 mmHg',
          },
          {
            fieldName: 'temperature',
            label: 'Temperature (°C)',
            type: 'number',
            required: true,
            hint: 'Normal: 36.5-37.5°C',
          },
          {
            fieldName: 'notes',
            label: 'Clinical Notes',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        specialty: 'Internal Medicine',
        examinationType: 'POLICE',
        description: 'Police health check for Internal Medicine (Circular 62)',
        schema: [
          {
            fieldName: 'heartRate',
            label: 'Heart Rate (bpm)',
            type: 'number',
            required: true,
            hint: 'Normal: 60-100 bpm',
          },
          {
            fieldName: 'bpSystolic',
            label: 'BP Systolic (mmHg)',
            type: 'number',
            required: true,
            hint: 'Normal: < 140 mmHg',
          },
          {
            fieldName: 'bpDiastolic',
            label: 'BP Diastolic (mmHg)',
            type: 'number',
            required: true,
            hint: 'Normal: < 90 mmHg',
          },
          {
            fieldName: 'temperature',
            label: 'Temperature (°C)',
            type: 'number',
            required: true,
          },
          {
            fieldName: 'hasVisibleTattoos',
            label: 'Visible Tattoos',
            type: 'checkbox',
            required: true,
            hint: 'Check if tattoos visible',
          },
          {
            fieldName: 'notes',
            label: 'Clinical Notes',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        specialty: 'Ophthalmology',
        examinationType: 'CIVIL',
        description: 'Civil health check for Ophthalmology',
        schema: [
          {
            fieldName: 'visionOD',
            label: 'Vision OD (Right Eye)',
            type: 'select',
            required: true,
            options: ['20/10', '20/15', '20/20', '20/30', '20/40', '20/60', '20/100', 'CF', 'HM', 'LP', 'NLP'],
            hint: 'Best corrected vision',
          },
          {
            fieldName: 'visionOS',
            label: 'Vision OS (Left Eye)',
            type: 'select',
            required: true,
            options: ['20/10', '20/15', '20/20', '20/30', '20/40', '20/60', '20/100', 'CF', 'HM', 'LP', 'NLP'],
            hint: 'Best corrected vision',
          },
          {
            fieldName: 'colorBlindness',
            label: 'Color Blindness Test Result',
            type: 'select',
            required: true,
            options: ['Normal', 'Red-Green', 'Blue-Yellow', 'Complete'],
          },
          {
            fieldName: 'pressureOD',
            label: 'Intraocular Pressure OD (mmHg)',
            type: 'number',
            required: false,
          },
          {
            fieldName: 'pressureOS',
            label: 'Intraocular Pressure OS (mmHg)',
            type: 'number',
            required: false,
          },
          {
            fieldName: 'notes',
            label: 'Clinical Notes',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        specialty: 'Laboratory',
        examinationType: 'CIVIL',
        description: 'Civil health check for Laboratory tests',
        schema: [
          {
            fieldName: 'hiv',
            label: 'HIV Test Result',
            type: 'select',
            required: true,
            options: ['Negative', 'Positive', 'Indeterminate'],
          },
          {
            fieldName: 'hbsAg',
            label: 'HBsAg Test Result',
            type: 'select',
            required: true,
            options: ['Negative', 'Positive'],
          },
          {
            fieldName: 'syphilis',
            label: 'Syphilis Test Result (RPR/VDRL)',
            type: 'select',
            required: true,
            options: ['Negative', 'Positive'],
          },
          {
            fieldName: 'glucose',
            label: 'Glucose (mg/dL)',
            type: 'number',
            required: true,
            hint: 'Fasting: < 100 mg/dL',
          },
          {
            fieldName: 'ast',
            label: 'AST (U/L)',
            type: 'number',
            required: false,
            hint: 'Normal: < 40 U/L',
          },
          {
            fieldName: 'alt',
            label: 'ALT (U/L)',
            type: 'number',
            required: false,
            hint: 'Normal: < 40 U/L',
          },
          {
            fieldName: 'notes',
            label: 'Clinical Notes',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        specialty: 'Laboratory',
        examinationType: 'POLICE',
        description: 'Police health check for Laboratory tests (Circular 62)',
        schema: [
          {
            fieldName: 'hiv',
            label: 'HIV Test Result',
            type: 'select',
            required: true,
            options: ['Negative', 'Positive', 'Indeterminate'],
          },
          {
            fieldName: 'hbsAg',
            label: 'HBsAg Test Result',
            type: 'select',
            required: true,
            options: ['Negative', 'Positive'],
          },
          {
            fieldName: 'syphilis',
            label: 'Syphilis Test Result (RPR/VDRL)',
            type: 'select',
            required: true,
            options: ['Negative', 'Positive'],
          },
          {
            fieldName: 'drugTest',
            label: 'Drug Test Result',
            type: 'select',
            required: true,
            options: ['Negative', 'Positive - Amphetamine', 'Positive - Cannabis', 'Positive - Cocaine', 'Positive - Opioid'],
          },
          {
            fieldName: 'glucose',
            label: 'Glucose (mg/dL)',
            type: 'number',
            required: true,
          },
          {
            fieldName: 'notes',
            label: 'Clinical Notes',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        specialty: 'Drug Rehabilitation Assessment',
        examinationType: 'DRUG_REHAB',
        description: 'Drug rehabilitation health check',
        schema: [
          {
            fieldName: 'drugTestResult',
            label: 'Drug Test Result',
            type: 'select',
            required: true,
            options: ['Negative', 'Positive - Amphetamine', 'Positive - Cannabis', 'Positive - Cocaine', 'Positive - Opioid', 'Positive - Multiple'],
          },
          {
            fieldName: 'testDate',
            label: 'Test Date',
            type: 'date',
            required: true,
          },
          {
            fieldName: 'chainOfCustodyCompliant',
            label: 'Chain of Custody Compliant',
            type: 'checkbox',
            required: true,
          },
          {
            fieldName: 'previousRehabs',
            label: 'Previous Rehab Attempts',
            type: 'number',
            required: false,
          },
          {
            fieldName: 'mentalHealthStatus',
            label: 'Mental Health Status',
            type: 'select',
            required: true,
            options: ['Stable', 'At Risk', 'Critical'],
          },
          {
            fieldName: 'notes',
            label: 'Assessment Notes',
            type: 'textarea',
            required: false,
          },
        ],
      },
    ];
  }
}
