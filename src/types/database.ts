/**
 * Database Schema cho Hệ Thống Quản Lý Khám Sức Khỏe
 * Định nghĩa cấu trúc dữ liệu cho tất cả các loại khám
 */

// ============= PATIENT (BỆNH NHÂN) =============
export interface Patient {
  id: string
  fullName: string
  dateOfBirth: string // yyyy-mm-dd
  gender: 'male' | 'female' | 'other'
  insuranceNumber?: string
  phoneNumber?: string
  address?: string
  email?: string
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
  status: 'active' | 'inactive' | 'archived'
}

// ============= EXAMINATION RECORDS (BỘ HỒ SƠ KHÁM) =============
export interface ExaminationRecord {
  id: string
  patientId: string
  patientName: string
  createdDate: string // yyyy-mm-dd
  completionStatus: {
    mainExamination: boolean
    xrayTest: boolean
    ecgTest: boolean
    ultrasoundTest: boolean
    hematologyTest: boolean
    biochemistryTest: boolean
    urinalysisTest: boolean
    conclusion: boolean
  }
  examinationData: {
    mainExamination?: MainExaminationData
    xrayTest?: XrayTestData
    ecgTest?: ECGTestData
    ultrasoundTest?: UltrasoundTestData
    hematologyTest?: HematologyTestData
    biochemistryTest?: BiochemistryTestData
    urinalysisTest?: UrinalysisTestData
    conclusion?: ConclusionData
  }
}

// ============= MAIN EXAMINATION (KHÁM CHÍNH) =============
export interface MainExaminationData {
  date: string // yyyy-mm-dd
  height: number // cm
  weight: number // kg
  bloodPressure: string // 120/80
  heartRate: number // bpm
  temperature: number // °C
  respiratoryRate: number // breaths/min
  generalCondition: string
  skinExamination: string
  cardiacExamination: string
  pulmonaryExamination: string
  abdominalExamination: string
  neurologicalExamination: string
  notes: string
  doctorName: string
  status: 'completed' | 'pending'
}

// ============= X-RAY TEST (CHỤP X-QUANG) =============
export interface XrayTestData {
  date: string
  type: 'chest' | 'abdominal' | 'extremity' | 'spine' | 'other'
  bodyPart: string
  findings: string
  conclusion: string
  recommendations: string
  imageUrl?: string // path to image: /images/xray/patientName_date.jpg
  imageBase64?: string // base64 encoded image (backup)
  doctorName: string
  status: 'completed' | 'pending'
}

// ============= ECG TEST (ĐIỆN TIM) =============
export interface ECGTestData {
  date: string
  heartRate: number // bpm
  rhythm: 'normal' | 'irregular' | 'other'
  findings: string[] // array of findings
  hasAtrialFibrillation: boolean
  hasPrematureContractions: boolean
  hasSTChanges: boolean
  hasTWaveChanges: boolean
  hasQRSWidening: boolean
  otherFindings: string
  conclusion: string
  recommendations: string
  doctorName: string
  status: 'completed' | 'pending'
}

// ============= ULTRASOUND TEST (SIÊU ÂM) =============
export interface UltrasoundTestData {
  date: string
  type: 'abdominal' | 'cardiac' | 'thyroid' | 'breast' | 'pelvic' | 'other'
  liverStatus: 'normal' | 'fatty_liver' | 'cirrhosis' | 'abnormal' | 'N/A'
  gallbladderStatus: 'normal' | 'stones' | 'abnormal' | 'N/A'
  pancreasStatus: 'normal' | 'abnormal' | 'N/A'
  spleenStatus: 'normal' | 'abnormal' | 'N/A'
  leftKidneyStatus: 'normal' | 'stones' | 'abnormal' | 'N/A'
  rightKidneyStatus: 'normal' | 'stones' | 'abnormal' | 'N/A'
  findings: string
  conclusion: string
  recommendations: string
  imageUrl?: string // /images/ultrasound/patientName_date.jpg
  imageBase64?: string
  doctorName: string
  status: 'completed' | 'pending'
}

// ============= HEMATOLOGY TEST (XÉT NGHIỆM HUYẾT HỌC) =============
export interface HematologyTestData {
  date: string
  redBloodCells: {
    value: number
    unit: string
    normal: string
  }
  whiteBloodCells: {
    value: number
    unit: string
    normal: string
  }
  hemoglobin: {
    value: number
    unit: string
    normal: string
  }
  hematocrit: {
    value: number
    unit: string
    normal: string
  }
  platelets: {
    value: number
    unit: string
    normal: string
  }
  notes: string
  normalValues: string
  doctorName: string
  status: 'completed' | 'pending'
}

// ============= BIOCHEMISTRY TEST (XÉT NGHIỆM SINH HÓA) =============
export interface BiochemistryTestData {
  date: string
  glucose: {
    value: number
    unit: string
    normal: string
  }
  cholesterol: {
    value: number
    unit: string
    normal: string
  }
  triglycerides: {
    value: number
    unit: string
    normal: string
  }
  creatinine: {
    value: number
    unit: string
    normal: string
  }
  urea: {
    value: number
    unit: string
    normal: string
  }
  AST: {
    value: number
    unit: string
    normal: string
  }
  ALT: {
    value: number
    unit: string
    normal: string
  }
  notes: string
  normalValues: string
  doctorName: string
  status: 'completed' | 'pending'
}

// ============= URINALYSIS TEST (XÉT NGHIỆM NƯỚC TIỂU) =============
export interface UrinalysisTestData {
  date: string
  color: string
  pH: {
    value: number
    normal: string
  }
  glucose: string // negative / positive
  protein: string // negative / positive / trace
  leucocytes: string // negative / positive
  nitrites: string // negative / positive
  specificGravity: {
    value: number
    normal: string
  }
  notes: string
  normalValues: string
  doctorName: string
  status: 'completed' | 'pending'
}

// ============= CONCLUSION (KẾT LUẬN) =============
export interface ConclusionData {
  date: string
  conclusion: string
  healthLevel: 'excellent' | 'good' | 'fair' | 'poor'
  recommendations: string
  followUpRequired: boolean
  followUpDays?: number
  doctorName: string
  status: 'completed' | 'pending'
}

// ============= DATABASE STRUCTURE =============
export interface ExaminationDatabase {
  version: string // database schema version
  lastUpdated: string // ISO timestamp
  patients: Patient[]
  examinationRecords: ExaminationRecord[]
  images: ImageMetadata[]
}

// ============= IMAGE METADATA =============
export interface ImageMetadata {
  id: string
  patientId: string
  patientName: string
  type: 'xray' | 'ultrasound' | 'endoscopy' | 'other'
  subType?: string
  fileName: string
  filePath: string // /images/xray/patientName_date.jpg
  fileSize: number // bytes
  uploadedDate: string // ISO timestamp
  description?: string
  examinationId?: string // link to examination record
}

// ============= BACKUP/EXPORT FORMAT =============
export interface DatabaseBackup {
  timestamp: string
  version: string
  data: ExaminationDatabase
  compressed: boolean
}
