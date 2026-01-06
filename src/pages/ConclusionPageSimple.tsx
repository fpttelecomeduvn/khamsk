import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ConclusionPage.css'

type HealthLevel = 'excellent' | 'good' | 'fair' | 'poor'

export default function ConclusionPageSimple() {
  const navigate = useNavigate()
  const [conclusion, setConclusion] = useState('')
  const [healthLevel, setHealthLevel] = useState<HealthLevel>('good')
  const [recommendations, setRecommendations] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [patientName, setPatientName] = useState<string>('')
  const [examinationData, setExaminationData] = useState<any>(null)

  useEffect(() => {
    // Get current patient name from localStorage
    const currentPatient = localStorage.getItem('currentPatientName') || ''
    setPatientName(currentPatient)

    if (currentPatient) {
      // Load examination data
      const savedData = localStorage.getItem(`exam_${currentPatient}`)
      if (savedData) {
        try {
          const data = JSON.parse(savedData)
          setExaminationData(data)
          generateSummary(data)
        } catch (error) {
          console.error('Error loading examination data:', error)
        }
      }
    }
  }, [])

  const generateSummary = (data: any) => {
    const parts: string[] = []
    
    if (data.examinationData?.mainExamination?.height) {
      parts.push(`Chiều cao: ${data.examinationData.mainExamination.height} cm`)
    }
    if (data.examinationData?.mainExamination?.weight) {
      parts.push(`Cân nặng: ${data.examinationData.mainExamination.weight} kg`)
    }
    if (data.examinationData?.mainExamination?.findings) {
      parts.push(`Khám chính: ${data.examinationData.mainExamination.findings}`)
    }
    if (data.examinationData?.xrayTest?.findings) {
      parts.push(`X-quang: ${data.examinationData.xrayTest.findings}`)
    }
    if (data.examinationData?.ecgTest?.conclusion) {
      parts.push(`ECG: ${data.examinationData.ecgTest.conclusion}`)
    }
    if (data.examinationData?.ultrasoundTest?.conclusion) {
      parts.push(`Siêu âm: ${data.examinationData.ultrasoundTest.conclusion}`)
    }
    if (data.examinationData?.hematologyTest?.notes) {
      parts.push(`Huyết học: ${data.examinationData.hematologyTest.notes}`)
    }
    if (data.examinationData?.biochemistryTest?.notes) {
      parts.push(`Sinh hóa: ${data.examinationData.biochemistryTest.notes}`)
    }
    if (data.examinationData?.urinalysisTest?.notes) {
      parts.push(`Nước tiểu: ${data.examinationData.urinalysisTest.notes}`)
    }

    const summary = parts.length > 0 
      ? parts.join('\n') 
      : 'Khám sức khỏe định kỳ'
    
    setConclusion(summary)
  }

  const handleSave = () => {
    if (!patientName) {
      alert('Không tìm thấy thông tin bệnh nhân!')
      return
    }

    const record = {
      ...examinationData,
      examinationData: {
        ...examinationData?.examinationData,
        conclusion: {
          status: 'completed',
          healthLevel,
          conclusion,
          recommendations,
          doctorName,
          date: new Date().toISOString().split('T')[0]
        }
      }
    }

    localStorage.setItem(`exam_${patientName}`, JSON.stringify(record))
    alert('✅ Kết luận đã được lưu!')
    navigate('/patient-list')
  }

  return (
    <div className="conclusion-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/patient-list')}>
          ← Quay Lại
        </button>
        <h2>✅ Kết Luận Khám Sức Khỏe</h2>
        {patientName && <p className="patient-info">Bệnh nhân: <strong>{patientName}</strong></p>}
      </div>

      <div className="conclusion-form">
        {/* Examination Summary */}
        <div className="form-section">
          <h3>📋 Tóm Tắt Dữ Liệu Khám</h3>
          {examinationData ? (
            <div className="exam-summary">
              {examinationData.examinationData?.mainExamination && (
                <div className="summary-item">
                  <strong>Khám Chính:</strong> Đã nhập ✓
                </div>
              )}
              {examinationData.examinationData?.xrayTest && (
                <div className="summary-item">
                  <strong>X-Quang:</strong> Đã nhập ✓
                </div>
              )}
              {examinationData.examinationData?.ecgTest && (
                <div className="summary-item">
                  <strong>ECG:</strong> Đã nhập ✓
                </div>
              )}
              {examinationData.examinationData?.ultrasoundTest && (
                <div className="summary-item">
                  <strong>Siêu Âm:</strong> Đã nhập ✓
                </div>
              )}
              {examinationData.examinationData?.hematologyTest && (
                <div className="summary-item">
                  <strong>Huyết Học:</strong> Đã nhập ✓
                </div>
              )}
              {examinationData.examinationData?.biochemistryTest && (
                <div className="summary-item">
                  <strong>Sinh Hóa:</strong> Đã nhập ✓
                </div>
              )}
              {examinationData.examinationData?.urinalysisTest && (
                <div className="summary-item">
                  <strong>Nước Tiểu:</strong> Đã nhập ✓
                </div>
              )}
            </div>
          ) : (
            <p className="no-data">Chưa có dữ liệu khám</p>
          )}
        </div>

        {/* Conclusion Form */}
        <div className="form-section">
          <h3>📝 Kết Luận</h3>

          <div className="form-group">
            <label>Tóm Tắt Kết Quả Khám *</label>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              placeholder="Tóm tắt các kết quả khám..."
              rows={6}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Tình Trạng Sức Khỏe *</label>
            <select
              value={healthLevel}
              onChange={(e) => setHealthLevel(e.target.value as HealthLevel)}
              className="form-control"
            >
              <option value="excellent">Tuyệt vời - Sức khỏe rất tốt</option>
              <option value="good">Tốt - Sức khỏe bình thường</option>
              <option value="fair">Trung bình - Cần chú ý</option>
              <option value="poor">Yếu - Cần theo dõi sâu</option>
            </select>
          </div>

          <div className="form-group">
            <label>Khuyến Cáo</label>
            <textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Khuyến cáo cho bệnh nhân..."
              rows={4}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Bác Sĩ Khám</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Tên bác sĩ"
              className="form-control"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button 
            onClick={handleSave}
            className="btn-primary"
          >
            💾 Lưu Kết Luận
          </button>
          <button 
            onClick={() => navigate('/patient-list')}
            className="btn-secondary"
          >
            ✕ Hủy
          </button>
        </div>
      </div>
    </div>
  )
}
