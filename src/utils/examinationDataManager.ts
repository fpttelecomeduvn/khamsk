/**
 * Quản lý dữ liệu toàn bộ quy trình khám bệnh
 * Liên kết dữ liệu từ: Khám chính -> X-quang -> Xét nghiệm -> Kết luận
 */

export interface ExaminationData {
  // Thông tin khám chính
  physicalExamination?: {
    blood_pressure?: string
    heart_rate?: number
    temperature?: number
    respiratory_rate?: number
    weight?: number
    height?: number
    bmi?: number
    notes?: string
    date?: string
  }

  // Kết quả X-quang
  xrayTest?: {
    status: 'completed' | 'pending'
    date?: string
    type?: string
    description?: string
    conclusion?: string
    result?: any
  }

  // Kết quả xét nghiệm máu
  labTest?: {
    status: 'completed' | 'pending'
    date?: string
    results?: {
      [key: string]: string | number
    }
    normalValues?: {
      [key: string]: string
    }
    notes?: string
  }

  // Xét nghiệm khác (siêu âm, ECG, v.v.)
  otherTests?: {
    [testName: string]: {
      status: 'completed' | 'pending'
      date?: string
      result?: string
      notes?: string
    }
  }

  // Kết luận tổng kết
  finalConclusion?: {
    healthStatus: 'excellent' | 'good' | 'fair' | 'poor'
    summary: string
    recommendations: string
    followUpRequired: boolean
    followUpDays?: number
    doctorName?: string
    date?: string
  }
}

export interface PatientExaminationRecord {
  insuranceNumber: string
  patientName: string
  dateOfBirth?: string
  gender?: string
  examinationStartDate?: string
  examinationData: ExaminationData
  status: 'in-progress' | 'completed' | 'pending-approval'
  lastModified: string
}

/**
 * Lấy dữ liệu khám toàn bộ của bệnh nhân
 */
export const getPatientExaminationData = (insuranceNumber: string): PatientExaminationRecord | null => {
  try {
    const data = localStorage.getItem(`exam_${insuranceNumber}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error getting examination data:', error)
    return null
  }
}

/**
 * Khởi tạo bệnh án mới cho bệnh nhân
 */
export const initializePatientExamination = (
  insuranceNumber: string,
  patientName: string,
  dateOfBirth?: string,
  gender?: string
): PatientExaminationRecord => {
  const record: PatientExaminationRecord = {
    insuranceNumber,
    patientName,
    dateOfBirth,
    gender,
    examinationStartDate: new Date().toISOString().split('T')[0],
    examinationData: {},
    status: 'in-progress',
    lastModified: new Date().toISOString()
  }

  localStorage.setItem(`exam_${insuranceNumber}`, JSON.stringify(record))
  return record
}

/**
 * Cập nhật dữ liệu khám chính
 */
export const updatePhysicalExamination = (
  insuranceNumber: string,
  data: ExaminationData['physicalExamination']
): void => {
  let record = getPatientExaminationData(insuranceNumber)
  if (!record) {
    record = initializePatientExamination(insuranceNumber, 'Chưa cập nhật')
  }

  record.examinationData.physicalExamination = {
    ...record.examinationData.physicalExamination,
    ...data,
    date: data?.date || new Date().toISOString().split('T')[0]
  }
  record.lastModified = new Date().toISOString()

  localStorage.setItem(`exam_${insuranceNumber}`, JSON.stringify(record))
}

/**
 * Cập nhật dữ liệu X-quang
 */
export const updateXrayTest = (
  insuranceNumber: string,
  data: ExaminationData['xrayTest']
): void => {
  let record = getPatientExaminationData(insuranceNumber)
  if (!record) {
    record = initializePatientExamination(insuranceNumber, 'Chưa cập nhật')
  }

  record.examinationData.xrayTest = {
    ...record.examinationData.xrayTest,
    ...data,
    status: 'completed',
    date: data?.date || new Date().toISOString().split('T')[0]
  }
  record.lastModified = new Date().toISOString()

  localStorage.setItem(`exam_${insuranceNumber}`, JSON.stringify(record))
}

/**
 * Cập nhật dữ liệu xét nghiệm máu
 */
export const updateLabTest = (
  insuranceNumber: string,
  data: ExaminationData['labTest']
): void => {
  let record = getPatientExaminationData(insuranceNumber)
  if (!record) {
    record = initializePatientExamination(insuranceNumber, 'Chưa cập nhật')
  }

  record.examinationData.labTest = {
    ...record.examinationData.labTest,
    ...data,
    status: 'completed',
    date: data?.date || new Date().toISOString().split('T')[0]
  }
  record.lastModified = new Date().toISOString()

  localStorage.setItem(`exam_${insuranceNumber}`, JSON.stringify(record))
}

/**
 * Cập nhật xét nghiệm khác
 */
export const updateOtherTest = (
  insuranceNumber: string,
  testName: string,
  data: {
    status?: 'completed' | 'pending'
    date?: string
    result?: string
    notes?: string
  }
): void => {
  let record = getPatientExaminationData(insuranceNumber)
  if (!record) {
    record = initializePatientExamination(insuranceNumber, 'Chưa cập nhật')
  }

  if (!record.examinationData.otherTests) {
    record.examinationData.otherTests = {}
  }

  record.examinationData.otherTests[testName] = {
    ...record.examinationData.otherTests[testName],
    ...data,
    status: 'completed',
    date: data?.date || new Date().toISOString().split('T')[0]
  }
  record.lastModified = new Date().toISOString()

  localStorage.setItem(`exam_${insuranceNumber}`, JSON.stringify(record))
}

/**
 * Cập nhật kết luận tổng kết
 */
export const updateFinalConclusion = (
  insuranceNumber: string,
  data: Partial<ExaminationData['finalConclusion']> & { healthStatus: 'excellent' | 'good' | 'fair' | 'poor', summary: string }
): void => {
  let record = getPatientExaminationData(insuranceNumber)
  if (!record) {
    record = initializePatientExamination(insuranceNumber, 'Chưa cập nhật')
  }

  record.examinationData.finalConclusion = {
    healthStatus: data.healthStatus,
    summary: data.summary,
    recommendations: data.recommendations || '',
    followUpRequired: data.followUpRequired || false,
    followUpDays: data.followUpDays,
    doctorName: data.doctorName,
    date: data?.date || new Date().toISOString().split('T')[0]
  }
  record.status = 'completed'
  record.lastModified = new Date().toISOString()

  localStorage.setItem(`exam_${insuranceNumber}`, JSON.stringify(record))
}

/**
 * Lấy tóm tắt đầy đủ bệnh án
 */
export const getExaminationSummary = (insuranceNumber: string): PatientExaminationRecord | null => {
  return getPatientExaminationData(insuranceNumber)
}

/**
 * Kiểm tra các phần đã hoàn thành
 */
export const getCompletionStatus = (insuranceNumber: string) => {
  const record = getPatientExaminationData(insuranceNumber)
  if (!record) return null

  return {
    physicalExamination: !!record.examinationData.physicalExamination?.date,
    xrayTest: record.examinationData.xrayTest?.status === 'completed',
    labTest: record.examinationData.labTest?.status === 'completed',
    otherTests: record.examinationData.otherTests ? Object.keys(record.examinationData.otherTests).length > 0 : false,
    finalConclusion: !!record.examinationData.finalConclusion?.date
  }
}

/**
 * In toàn bộ bệnh án
 */
export const generateFullMedicalReport = (insuranceNumber: string): string => {
  const record = getPatientExaminationData(insuranceNumber)
  if (!record) return 'Không tìm thấy dữ liệu'

  const data = record.examinationData
  let report = `
BỆNH ÁN TỔNG HỢP
═══════════════════════════════════════════════════════════

THÔNG TIN BỆNH NHÂN
Tên: ${record.patientName}
Mã BHYT: ${record.insuranceNumber}
Ngày sinh: ${record.dateOfBirth || 'Chưa cập nhật'}
Giới tính: ${record.gender || 'Chưa cập nhật'}
Ngày khám: ${record.examinationStartDate || 'Chưa cập nhật'}

═══════════════════════════════════════════════════════════
I. KẾT QUẢ KHÁM CHÍNH
${data.physicalExamination ? `
Huyết áp: ${data.physicalExamination.blood_pressure || 'N/A'}
Nhịp tim: ${data.physicalExamination.heart_rate || 'N/A'} lần/phút
Nhiệt độ: ${data.physicalExamination.temperature || 'N/A'} °C
Nhịp thở: ${data.physicalExamination.respiratory_rate || 'N/A'} lần/phút
Cân nặng: ${data.physicalExamination.weight || 'N/A'} kg
Chiều cao: ${data.physicalExamination.height || 'N/A'} cm
BMI: ${data.physicalExamination.bmi || 'N/A'}
Ghi chú: ${data.physicalExamination.notes || 'Không có'}
` : 'Chưa hoàn thành'}

═══════════════════════════════════════════════════════════
II. KẾT QUẢ X-QUANG
${data.xrayTest ? `
Loại X-quang: ${data.xrayTest.type || 'Chưa xác định'}
Ngày thực hiện: ${data.xrayTest.date || 'Chưa cập nhật'}
Mô tả: ${data.xrayTest.description || 'Không có'}
Kết luận: ${data.xrayTest.conclusion || 'Chưa cập nhật'}
` : 'Chưa hoàn thành'}

═══════════════════════════════════════════════════════════
III. KẾT QUẢ XÉT NGHIỆM MÁU
${data.labTest ? `
Ngày thực hiện: ${data.labTest.date || 'Chưa cập nhật'}
Kết quả: ${JSON.stringify(data.labTest.results || {}, null, 2)}
Ghi chú: ${data.labTest.notes || 'Không có'}
` : 'Chưa hoàn thành'}

═══════════════════════════════════════════════════════════
IV. CÁC XÉT NGHIỆM KHÁC
${data.otherTests && Object.keys(data.otherTests).length > 0 ? Object.entries(data.otherTests).map(([testName, testData]) => `
${testName}:
  Ngày: ${testData.date || 'Chưa cập nhật'}
  Kết quả: ${testData.result || 'Chưa cập nhật'}
  Ghi chú: ${testData.notes || 'Không có'}
`).join('\n') : 'Không có'}

═══════════════════════════════════════════════════════════
V. KẾT LUẬN TỔNG HỢP
${data.finalConclusion ? `
Tình trạng sức khỏe: ${data.finalConclusion.healthStatus}
Tóm tắt: ${data.finalConclusion.summary}
Khuyến cáo: ${data.finalConclusion.recommendations}
Cần tái khám: ${data.finalConclusion.followUpRequired ? `Có (sau ${data.finalConclusion.followUpDays || 30} ngày)` : 'Không'}
Bác sĩ: ${data.finalConclusion.doctorName || 'Chưa cập nhật'}
Ngày: ${data.finalConclusion.date || 'Chưa cập nhật'}
` : 'Chưa hoàn thành'}

═══════════════════════════════════════════════════════════
Trạng thái: ${record.status}
Lần sửa đổi cuối: ${record.lastModified}
  `

  return report
}
