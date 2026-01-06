// Script để khởi tạo dữ liệu mẫu vào localStorage
// Chạy script này trong console browser hoặc tại App.tsx

export const initializeSampleData = () => {
  const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]')
  
  // Nếu đã có dữ liệu, không khởi tạo lại
  if (existingPatients.length > 0) {
    return
  }

  const samplePatient = {
    id: 'TK431981610337',
    insuranceNumber: 'TK431981610337',
    fullName: 'Phạm Đức Ngọc',
    dateOfBirth: '1991-08-20',
    gender: 'male',
    phoneNumber: '0912345678',
    address: 'Hải An, Hải Phòng',
    email: 'pham.duc.ngoc@example.com',
    lastExaminationDate: new Date().toISOString().split('T')[0],
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    mainExamination: {
      height: 170,
      weight: 75,
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 37,
      respiratoryRate: 18,
      bmi: 25.95
    },
    xrayTests: [],
    ecgTests: [],
    ultrasoundTests: [],
    hematologyTests: [],
    biochemistryTests: [],
    urinalysisTests: [],
    examinationData: {}
  }

  localStorage.setItem('patients', JSON.stringify([samplePatient]))
  console.log('✓ Đã khởi tạo dữ liệu mẫu bệnh nhân:', samplePatient)
}
