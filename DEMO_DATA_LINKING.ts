/**
 * DEMO: Cách Liên Kết Dữ Liệu Khám Bệnh
 * 
 * File này cho thấy cách các hàm utility được sử dụng
 * để liên kết dữ liệu từ các phần khám thành 1 bệnh án hoàn chỉnh
 */

import {
  initializePatientExamination,
  updatePhysicalExamination,
  updateXrayTest,
  updateLabTest,
  updateOtherTest,
  updateFinalConclusion,
  getPatientExaminationData,
  getCompletionStatus,
  generateFullMedicalReport
} from './src/utils/examinationDataManager'

// ═══════════════════════════════════════════════════════════════
// SCENARIO: Khám bệnh nhân Nguyễn Văn A
// ═══════════════════════════════════════════════════════════════

const insuranceNumber = 'BH2024001'
const patientName = 'Nguyễn Văn A'
const dateOfBirth = '1990-05-15'
const gender = 'male'

console.log('📋 BẮT ĐẦU QÙÌNH TRÌNH KHÁM BỆNH')
console.log(`Bệnh nhân: ${patientName} (${insuranceNumber})`)
console.log('═══════════════════════════════════════════════════════════════')

// ═══════════════════════════════════════════════════════════════
// BƯỚC 1: KHÁM CHÍNH
// ═══════════════════════════════════════════════════════════════
console.log('\n📌 BƯỚC 1: KHÁM CHÍNH')

// Khởi tạo bệnh án mới
initializePatientExamination(insuranceNumber, patientName, dateOfBirth, gender)

// Cập nhật kết quả khám chính
updatePhysicalExamination(insuranceNumber, {
  blood_pressure: '120/80 mmHg',
  heart_rate: 72,
  temperature: 36.5,
  respiratory_rate: 18,
  weight: 70,
  height: 175,
  bmi: 22.86,
  notes: 'Bệnh nhân khỏe mạnh, không có triệu chứng bất thường'
})

console.log('✅ Đã lưu dữ liệu khám chính')

// Kiểm tra dữ liệu
let record = getPatientExaminationData(insuranceNumber)
console.log('Huyết áp:', record?.examinationData.physicalExamination?.blood_pressure)
console.log('BMI:', record?.examinationData.physicalExamination?.bmi)

// ═══════════════════════════════════════════════════════════════
// BƯỚC 2: X-QUANG
// ═══════════════════════════════════════════════════════════════
console.log('\n📌 BƯỚC 2: X-QUANG')

updateXrayTest(insuranceNumber, {
  status: 'completed',
  type: 'Chụp X-quang tim phổi thẳng',
  description: 'Phổi hai bên trong sáng, không có bóng mờ bất thường. Tim không to. Xương sườn bình thường.',
  conclusion: 'Kết quả bình thường, không phát hiện bệnh lý'
})

console.log('✅ Đã lưu kết quả X-Quang')

record = getPatientExaminationData(insuranceNumber)
console.log('Loại X-Quang:', record?.examinationData.xrayTest?.type)
console.log('Kết luận:', record?.examinationData.xrayTest?.conclusion)

// ═══════════════════════════════════════════════════════════════
// BƯỚC 3: XÉT NGHIỆM MÁU
// ═══════════════════════════════════════════════════════════════
console.log('\n📌 BƯỚC 3: XÉT NGHIỆM MÁU')

updateLabTest(insuranceNumber, {
  status: 'completed',
  results: {
    'RBC': '4.8',
    'WBC': '7.2',
    'Hb': '15.5 g/dL',
    'Hct': '46%',
    'MCV': '96',
    'Cholesterol': '190 mg/dL',
    'Glucose': '95 mg/dL',
    'Creatinine': '0.9 mg/dL',
    'AST': '28 U/L',
    'ALT': '32 U/L'
  },
  normalValues: {
    'RBC': '4.5-5.9',
    'WBC': '4.5-11.0',
    'Hb': '13.5-17.5 g/dL',
    'Hct': '40-54%'
  },
  notes: 'Tất cả chỉ số trong giới hạn bình thường'
})

console.log('✅ Đã lưu kết quả xét nghiệm máu')

record = getPatientExaminationData(insuranceNumber)
const labResults = record?.examinationData.labTest?.results
console.log('RBC:', labResults?.RBC)
console.log('Glucose:', labResults?.Glucose)

// ═══════════════════════════════════════════════════════════════
// BƯỚC 4: XÉT NGHIỆM KHÁC (ECG)
// ═══════════════════════════════════════════════════════════════
console.log('\n📌 BƯỚC 4: XÉT NGHIỆM KHÁC (ECG)')

updateOtherTest(insuranceNumber, 'ECG', {
  result: 'Nhịp xoang đều, không có bất thường'
})

updateOtherTest(insuranceNumber, 'Siêu âm tim', {
  result: 'Kích thước và chức năng tim bình thường'
})

console.log('✅ Đã lưu kết quả ECG và Siêu âm')

record = getPatientExaminationData(insuranceNumber)
console.log('ECG:', record?.examinationData.otherTests?.['ECG']?.result)
console.log('Siêu âm tim:', record?.examinationData.otherTests?.['Siêu âm tim']?.result)

// ═══════════════════════════════════════════════════════════════
// BƯỚC 5: KIỂM TRA TRẠNG THÁI HOÀN THÀNH
// ═══════════════════════════════════════════════════════════════
console.log('\n📌 BƯỚC 5: TRẠNG THÁI HOÀN THÀNH')

const completionStatus = getCompletionStatus(insuranceNumber)
console.log('Khám chính:', completionStatus?.physicalExamination ? '✅' : '⏳')
console.log('X-Quang:', completionStatus?.xrayTest ? '✅' : '⏳')
console.log('Xét nghiệm máu:', completionStatus?.labTest ? '✅' : '⏳')
console.log('Xét nghiệm khác:', completionStatus?.otherTests ? '✅' : '⏳')
console.log('Kết luận:', completionStatus?.finalConclusion ? '✅' : '⏳')

// ═══════════════════════════════════════════════════════════════
// BƯỚC 6: KẾT LUẬN TỔNG KẾT
// ═══════════════════════════════════════════════════════════════
console.log('\n📌 BƯỚC 6: KẾT LUẬN TỔNG KẾT')

updateFinalConclusion(insuranceNumber, {
  healthStatus: 'excellent',
  summary: `Bệnh nhân ${patientName} có tình trạng sức khỏe xuất sắc. Tất cả các chỉ số sinh hiệu bình thường, kết quả hình ảnh không có bất thường. Xét nghiệm máu và ECG đều trong giới hạn bình thường.`,
  recommendations: 'Duy trì chế độ sống lành mạnh, tập thể dục thường xuyên, ăn uống cân bằng, tránh stress.',
  followUpRequired: false,
  doctorName: 'Bs. Trần Đức Minh',
  date: new Date().toISOString().split('T')[0]
})

console.log('✅ Đã lưu kết luận tổng kết')

record = getPatientExaminationData(insuranceNumber)
console.log('Tình trạng sức khỏe:', record?.examinationData.finalConclusion?.healthStatus)
console.log('Bác sĩ:', record?.examinationData.finalConclusion?.doctorName)
console.log('Trạng thái bệnh án:', record?.status)

// ═══════════════════════════════════════════════════════════════
// BƯỚC 7: XUẤT BÁO CÁO Y TẾ
// ═══════════════════════════════════════════════════════════════
console.log('\n📌 BƯỚC 7: XUẤT BÁO CÁO Y TẾ TOÀN BỘ')

const fullReport = generateFullMedicalReport(insuranceNumber)
console.log(fullReport)

// ═══════════════════════════════════════════════════════════════
// KIỂM TRA DỮ LIỆU TRONG LOCALSTORAGE
// ═══════════════════════════════════════════════════════════════
console.log('\n📌 KIỂM TRA LOCALSTORAGE')
console.log('Dữ liệu lưu trong localStorage:')

const storageData = JSON.parse(
  localStorage.getItem(`exam_${insuranceNumber}`) || '{}'
)
console.log(JSON.stringify(storageData, null, 2))

// ═══════════════════════════════════════════════════════════════
// TRUY VẤN DỮ LIỆU
// ═══════════════════════════════════════════════════════════════
console.log('\n📌 CÁC CÁCH TRUY VẤN DỮ LIỆU')

// Cách 1: Lấy toàn bộ bệnh án
const completeRecord = getPatientExaminationData(insuranceNumber)
console.log('Cách 1 - Toàn bộ bệnh án:', completeRecord)

// Cách 2: Lấy từng phần riêng biệt
console.log('Cách 2 - Từng phần:')
console.log('  Khám chính:', completeRecord?.examinationData.physicalExamination)
console.log('  X-Quang:', completeRecord?.examinationData.xrayTest)
console.log('  Xét nghiệm máu:', completeRecord?.examinationData.labTest)
console.log('  Kết luận:', completeRecord?.examinationData.finalConclusion)

// Cách 3: Kiểm tra hoàn thành
console.log('Cách 3 - Trạng thái hoàn thành:', getCompletionStatus(insuranceNumber))

console.log('\n═══════════════════════════════════════════════════════════════')
console.log('✅ HOÀN THÀNH QUÉ TRÌNH KHÁM BỆNH')
console.log('═══════════════════════════════════════════════════════════════')
