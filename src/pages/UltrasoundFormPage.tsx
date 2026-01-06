import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/UltrasoundFormPage.css'

interface UltrasoundFormData {
  // Kỹ thuật
  technician: string
  date: string
  ultrasoundType: string
  
  // Organs
  liver: string
  gallbladder: string
  pancreas: string
  spleen: string
  leftKidney: string
  rightKidney: string
  
  // Mô tả
  findings: string
  
  // Kết luận
  conclusion: string
  recommendations: string
  
  // Doctor
  doctorName: string
}

function UltrasoundFormPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<UltrasoundFormData>({
    technician: '',
    date: new Date().toISOString().split('T')[0],
    ultrasoundType: 'abdomen',
    liver: 'normal',
    gallbladder: 'normal',
    pancreas: 'normal',
    spleen: 'normal',
    leftKidney: 'normal',
    rightKidney: 'normal',
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
      record.examinationData.ultrasoundTest = {
        status: 'completed',
        date: formData.date,
        type: formData.ultrasoundType,
        organs: {
          liver: formData.liver,
          gallbladder: formData.gallbladder,
          pancreas: formData.pancreas,
          spleen: formData.spleen,
          leftKidney: formData.leftKidney,
          rightKidney: formData.rightKidney
        },
        findings: formData.findings,
        conclusion: formData.conclusion,
        recommendations: formData.recommendations,
        technician: formData.technician,
        doctorName: formData.doctorName
      }
      record.lastModified = new Date().toISOString()

      localStorage.setItem(`exam_${patientName}`, JSON.stringify(record))
      alert('✅ Đã lưu kết quả siêu âm!')
      navigate('/conclusion')
    } catch (error) {
      console.error('Lỗi:', error)
      alert('❌ Lỗi khi lưu dữ liệu')
    }
  }

  return (
    <div className="ultrasound-form-page">
      <button className="btn-back" onClick={() => navigate('/examination-menu')}>
        ← Quay Lại
      </button>

      <div className="ultrasound-container">
        <h2>🔊 SIÊU ÂM</h2>
        <p className="subtitle">Kết quả siêu âm các cơ quan</p>

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
              <label>Loại Siêu Âm:</label>
              <select
                value={formData.ultrasoundType}
                onChange={(e) => setFormData(prev => ({ ...prev, ultrasoundType: e.target.value }))}
              >
                <option value="abdomen">Bụng</option>
                <option value="cardiac">Tim</option>
                <option value="thyroid">Tuyến giáp</option>
                <option value="breast">Vú</option>
                <option value="pelvic">Tiểu khung</option>
                <option value="other">Khác</option>
              </select>
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
          <h3>Kết Quả Các Cơ Quan</h3>
          <div className="organ-grid">
            <div className="organ-item">
              <label>Gan:</label>
              <select
                value={formData.liver}
                onChange={(e) => setFormData(prev => ({ ...prev, liver: e.target.value }))}
              >
                <option value="normal">Bình thường</option>
                <option value="fatty">Nhiễm mỡ</option>
                <option value="cirrhosis">Xơ hóa</option>
                <option value="mass">Khối</option>
              </select>
            </div>
            <div className="organ-item">
              <label>Túi Mật:</label>
              <select
                value={formData.gallbladder}
                onChange={(e) => setFormData(prev => ({ ...prev, gallbladder: e.target.value }))}
              >
                <option value="normal">Bình thường</option>
                <option value="stones">Sỏi</option>
                <option value="polyp">Polyp</option>
              </select>
            </div>
            <div className="organ-item">
              <label>Tụy:</label>
              <select
                value={formData.pancreas}
                onChange={(e) => setFormData(prev => ({ ...prev, pancreas: e.target.value }))}
              >
                <option value="normal">Bình thường</option>
                <option value="enlargement">Sưng</option>
                <option value="atrophy">Teo</option>
              </select>
            </div>
            <div className="organ-item">
              <label>Lách:</label>
              <select
                value={formData.spleen}
                onChange={(e) => setFormData(prev => ({ ...prev, spleen: e.target.value }))}
              >
                <option value="normal">Bình thường</option>
                <option value="enlargement">Sưng</option>
              </select>
            </div>
            <div className="organ-item">
              <label>Thận Trái:</label>
              <select
                value={formData.leftKidney}
                onChange={(e) => setFormData(prev => ({ ...prev, leftKidney: e.target.value }))}
              >
                <option value="normal">Bình thường</option>
                <option value="stones">Sỏi</option>
                <option value="mass">Khối</option>
                <option value="cyst">Nang</option>
              </select>
            </div>
            <div className="organ-item">
              <label>Thận Phải:</label>
              <select
                value={formData.rightKidney}
                onChange={(e) => setFormData(prev => ({ ...prev, rightKidney: e.target.value }))}
              >
                <option value="normal">Bình thường</option>
                <option value="stones">Sỏi</option>
                <option value="mass">Khối</option>
                <option value="cyst">Nang</option>
              </select>
            </div>
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
            💾 Lưu Kết Quả Siêu Âm
          </button>
          <button className="btn-cancel" onClick={() => navigate('/examination-menu')}>
            ✕ Hủy
          </button>
        </div>
      </div>
    </div>
  )
}

export default UltrasoundFormPage
