import { IsString, IsObject, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { HealthRank, Specialty } from '../../../../shared/types';

export class UpdateClinicalDataDto {
  @IsEnum(Specialty)
  specialty: Specialty;

  @IsObject()
  data: Record<string, any>;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CalculateHealthRankDto {
  @IsEnum(['CIVIL', 'POLICE', 'DRUG_REHAB'])
  examinationType: string;

  @IsObject()
  clinicalData: Record<string, any>;
}

export class OverrideHealthRankDto {
  @IsEnum(['RANK_I', 'RANK_II', 'RANK_III', 'RANK_IV', 'RANK_V', 'FAILED'])
  finalRank: HealthRank;

  @IsString()
  reason: string;

  @IsOptional()
  @IsBoolean()
  notifyPatient?: boolean;
}

export class HealthCheckSessionResponseDto {
  id: string;
  patientId: string;
  batchId: string;
  examinationType: string;
  checkupDate: string;
  clinicalData: Record<string, any>;
  specialtyRanks: Record<string, number>;
  finalRank: HealthRank | string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class FormSchemaResponseDto {
  specialty: Specialty;
  schemaVersion: number;
  schemaConfig: Array<{
    fieldName: string;
    label: string;
    type: string;
    required: boolean;
    options?: Array<{ label: string; value: string | number }>;
  }>;
}
