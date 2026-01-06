import { IsString, IsEmail, IsPhoneNumber, IsDateString, IsEnum, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ExaminationType } from '../../../../shared/types';

/**
 * CREATE PATIENT DTO
 */
export class CreatePatientDto {
  @IsString()
  fullName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';

  @IsOptional()
  @IsString()
  idNumber?: string;

  @IsOptional()
  @IsString()
  insuranceCard?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

/**
 * UPDATE PATIENT DTO
 */
export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: 'male' | 'female';

  @IsOptional()
  @IsString()
  insuranceCard?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

/**
 * BATCH IMPORT DTO
 */
export class PatientBulkImportDto {
  @IsString()
  batchName: string;

  @IsDateString()
  batchDate: string;

  @IsEnum(['CIVIL', 'POLICE', 'DRUG_REHAB'])
  examinationType: ExaminationType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePatientDto)
  patients: CreatePatientDto[];
}

/**
 * BATCH DTO
 */
export class CreateBatchDto {
  @IsString()
  batchName: string;

  @IsDateString()
  batchDate: string;

  @IsEnum(['CIVIL', 'POLICE', 'DRUG_REHAB'])
  examinationType: ExaminationType;
}

/**
 * RESPONSE DTOs
 */
export class PatientResponseDto {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  idNumber?: string;
  insuranceCard?: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export class BatchResponseDto {
  id: string;
  batchName: string;
  batchDate: string;
  examinationType: ExaminationType;
  totalPatients: number;
  completedCount: number;
  isLocked: boolean;
  createdAt: string;
}

export class BulkImportResponseDto {
  batchId: string;
  created: number;
  failed: number;
  errors: Array<{ index: number; message: string }>;
}
