import { useState } from 'react'
import { PatientRecord } from '../../types'
import '../../styles/MainExaminationSheet.css'

interface MainExaminationSheetProps {
  patientId?: string
  onSave?: (patient: PatientRecord) => void
}

interface ScreeningQuestions {
  hypertension?: boolean
  diabetes?: boolean
  highCholesterol?: boolean
  cardiovascularDisease?: boolean
  respiratoryDisease?: boolean
  malignantTumor?: boolean
  cigarettes?: boolean
  alcohol?: boolean
  otherRisk?: string
}

interface PhysicalExam {
  pulse?: string
  respiratoryRate?: string
  temperature?: string
  generalAppearance?: string
  headNeck?: string
  lungs?: string
  heart?: string
  abdomen?: string
  lowerLimbs?: string
  neurological?: string
  mental?: string
  other?: string
}

interface LabTests {
  // Sinh hóa máu
  glucose?: string
  totalCholesterol?: string
  triglycerides?: string
  hdlCholesterol?: string
  ldlCholesterol?: string
  creatinine?: string
  urea?: string
  ast?: string
  alt?: string
  alkalinePhosphatase?: string
  totalProtein?: string
  albumin?: string
  
  // Xét nghiệm nước tiểu
  urinColor?: string
  urinClarity?: string
  urinGlucose?: string
  urinProtein?: string
  urinNitrite?: string
  urinLeukocyte?: string
  
  // Huyết học
  redBloodCell?: string
  whiteBloodCell?: string
  hemoglobin?: string
  hematocrit?: string
  platelets?: string
  
  // Khác
  ecgFindings?: string
  ultrasoundFindings?: string
  xrayFindings?: string
}

function MainExaminationSheet({ patientId, onSave }: MainExaminationSheetProps) {
  const [patient, setPatient] = useState<PatientRecord>({
    id: patientId || '',
    insuranceNumber: '',
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    phoneNumber: '',
    address: '',
    email: '',
    examinationDate: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    generalNotes: '',
    biochemistryTests: [],
    hematologyTests: [],
    urinalysisTests: [],
    xrayTests: [],
    ultrasoundTests: [],
    ecgTests: [],
    finalDiagnosis: '',
    recommendations: '',
    examinationStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [screening, setScreening] = useState<ScreeningQuestions>({})
  const [physicalExam, setPhysicalExam] = useState<PhysicalExam>({})
  const [labTests, setLabTests] = useState<LabTests>({})

  const handleChange = (field: keyof PatientRecord, value: any) => {
    setPatient(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleScreeningChange = (field: keyof ScreeningQuestions, value: any) => {
    setScreening(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhysicalExamChange = (field: keyof PhysicalExam, value: any) => {
    setPhysicalExam(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLabTestsChange = (field: keyof LabTests, value: any) => {
    setLabTests(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    const updatedPatient = {
      ...patient,
      generalNotes: JSON.stringify({ screening, physicalExam, labTests })
    }
    if (onSave) {
      onSave(updatedPatient)
    }
  }

  const addXrayTest = () => {
    const newXrayTest = {
      id: Date.now().toString(),
      date: patient.examinationDate,
      type: 'other' as const,
      findings: 'Nhập kết quả X-quang tại đây',
      notes: ''
    }
    setPatient(prev => ({
      ...prev,
      xrayTests: [...prev.xrayTests, newXrayTest]
    }))
  }

  const updateXrayTest = (id: string, field: string, value: string) => {
    setPatient(prev => ({
      ...prev,
      xrayTests: prev.xrayTests.map(test =>
        test.id === id ? { ...test, [field]: value } : test
      )
    }))
  }

  const deleteXrayTest = (id: string) => {
    setPatient(prev => ({
      ...prev,
      xrayTests: prev.xrayTests.filter(test => test.id !== id)
    }))
  }

  const calculateBMI = () => {
    const height = parseFloat(patient.height)
    const weight = parseFloat(patient.weight)
    if (height && weight) {
      const bmi = weight / ((height / 100) ** 2)
      return bmi.toFixed(2)
    }
    return '-'
  }

  const calculateAge = () => {
    if (!patient.dateOfBirth) return '-'
    const today = new Date()
    const birthDate = new Date(patient.dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="main-examination-sheet">
      <div className="sheet-header">
        <h2>📋 PHIẾU KHÁM SỨC KHỎE ĐỊNH KỲ</h2>
        <p className="header-subtitle">Công Hòa Xã Hội Chủ Nghĩa Việt Nam - Độc Lập, Tự Do, Hạnh Phúc</p>
      </div>

      {/* I. THÔNG TIN BỆNH NHÂN */}
      <div className="sheet-section">
        <h3>I. THÔNG TIN BỆNH NHÂN</h3>
        
        <div className="form-grid-3">
          <div className="form-group">
            <label>Số Thẻ Bảo Hiểm Y Tế / CCCD</label>
            <input
              type="text"
              value={patient.insuranceNumber}
              onChange={(e) => handleChange('insuranceNumber', e.target.value)}
              placeholder="BH123456789"
            />
          </div>

          <div className="form-group">
            <label>Họ và Tên</label>
            <input
              type="text"
              value={patient.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="form-group">
            <label>Giới Tính</label>
            <select
              value={patient.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ngày Sinh</label>
            <input
              type="date"
              value={patient.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Tuổi</label>
            <input
              type="text"
              value={calculateAge()}
              disabled
              className="disabled-field"
            />
          </div>

          <div className="form-group">
            <label>Ngày Khám</label>
            <input
              type="date"
              value={patient.examinationDate}
              onChange={(e) => handleChange('examinationDate', e.target.value)}
            />
          </div>

          <div className="form-group full-width">
            <label>Địa Chỉ</label>
            <input
              type="text"
              value={patient.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Địa chỉ đầy đủ"
            />
          </div>

          <div className="form-group">
            <label>Số Điện Thoại</label>
            <input
              type="tel"
              value={patient.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="0912345678"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={patient.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
        </div>
      </div>

      {/* II. CÂU HỎI SÀNG LỌC */}
      <div className="sheet-section">
        <h3>II. CÂU HỎI SÀNG LỌC BỆNH LÝ</h3>
        
        <div className="screening-questions">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="hypertension"
              checked={screening.hypertension || false}
              onChange={(e) => handleScreeningChange('hypertension', e.target.checked)}
            />
            <label htmlFor="hypertension">Tăng huyết áp</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="diabetes"
              checked={screening.diabetes || false}
              onChange={(e) => handleScreeningChange('diabetes', e.target.checked)}
            />
            <label htmlFor="diabetes">Tiểu đường</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="highCholesterol"
              checked={screening.highCholesterol || false}
              onChange={(e) => handleScreeningChange('highCholesterol', e.target.checked)}
            />
            <label htmlFor="highCholesterol">Cholesterol cao</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="cardiovascularDisease"
              checked={screening.cardiovascularDisease || false}
              onChange={(e) => handleScreeningChange('cardiovascularDisease', e.target.checked)}
            />
            <label htmlFor="cardiovascularDisease">Bệnh tim mạch</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="respiratoryDisease"
              checked={screening.respiratoryDisease || false}
              onChange={(e) => handleScreeningChange('respiratoryDisease', e.target.checked)}
            />
            <label htmlFor="respiratoryDisease">Bệnh hô hấp</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="malignantTumor"
              checked={screening.malignantTumor || false}
              onChange={(e) => handleScreeningChange('malignantTumor', e.target.checked)}
            />
            <label htmlFor="malignantTumor">Khối u</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="cigarettes"
              checked={screening.cigarettes || false}
              onChange={(e) => handleScreeningChange('cigarettes', e.target.checked)}
            />
            <label htmlFor="cigarettes">Hút thuốc lá</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="alcohol"
              checked={screening.alcohol || false}
              onChange={(e) => handleScreeningChange('alcohol', e.target.checked)}
            />
            <label htmlFor="alcohol">Uống rượu bia</label>
          </div>

          <div className="form-group full-width">
            <label>Yếu tố nguy hiểm khác</label>
            <textarea
              value={screening.otherRisk || ''}
              onChange={(e) => handleScreeningChange('otherRisk', e.target.value)}
              placeholder="Mô tả yếu tố nguy hiểm khác"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* III. KHÁM TOÀN THÂN */}
      <div className="sheet-section">
        <h3>III. KHÁM TOÀN THÂN</h3>
        
        <div className="form-grid-3">
          <div className="form-group">
            <label>Chiều Cao (cm)</label>
            <input
              type="number"
              value={patient.height}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="170"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Cân Nặng (kg)</label>
            <input
              type="number"
              value={patient.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="70"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>BMI</label>
            <input
              type="text"
              value={calculateBMI()}
              disabled
              className="disabled-field"
            />
          </div>

          <div className="form-group">
            <label>Huyết Áp (mmHg)</label>
            <input
              type="text"
              value={patient.bloodPressure}
              onChange={(e) => handleChange('bloodPressure', e.target.value)}
              placeholder="120/80"
            />
          </div>

          <div className="form-group">
            <label>Nhịp Tim (lần/phút)</label>
            <input
              type="number"
              value={patient.heartRate}
              onChange={(e) => handleChange('heartRate', e.target.value)}
              placeholder="72"
            />
          </div>

          <div className="form-group">
            <label>Nhịp Thở (lần/phút)</label>
            <input
              type="number"
              value={physicalExam.respiratoryRate || ''}
              onChange={(e) => handlePhysicalExamChange('respiratoryRate', e.target.value)}
              placeholder="16"
            />
          </div>

          <div className="form-group">
            <label>Nhiệt Độ (°C)</label>
            <input
              type="number"
              value={patient.temperature || ''}
              onChange={(e) => handleChange('temperature', e.target.value)}
              placeholder="36.5"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Mạch (lần/phút)</label>
            <input
              type="number"
              value={physicalExam.pulse || ''}
              onChange={(e) => handlePhysicalExamChange('pulse', e.target.value)}
              placeholder="72"
            />
          </div>
        </div>

        <div className="physical-exam-details">
          <h4>Chi tiết Khám Thể Lực</h4>
          
          <div className="form-grid-2">
            <div className="form-group">
              <label>Tổng Quát</label>
              <textarea
                value={physicalExam.generalAppearance || ''}
                onChange={(e) => handlePhysicalExamChange('generalAppearance', e.target.value)}
                placeholder="Tình trạng chung"
                rows={2}
              />
            </div>

            <div className="form-group">
              <label>Đầu, Cổ</label>
              <textarea
                value={physicalExam.headNeck || ''}
                onChange={(e) => handlePhysicalExamChange('headNeck', e.target.value)}
                placeholder="Kết quả khám đầu cổ"
                rows={2}
              />
            </div>

            <div className="form-group">
              <label>Phổi, Phế Quản</label>
              <textarea
                value={physicalExam.lungs || ''}
                onChange={(e) => handlePhysicalExamChange('lungs', e.target.value)}
                placeholder="Kết quả khám phổi"
                rows={2}
              />
            </div>

            <div className="form-group">
              <label>Tim, Mạch Máu</label>
              <textarea
                value={physicalExam.heart || ''}
                onChange={(e) => handlePhysicalExamChange('heart', e.target.value)}
                placeholder="Kết quả khám tim"
                rows={2}
              />
            </div>

            <div className="form-group">
              <label>Bụng</label>
              <textarea
                value={physicalExam.abdomen || ''}
                onChange={(e) => handlePhysicalExamChange('abdomen', e.target.value)}
                placeholder="Kết quả khám bụng"
                rows={2}
              />
            </div>

            <div className="form-group">
              <label>Chi Dưới</label>
              <textarea
                value={physicalExam.lowerLimbs || ''}
                onChange={(e) => handlePhysicalExamChange('lowerLimbs', e.target.value)}
                placeholder="Kết quả khám chi dưới"
                rows={2}
              />
            </div>

            <div className="form-group">
              <label>Thần Kinh</label>
              <textarea
                value={physicalExam.neurological || ''}
                onChange={(e) => handlePhysicalExamChange('neurological', e.target.value)}
                placeholder="Kết quả khám thần kinh"
                rows={2}
              />
            </div>

            <div className="form-group">
              <label>Tâm Thần, Hành Vi</label>
              <textarea
                value={physicalExam.mental || ''}
                onChange={(e) => handlePhysicalExamChange('mental', e.target.value)}
                placeholder="Kết quả khám tâm thần"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* IV. KẾT QUẢ XÉT NGHIỆM */}
      <div className="sheet-section">
        <h3>IV. KẾT QUẢ XÉT NGHIỆM CẬN LÂM SÀNG</h3>
        
        <div className="lab-tests-container">
          <div className="lab-section">
            <h4>1. XÉT NGHIỆM SINH HÓA MÁU</h4>
            <div className="form-grid-3">
              <div className="form-group">
                <label>Glucose (mg/dL)</label>
                <input type="text" value={labTests.glucose || ''} onChange={(e) => handleLabTestsChange('glucose', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Cholesterol Toàn Phần (mg/dL)</label>
                <input type="text" value={labTests.totalCholesterol || ''} onChange={(e) => handleLabTestsChange('totalCholesterol', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Triglycerides (mg/dL)</label>
                <input type="text" value={labTests.triglycerides || ''} onChange={(e) => handleLabTestsChange('triglycerides', e.target.value)} />
              </div>
              <div className="form-group">
                <label>HDL (mg/dL)</label>
                <input type="text" value={labTests.hdlCholesterol || ''} onChange={(e) => handleLabTestsChange('hdlCholesterol', e.target.value)} />
              </div>
              <div className="form-group">
                <label>LDL (mg/dL)</label>
                <input type="text" value={labTests.ldlCholesterol || ''} onChange={(e) => handleLabTestsChange('ldlCholesterol', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Creatinine (mg/dL)</label>
                <input type="text" value={labTests.creatinine || ''} onChange={(e) => handleLabTestsChange('creatinine', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Urea (mg/dL)</label>
                <input type="text" value={labTests.urea || ''} onChange={(e) => handleLabTestsChange('urea', e.target.value)} />
              </div>
              <div className="form-group">
                <label>AST (U/L)</label>
                <input type="text" value={labTests.ast || ''} onChange={(e) => handleLabTestsChange('ast', e.target.value)} />
              </div>
              <div className="form-group">
                <label>ALT (U/L)</label>
                <input type="text" value={labTests.alt || ''} onChange={(e) => handleLabTestsChange('alt', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="lab-section">
            <h4>2. XÉT NGHIỆM NƯỚC TIỂU</h4>
            <div className="form-grid-3">
              <div className="form-group">
                <label>Màu Sắc</label>
                <input type="text" value={labTests.urinColor || ''} onChange={(e) => handleLabTestsChange('urinColor', e.target.value)} placeholder="Vàng nhạt" />
              </div>
              <div className="form-group">
                <label>Độ Trong</label>
                <input type="text" value={labTests.urinClarity || ''} onChange={(e) => handleLabTestsChange('urinClarity', e.target.value)} placeholder="Trong" />
              </div>
              <div className="form-group">
                <label>Glucose</label>
                <input type="text" value={labTests.urinGlucose || ''} onChange={(e) => handleLabTestsChange('urinGlucose', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Protein</label>
                <input type="text" value={labTests.urinProtein || ''} onChange={(e) => handleLabTestsChange('urinProtein', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Nitrite</label>
                <input type="text" value={labTests.urinNitrite || ''} onChange={(e) => handleLabTestsChange('urinNitrite', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Leukocyte</label>
                <input type="text" value={labTests.urinLeukocyte || ''} onChange={(e) => handleLabTestsChange('urinLeukocyte', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="lab-section">
            <h4>3. XÉT NGHIỆM HUYẾT HỌC</h4>
            <div className="form-grid-3">
              <div className="form-group">
                <label>Hồng Cầu (10^12/L)</label>
                <input type="text" value={labTests.redBloodCell || ''} onChange={(e) => handleLabTestsChange('redBloodCell', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Trắng Cầu (10^9/L)</label>
                <input type="text" value={labTests.whiteBloodCell || ''} onChange={(e) => handleLabTestsChange('whiteBloodCell', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Hemoglobin (g/dL)</label>
                <input type="text" value={labTests.hemoglobin || ''} onChange={(e) => handleLabTestsChange('hemoglobin', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Hematocrit (%)</label>
                <input type="text" value={labTests.hematocrit || ''} onChange={(e) => handleLabTestsChange('hematocrit', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Tiểu Cầu (10^9/L)</label>
                <input type="text" value={labTests.platelets || ''} onChange={(e) => handleLabTestsChange('platelets', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="lab-section">
            <h4>4. SIÊU ÂM / ĐIỆN TIM / X-QUANG</h4>
            <div className="form-grid-2">
              <div className="form-group full-width">
                <label>Kết Quả Điện Tim (ECG)</label>
                <textarea
                  value={labTests.ecgFindings || ''}
                  onChange={(e) => handleLabTestsChange('ecgFindings', e.target.value)}
                  placeholder="Kết quả ECG"
                  rows={2}
                />
              </div>
              <div className="form-group full-width">
                <label>Kết Quả Siêu Âm</label>
                <textarea
                  value={labTests.ultrasoundFindings || ''}
                  onChange={(e) => handleLabTestsChange('ultrasoundFindings', e.target.value)}
                  placeholder="Kết quả siêu âm"
                  rows={2}
                />
              </div>
              <div className="form-group full-width">
                <label>Kết Quả X-Quang Tóm Tắt</label>
                <textarea
                  value={labTests.xrayFindings || ''}
                  onChange={(e) => handleLabTestsChange('xrayFindings', e.target.value)}
                  placeholder="Kết quả X-quang tóm tắt"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="lab-section">
            <h4>📋 DANH SÁCH KẾT QUẢ X-QUANG CHI TIẾT</h4>
            <button className="btn-add-test" onClick={addXrayTest}>
              ➕ Thêm Kết Quả X-Quang
            </button>

            {patient.xrayTests.length > 0 ? (
              <div className="xray-tests-list">
                {patient.xrayTests.map((test, index) => (
                  <div key={test.id} className="xray-test-item">
                    <div className="test-header">
                      <h5>X-Quang #{index + 1}</h5>
                      <button
                        className="btn-delete-test"
                        onClick={() => deleteXrayTest(test.id)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Ngày Chụp</label>
                        <input
                          type="date"
                          value={test.date}
                          onChange={(e) => updateXrayTest(test.id, 'date', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Loại X-Quang</label>
                        <select
                          value={test.type}
                          onChange={(e) => updateXrayTest(test.id, 'type', e.target.value)}
                        >
                          <option value="chest">Ngực</option>
                          <option value="abdomen">Bụng</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>

                      <div className="form-group full-width">
                        <label>Kết Quả Chụp</label>
                        <textarea
                          value={test.findings || ''}
                          onChange={(e) => updateXrayTest(test.id, 'findings', e.target.value)}
                          placeholder="Mô tả kết quả chụp X-quang"
                          rows={3}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Ghi Chú</label>
                        <textarea
                          value={test.notes || ''}
                          onChange={(e) => updateXrayTest(test.id, 'notes', e.target.value)}
                          placeholder="Ghi chú thêm"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-tests">
                <p>Chưa có kết quả X-quang nào. Nhấp "Thêm Kết Quả X-Quang" để bổ sung.</p>
              </div>
            )}

            <div className="xray-section-actions">
              <button className="btn-save-xray" onClick={() => {
                alert(`Đã lưu ${patient.xrayTests.length} kết quả X-quang!`);
              }}>
                💾 Lưu Kết Quả X-Quang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* V. KẾT LUẬN */}
      <div className="sheet-section">
        <h3>V. KẾT LUẬN VÀ KHUYẾN CÁO</h3>
        
        <div className="form-grid-2">
          <div className="form-group full-width">
            <label>Phân Loại Sức Khỏe</label>
            <select
              value={patient.examinationStatus}
              onChange={(e) => handleChange('examinationStatus', e.target.value)}
            >
              <option value="pending">Chưa bắt đầu</option>
              <option value="in-progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Chẩn Đoán</label>
            <textarea
              value={patient.finalDiagnosis || ''}
              onChange={(e) => handleChange('finalDiagnosis', e.target.value)}
              placeholder="Chẩn đoán cuối cùng"
              rows={4}
            />
          </div>

          <div className="form-group full-width">
            <label>Khuyến Cáo / Hướng Dẫn Điều Trị</label>
            <textarea
              value={patient.recommendations || ''}
              onChange={(e) => handleChange('recommendations', e.target.value)}
              placeholder="Hướng dẫn và khuyến cáo cho bệnh nhân"
              rows={4}
            />
          </div>

          <div className="form-group full-width">
            <label>Tiền Sử Bệnh</label>
            <textarea
              value={patient.medicalHistory || ''}
              onChange={(e) => handleChange('medicalHistory', e.target.value)}
              placeholder="Tiền sử bệnh của bệnh nhân"
              rows={3}
            />
          </div>

          <div className="form-group full-width">
            <label>Dị Ứng</label>
            <textarea
              value={patient.allergies || ''}
              onChange={(e) => handleChange('allergies', e.target.value)}
              placeholder="Các chất dị ứng nếu có"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="sheet-actions">
        <button className="btn-save" onClick={handleSave}>
          💾 Lưu Phiếu Khám
        </button>
      </div>
    </div>
  )
}

export default MainExaminationSheet
