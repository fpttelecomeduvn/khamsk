/**
 * SHARED TYPES - Được sử dụng bởi cả Frontend và Backend
 * Đảm bảo tính nhất quán dữ liệu giữa hai phía
 */

// ============ ENUMS ============
export enum ExaminationType {
  CIVIL = 'CIVIL', // Dân sự (Thông tư 14/2013/TT-BYT)
  POLICE = 'POLICE', // Công an (Thông tư 62/2023/TT-BCA)
  DRUG_REHAB = 'DRUG_REHAB', // Cai nghiện
}

export enum HealthRank {
  RANK_I = 1,
  RANK_II = 2,
  RANK_III = 3,
  RANK_IV = 4,
  RANK_V = 5,
  FAILED = 99, // Công an: Không đạt
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  TECHNICIAN = 'TECHNICIAN',
  RECEPTIONIST = 'RECEPTIONIST',
  CHIEF_DOCTOR = 'CHIEF_DOCTOR',
}

export enum Specialty {
  INTERNAL = 'internal',
  SURGERY = 'surgery',
  OPHTHALMOLOGY = 'ophthalmology',
  ENT = 'ent',
  DERMATOLOGY = 'dermatology',
  DENTISTRY = 'dentistry',
  GYNECOLOGY = 'gynecology',
  IMAGING = 'imaging',
  ULTRASOUND = 'ultrasound',
  ECG = 'ecg',
  LABORATORY = 'laboratory',
}

// ============ INTERFACES ============

export interface PatientRecord {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  insuranceCard?: string;
  phone: string;
  idNumber?: string; // CMND/CCCD
  company?: string;
  position?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthCheckSession {
  id: string;
  patientId: string;
  batchId: string;
  examinationType: ExaminationType;
  checkupDate: string;
  clinicalData: ClinicalDataJson;
  specialtyRanks: Record<Specialty, number>; // ví dụ: { internal: 2, ophthalmology: 3 }
  finalRank: HealthRank | number;
  notes?: string;
  overrideReason?: string; // Nếu bác sĩ ghi đè xếp loại
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * CLINICAL DATA JSONB STRUCTURE
 * Lưu dữ liệu thô từ các chuyên khoa
 * Có thể mở rộng dễ dàng mà không cần migration
 */
export interface ClinicalDataJson {
  [specialty: string]: {
    [fieldName: string]: any;
  };
}

export interface InternalMedicineData {
  heartRate?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  respiratoryRate?: number;
  temperature?: number;
  lungAuscultation?: string;
  cardiacAuscultation?: string;
  abdominalExamination?: string;
  edema?: boolean;
  rank?: HealthRank | number;
}

export interface OphthalmologyData {
  visLeftUncorrected?: number;
  visRightUncorrected?: number;
  visLeftCorrected?: number;
  visRightCorrected?: number;
  colorBlindness?: boolean;
  intraocularPressure?: number;
  fundoscopicFindings?: string;
  rank?: HealthRank | number;
}

export interface LabTestData {
  wbc?: number; // White Blood Cell
  rbc?: number; // Red Blood Cell
  hemoglobin?: number;
  glucose?: number;
  creatinine?: number;
  ast?: number; // Aspartate Aminotransferase
  alt?: number; // Alanine Aminotransferase
  hiv?: boolean;
  hbsAg?: boolean;
  syphilis?: boolean;
  drugTest?: boolean; // Ma túy: Dương/Âm
  drugType?: string; // Methamphetamine, Heroin, THC...
  chainOfCustodyId?: string; // Cho nhóm cai nghiện
  rank?: HealthRank | number;
}

export interface ImagingData {
  xrayChestFindings?: string;
  xrayChestNormal?: boolean;
  ultrasoundAbdominalFindings?: string;
  ecgFindings?: string;
  ecgNormal?: boolean;
  rank?: HealthRank | number;
}

export interface FormSchema {
  fieldName: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  required: boolean;
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    messages?: Record<string, string>;
  };
  options?: Array<{ label: string; value: string | number }>;
  defaultValue?: any;
  placeholder?: string;
  hint?: string;
}

// ============ API DTO (Data Transfer Objects) ============

export interface CreatePatientDto {
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  insuranceCard?: string;
  phone: string;
  idNumber?: string;
  company?: string;
  position?: string;
  address?: string;
}

export interface CreateHealthCheckDto {
  patientId: string;
  batchId: string;
  examinationType: ExaminationType;
  checkupDate: string;
}

export interface UpdateClinicalDataDto {
  specialty: Specialty;
  data: Record<string, any>;
}

export interface CalculateHealthRankDto {
  examinationType: ExaminationType;
  clinicalData: ClinicalDataJson;
}

export interface HealthCheckResponseDto {
  healthCheck: HealthCheckSession;
  patient: PatientRecord;
  specialtyDetails: Record<Specialty, any>;
  recommendations: string[];
}

export interface BatchImportDto {
  batchId: string;
  examinationType: ExaminationType;
  checkupDate: string;
  patients: CreatePatientDto[];
}

// ============ CONFIGURATION ============

export interface HealthRankConfig {
  examinationType: ExaminationType;
  specialty: Specialty;
  thresholds: Record<string, { rank: number; description: string }>;
  knockoutCriteria?: string[]; // Cho Công an
}

export interface SystemConfig {
  facility: string;
  version: string;
  rankConfigs: HealthRankConfig[];
  enableAuditLog: boolean;
  defaultExaminationType: ExaminationType;
}

// ============ UTILITY TYPES ============

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
