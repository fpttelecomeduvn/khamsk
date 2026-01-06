import { PatientRecord } from '../types'

/**
 * Lưu dữ liệu patient đầy đủ vào localStorage
 * @param patient Dữ liệu patient record đầy đủ
 */
export function savePatientData(patient: PatientRecord) {
  try {
    const allPatients = JSON.parse(localStorage.getItem('allPatients') || '[]') as PatientRecord[]
    
    // Tìm và cập nhật patient nếu tồn tại, nếu không thì thêm mới
    const existingIndex = allPatients.findIndex(p => p.id === patient.id)
    
    if (existingIndex >= 0) {
      allPatients[existingIndex] = patient
    } else {
      allPatients.push(patient)
    }
    
    localStorage.setItem('allPatients', JSON.stringify(allPatients))
    console.log('✓ Đã lưu dữ liệu patient:', patient.fullName)
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu patient:', error)
  }
}

/**
 * Lấy dữ liệu patient đầy đủ từ localStorage
 * @param patientId ID của patient
 */
export function getPatientData(patientId: string): PatientRecord | null {
  try {
    const allPatients = JSON.parse(localStorage.getItem('allPatients') || '[]') as PatientRecord[]
    return allPatients.find(p => p.id === patientId) || null
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu patient:', error)
    return null
  }
}

/**
 * Lấy tất cả dữ liệu patient từ localStorage
 */
export function getAllPatientData(): PatientRecord[] {
  try {
    return JSON.parse(localStorage.getItem('allPatients') || '[]') as PatientRecord[]
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu patient:', error)
    return []
  }
}

/**
 * Kiểm tra xem patient có dữ liệu nào không
 * @param patient Patient record
 */
export function hasPatientData(patient: PatientRecord): boolean {
  return !!(
    patient.height ||
    patient.weight ||
    patient.bloodPressure ||
    patient.heartRate ||
    patient.biochemistryTests?.length ||
    patient.hematologyTests?.length ||
    patient.urinalysisTests?.length ||
    patient.xrayTests?.length ||
    patient.ultrasoundTests?.length ||
    patient.ecgTests?.length ||
    patient.finalDiagnosis
  )
}
