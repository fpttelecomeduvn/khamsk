import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateVisitDto {
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  batchId: string;
}

export class CompleteVisitDto {
  @IsNotEmpty()
  finalRank: 'RANK_I' | 'RANK_II' | 'RANK_III' | 'RANK_IV' | 'RANK_V' | 'FAILED';
}
