import { IsString, IsNotEmpty, IsArray, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { FormSchema } from '../../shared/types';

export class CreateFormSchemaDto {
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsEnum(['CIVIL', 'POLICE', 'DRUG_REHAB'])
  @IsNotEmpty()
  examinationType: 'CIVIL' | 'POLICE' | 'DRUG_REHAB';

  @IsArray()
  @IsNotEmpty()
  schema: FormSchema[];

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateFormSchemaDto {
  @IsString()
  @IsOptional()
  specialty?: string;

  @IsEnum(['CIVIL', 'POLICE', 'DRUG_REHAB'])
  @IsOptional()
  examinationType?: 'CIVIL' | 'POLICE' | 'DRUG_REHAB';

  @IsArray()
  @IsOptional()
  schema?: FormSchema[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
