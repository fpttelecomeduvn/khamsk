import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../styles/ExaminationResults.css'

const ExaminationResults: FC = () => {
  const navigate = useNavigate()
  const { patientName: paramPatientName } = useParams<{ patientName: string }>()
  const [patientData, setPatientData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get patient name from param or localStorage
    const patient = paramPatientName 
      ? decodeURIComponent(paramPatientName)
      : localStorage.getItem('currentPatientName')
    
    if (!patient) {
      alert('Không tìm thấy thông tin bệnh nhân!')
      navigate('/patient-list')
      return
    }

    // Load data from localStorage
    const savedData = localStorage.getItem(`exam_${patient}`)
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setPatientData(data)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    setLoading(false)
  }, [paramPatientName, navigate])

  if (loading) {
    return (
      <div className="results-page">
        <div className="loading">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (!patientData) {
    return (
      <div className="results-page">
        <div className="no-data">Chưa có dữ liệu khám cho bệnh nhân này</div>
        <button className="btn-back" onClick={() => navigate('/patient-list')}>
          ← Quay Lại
        </button>
      </div>
    )
  }

  const exam = patientData.examinationData || {}

  return (
    <div className="results-page">
      {/* Header */}
      <div className="results-header">
        <button className="btn-back" onClick={() => navigate('/patient-list')}>
          ← Quay Lại
        </button>
        <h1>📋 Kết Quả Khám Sức Khỏe</h1>
        <div className="patient-header-info">
          <div className="patient-detail">
            <span className="label">Bệnh nhân:</span>
            <span className="value">{patientData.fullName}</span>
          </div>
          <div className="patient-detail">
            <span className="label">BHYT:</span>
            <span className="value">{patientData.insuranceNumber || 'N/A'}</span>
          </div>
          <div className="patient-detail">
            <span className="label">Ngày sinh:</span>
            <span className="value">{patientData.dateOfBirth || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="results-container">
        {/* 1. Khám Chính */}
        {exam.mainExamination && (
          <section className="result-section main-exam">
            <div className="section-title">
              <span className="icon">🩺</span>
              <h2>Phiếu Khám Chính</h2>
              <span className="badge completed">✓ Đã hoàn thành</span>
            </div>
            <div className="section-content">
              <div className="info-grid">
                {exam.mainExamination.height && (
                  <div className="info-item">
                    <label>Chiều cao:</label>
                    <span className="value">{exam.mainExamination.height} cm</span>
                  </div>
                )}
                {exam.mainExamination.weight && (
                  <div className="info-item">
                    <label>Cân nặng:</label>
                    <span className="value">{exam.mainExamination.weight} kg</span>
                  </div>
                )}
                {exam.mainExamination.bloodPressure && (
                  <div className="info-item">
                    <label>Huyết áp:</label>
                    <span className="value">{exam.mainExamination.bloodPressure}</span>
                  </div>
                )}
                {exam.mainExamination.heartRate && (
                  <div className="info-item">
                    <label>Nhịp tim:</label>
                    <span className="value">{exam.mainExamination.heartRate} lần/phút</span>
                  </div>
                )}
                {exam.mainExamination.temperature && (
                  <div className="info-item">
                    <label>Nhiệt độ:</label>
                    <span className="value">{exam.mainExamination.temperature}°C</span>
                  </div>
                )}
                {exam.mainExamination.bmi && (
                  <div className="info-item">
                    <label>BMI:</label>
                    <span className="value">{exam.mainExamination.bmi}</span>
                  </div>
                )}
              </div>
              {exam.mainExamination.findings && (
                <div className="findings">
                  <label>Phát hiện:</label>
                  <p>{exam.mainExamination.findings}</p>
                </div>
              )}
              {exam.mainExamination.notes && (
                <div className="notes">
                  <label>Ghi chú:</label>
                  <p>{exam.mainExamination.notes}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 2. X-Quang */}
        {exam.xrayTest && (
          <section className="result-section xray">
            <div className="section-title">
              <span className="icon">📸</span>
              <h2>X-Quang</h2>
              <span className="badge completed">✓ Đã hoàn thành</span>
            </div>
            <div className="section-content">
              {exam.xrayTest.type && (
                <div className="info-item">
                  <label>Loại:</label>
                  <span className="value">{exam.xrayTest.type}</span>
                </div>
              )}
              {exam.xrayTest.date && (
                <div className="info-item">
                  <label>Ngày chụp:</label>
                  <span className="value">{exam.xrayTest.date}</span>
                </div>
              )}
              {exam.xrayTest.description && (
                <div className="findings">
                  <label>Mô tả:</label>
                  <p>{exam.xrayTest.description}</p>
                </div>
              )}
              {exam.xrayTest.findings && (
                <div className="findings">
                  <label>Phát hiện:</label>
                  <p>{exam.xrayTest.findings}</p>
                </div>
              )}
              {exam.xrayTest.conclusion && (
                <div className="conclusion">
                  <label>Kết luận:</label>
                  <p>{exam.xrayTest.conclusion}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 3. ECG */}
        {exam.ecgTest && (
          <section className="result-section ecg">
            <div className="section-title">
              <span className="icon">💓</span>
              <h2>Điện Tim (ECG)</h2>
              <span className="badge completed">✓ Đã hoàn thành</span>
            </div>
            <div className="section-content">
              {exam.ecgTest.heartRate && (
                <div className="info-item">
                  <label>Nhịp tim:</label>
                  <span className="value">{exam.ecgTest.heartRate} lần/phút</span>
                </div>
              )}
              {exam.ecgTest.rhythm && (
                <div className="info-item">
                  <label>Nhịp độ:</label>
                  <span className="value">{exam.ecgTest.rhythm}</span>
                </div>
              )}
              {exam.ecgTest.findings && (
                <div className="findings-list">
                  <label>Phát hiện:</label>
                  <ul>
                    {exam.ecgTest.findings.split('\n').map((finding: string, idx: number) => (
                      <li key={idx}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}
              {exam.ecgTest.conclusion && (
                <div className="conclusion">
                  <label>Kết luận:</label>
                  <p>{exam.ecgTest.conclusion}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. Siêu Âm */}
        {exam.ultrasoundTest && (
          <section className="result-section ultrasound">
            <div className="section-title">
              <span className="icon">🔊</span>
              <h2>Siêu Âm</h2>
              <span className="badge completed">✓ Đã hoàn thành</span>
            </div>
            <div className="section-content">
              {exam.ultrasoundTest.type && (
                <div className="info-item">
                  <label>Loại siêu âm:</label>
                  <span className="value">{exam.ultrasoundTest.type}</span>
                </div>
              )}
              {exam.ultrasoundTest.findings && (
                <div className="findings">
                  <label>Phát hiện:</label>
                  <p>{exam.ultrasoundTest.findings}</p>
                </div>
              )}
              {exam.ultrasoundTest.conclusion && (
                <div className="conclusion">
                  <label>Kết luận:</label>
                  <p>{exam.ultrasoundTest.conclusion}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 5. Huyết Học */}
        {exam.hematologyTest && (
          <section className="result-section hematology">
            <div className="section-title">
              <span className="icon">🩸</span>
              <h2>Xét Nghiệm Huyết Học</h2>
              <span className="badge completed">✓ Đã hoàn thành</span>
            </div>
            <div className="section-content">
              <div className="lab-results">
                {Object.entries(exam.hematologyTest).map(([key, value]: any) => {
                  if (key === 'status' || key === 'date') return null
                  return (
                    <div key={key} className="lab-item">
                      <label>{key.replace(/_/g, ' ')}:</label>
                      <span className="value">{String(value)}</span>
                    </div>
                  )
                })}
              </div>
              {exam.hematologyTest.notes && (
                <div className="notes">
                  <label>Ghi chú:</label>
                  <p>{exam.hematologyTest.notes}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. Sinh Hóa */}
        {exam.biochemistryTest && (
          <section className="result-section biochemistry">
            <div className="section-title">
              <span className="icon">🧬</span>
              <h2>Xét Nghiệm Sinh Hóa</h2>
              <span className="badge completed">✓ Đã hoàn thành</span>
            </div>
            <div className="section-content">
              <div className="lab-results">
                {Object.entries(exam.biochemistryTest).map(([key, value]: any) => {
                  if (key === 'status' || key === 'date') return null
                  return (
                    <div key={key} className="lab-item">
                      <label>{key.replace(/_/g, ' ')}:</label>
                      <span className="value">{String(value)}</span>
                    </div>
                  )
                })}
              </div>
              {exam.biochemistryTest.notes && (
                <div className="notes">
                  <label>Ghi chú:</label>
                  <p>{exam.biochemistryTest.notes}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 7. Nước Tiểu */}
        {exam.urinalysisTest && (
          <section className="result-section urinalysis">
            <div className="section-title">
              <span className="icon">💧</span>
              <h2>Xét Nghiệm Nước Tiểu</h2>
              <span className="badge completed">✓ Đã hoàn thành</span>
            </div>
            <div className="section-content">
              <div className="lab-results">
                {Object.entries(exam.urinalysisTest).map(([key, value]: any) => {
                  if (key === 'status' || key === 'date') return null
                  return (
                    <div key={key} className="lab-item">
                      <label>{key.replace(/_/g, ' ')}:</label>
                      <span className="value">{String(value)}</span>
                    </div>
                  )
                })}
              </div>
              {exam.urinalysisTest.notes && (
                <div className="notes">
                  <label>Ghi chú:</label>
                  <p>{exam.urinalysisTest.notes}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Kết Luận */}
        {exam.conclusion && (
          <section className="result-section conclusion">
            <div className="section-title">
              <span className="icon">✅</span>
              <h2>Kết Luận Tổng Hợp</h2>
              <span className={`badge health-${exam.conclusion.healthLevel || 'good'}`}>
                {exam.conclusion.healthLevel === 'excellent'
                  ? '🟢 Xuất Sắc'
                  : exam.conclusion.healthLevel === 'good'
                  ? '🟦 Tốt'
                  : exam.conclusion.healthLevel === 'fair'
                  ? '🟨 Bình Thường'
                  : '🔴 Cần Theo Dõi'}
              </span>
            </div>
            <div className="section-content">
              {exam.conclusion.conclusion && (
                <div className="conclusion">
                  <label>Kết luận:</label>
                  <p>{exam.conclusion.conclusion}</p>
                </div>
              )}
              {exam.conclusion.recommendations && (
                <div className="recommendations">
                  <label>Khuyến cáo:</label>
                  <p>{exam.conclusion.recommendations}</p>
                </div>
              )}
              {exam.conclusion.doctorName && (
                <div className="doctor-info">
                  <label>Bác sĩ khám:</label>
                  <span className="value">{exam.conclusion.doctorName}</span>
                </div>
              )}
              {exam.conclusion.date && (
                <div className="conclusion-date">
                  <label>Ngày kết luận:</label>
                  <span className="value">{exam.conclusion.date}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Summary - Nếu không có dữ liệu */}
        {!exam.mainExamination &&
          !exam.xrayTest &&
          !exam.ecgTest &&
          !exam.ultrasoundTest &&
          !exam.hematologyTest &&
          !exam.biochemistryTest &&
          !exam.urinalysisTest &&
          !exam.conclusion && (
            <div className="no-results">
              <p>Chưa có dữ liệu khám cho bệnh nhân này</p>
            </div>
          )}
      </div>

      {/* Action Buttons */}
      <div className="results-actions">
        <button className="btn-back" onClick={() => navigate('/patient-list')}>
          ← Quay Lại Danh Sách
        </button>
        <button className="btn-edit" onClick={() => navigate('/')}>
          ✏️ Tiếp Tục Nhập Dữ Liệu
        </button>
      </div>
    </div>
  )
}

export default ExaminationResults
