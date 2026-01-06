import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ECGFormPage.css'

interface ECGFormData {
  // Kỹ thuật
  technician: string
  date: string
  
  // Các thông số ECG
  heartRate: string
  rhythm: string
  
  // Tìm kiếm bất thường
  atrialFinbrillation: boolean
  prematureAtrial: boolean
  prematureVentricular: boolean
  stSegmentChanges: boolean
  tWaveChanges: boolean
  qrsWidenings: boolean
  
  // Mô tả chi tiết
  findings: string
  
  // Kết luận
  conclusion: string
  recommendations: string
  
  // Doctor
  doctorName: string
}

function ECGFormPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ECGFormData>({
    technician: '',
    date: new Date().toISOString().split('T')[0],
    heartRate: '',
    rhythm: 'normal',
    atrialFinbrillation: false,
    prematureAtrial: false,
    prematureVentricular: false,
    stSegmentChanges: false,
    tWaveChanges: false,
    qrsWidenings: false,
    findings: '',
    conclusion: '',
    recommendations: '',
    doctorName: ''
  })

  const handleSave = () => {
    const patientName = localStorage.getItem('currentPatientName')
    if (!patientName) {
      alert('⚠️ Vui lòng quay lại và chọn bệnh nhân!')
      return
    }

    try {
      const record = JSON.parse(localStorage.getItem(`exam_${patientName}`) || '{}')
      record.examinationData = record.examinationData || {}
      record.examinationData.ecgTest = {
        status: 'completed',
        date: formData.date,
        heartRate: formData.heartRate,
        rhythm: formData.rhythm,
        findings: {
          atrialFinbrillation: formData.atrialFinbrillation,
          prematureAtrial: formData.prematureAtrial,
          prematureVentricular: formData.prematureVentricular,
          stSegmentChanges: formData.stSegmentChanges,
          tWaveChanges: formData.tWaveChanges,
          qrsWidenings: formData.qrsWidenings
        },
        description: formData.findings,
        conclusion: formData.conclusion,
        recommendations: formData.recommendations,
        technician: formData.technician,
        doctorName: formData.doctorName
      }
      record.lastModified = new Date().toISOString()

      localStorage.setItem(`exam_${patientName}`, JSON.stringify(record))
      alert('✅ Đã lưu kết quả ECG!')
      navigate('/conclusion')
    } catch (error) {
      console.error('Lỗi:', error)
      alert('❌ Lỗi khi lưu dữ liệu')
    }
  }

  return (
    <div className="ecg-form-page">
      <button className="btn-back" onClick={() => navigate('/examination-menu')}>
        ← Quay Lại
      </button>

      <div className="ecg-container">
        <h2>❤️ ĐIỆN TIM (ECG)</h2>
        <p className="subtitle">Kết quả điện tim 12 chuyên tuyến</p>

        <div className="form-section">
          <h3>Thông Tin Chung</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày Thực Hiện:</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Kỹ Thuật Viên:</label>
              <input
                type="text"
                value={formData.technician}
                onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
                placeholder="Tên kỹ thuật viên"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Các Thông Số ECG</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Nhịp Tim (lần/phút):</label>
              <input
                type="number"
                value={formData.heartRate}
                onChange={(e) => setFormData(prev => ({ ...prev, heartRate: e.target.value }))}
                placeholder="VD: 72"
              />
            </div>
            <div className="form-group">
              <label>Nhịp:</label>
              <select
                value={formData.rhythm}
                onChange={(e) => setFormData(prev => ({ ...prev, rhythm: e.target.value }))}
              >
                <option value="normal">Bình thường</option>
                <option value="irregular">Không đều</option>
                <option value="fast">Nhanh</option>
                <option value="slow">Chậm</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Tìm Kiếm Bất Thường</h3>
          <div className="checkbox-grid">
            <label>
              <input
                type="checkbox"
                checked={formData.atrialFinbrillation}
                onChange={(e) => setFormData(prev => ({ ...prev, atrialFinbrillation: e.target.checked }))}
              />
              Rung nhĩ
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.prematureAtrial}
                onChange={(e) => setFormData(prev => ({ ...prev, prematureAtrial: e.target.checked }))}
              />
              Đánh trước nhĩ
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.prematureVentricular}
                onChange={(e) => setFormData(prev => ({ ...prev, prematureVentricular: e.target.checked }))}
              />
              Đánh trước thất
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.stSegmentChanges}
                onChange={(e) => setFormData(prev => ({ ...prev, stSegmentChanges: e.target.checked }))}
              />
              Thay đổi ST
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.tWaveChanges}
                onChange={(e) => setFormData(prev => ({ ...prev, tWaveChanges: e.target.checked }))}
              />
              Thay đổi sóng T
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.qrsWidenings}
                onChange={(e) => setFormData(prev => ({ ...prev, qrsWidenings: e.target.checked }))}
              />
              Giãn QRS
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Mô Tả Chi Tiết</h3>
          <textarea
            value={formData.findings}
            onChange={(e) => setFormData(prev => ({ ...prev, findings: e.target.value }))}
            placeholder="Mô tả chi tiết các phát hiện..."
            rows={5}
          />
        </div>

        <div className="form-section">
          <h3>Kết Luận</h3>
          <textarea
            value={formData.conclusion}
            onChange={(e) => setFormData(prev => ({ ...prev, conclusion: e.target.value }))}
            placeholder="Kết luận chẩn đoán..."
            rows={4}
          />
        </div>

        <div className="form-section">
          <h3>Khuyến Cáo</h3>
          <textarea
            value={formData.recommendations}
            onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
            placeholder="Khuyến cáo theo dõi..."
            rows={3}
          />
        </div>

        <div className="form-section">
          <h3>Bác Sĩ Chủ Trị</h3>
          <input
            type="text"
            value={formData.doctorName}
            onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
            placeholder="Tên bác sĩ"
          />
        </div>

        <div className="form-actions">
          <button className="btn-save" onClick={handleSave}>
            💾 Lưu Kết Quả ECG
          </button>
          <button className="btn-cancel" onClick={() => navigate('/examination-menu')}>
            ✕ Hủy
          </button>
        </div>
      </div>
    </div>
  )
}

export default ECGFormPage
