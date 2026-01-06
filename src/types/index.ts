// Xét nghiệm Sinh hóa
export interface BiochemistryTest {
  id: string
  date: string
  glucose?: string
  urea?: string
  creatinine?: string
  cholesterol?: string
  triglycerides?: string
  ast?: string
  alt?: string
  notes?: string
}

// Xét nghiệm Huyết học
export interface HematologyTest {
  id: string
  date: string
  redBloodCells?: string
  whiteBloodCells?: string
  hemoglobin?: string
  hematocrit?: string
  platelets?: string
  notes?: string
}

// Xét nghiệm Nước tiểu
export interface UrinalysisTest {
  id: string
  date: string
  color?: string
  clarity?: string
  glucose?: string
  protein?: string
  nitrite?: string
  leucocyte?: string
  notes?: string
}

// Xét nghiệm X-quang
export interface XrayTest {
  id: string
  date: string
  type: 'chest' | 'abdomen' | 'other'
  imageUrl?: string
  findings?: string
  notes?: string
}

// Siêu âm
export interface UltrasoundTest {
  id: string
  date: string
  organ: string
  imageUrl?: string
  findings?: string
  notes?: string
}

// Điện Tim
export interface ECGTest {
  id: string
  date: string
  heartRate?: string
  rhythm?: string
  findings?: string
  imageUrl?: string
  notes?: string
}

// Bệnh nhân (Patient)
export interface PatientRecord {
  id: string // số thẻ bảo hiểm y tế
  insuranceNumber: string // số thẻ bảo hiểm
  fullName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phoneNumber: string
  address: string
  email?: string

  // Thông tin khám hiện tại
  examinationDate: string
  height: string
  weight: string
  bloodPressure: string
  heartRate: string
  temperature?: string
  respiratoryRate?: string

  // Tiền sử bệnh
  medicalHistory?: string
  currentMedications?: string
  allergies?: string
  generalNotes?: string

  // Các kết quả xét nghiệm (mảng riêng)
  biochemistryTests: BiochemistryTest[]
  hematologyTests: HematologyTest[]
  urinalysisTests: UrinalysisTest[]
  xrayTests: XrayTest[]
  ultrasoundTests: UltrasoundTest[]
  ecgTests: ECGTest[]

  // Tóm tắt kết quả cuối cùng
  finalDiagnosis?: string
  recommendations?: string
  examinationStatus: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface PatientListItem {
  id: string
  insuranceNumber: string
  fullName: string
  lastExaminationDate: string
  examinationStatus: 'pending' | 'in-progress' | 'completed'
}
