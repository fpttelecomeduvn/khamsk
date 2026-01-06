import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LabTestFormPage.css'

interface LabTestFormData {
  date: string
  testType: 'hematology' | 'biochemistry' | 'urinalysis'
  
  // Huyết học
  rbc: string
  wbc: string
  hemoglobin: string
  hematocrit: string
  platelets: string
  
  // Sinh hóa
  glucose: string
  cholesterol: string
  triglycerides: string
  creatinine: string
  urea: string
  ast: string
  alt: string
  
  // Nước tiểu
  color: string
  ph: string
  glucose_urinalysis: string
  protein: string
  leucocytes: string
  
  notes: string
  normalValues: string
  doctorName: string
}

function LabTestFormPage() {
  const navigate = useNavigate()
  const testType = (new URLSearchParams(window.location.search).get('type') || 'hematology') as any
  
  const [formData, setFormData] = useState<LabTestFormData>({
    date: new Date().toISOString().split('T')[0],
    testType: testType,
    rbc: '', wbc: '', hemoglobin: '', hematocrit: '', platelets: '',
    glucose: '', cholesterol: '', triglycerides: '', creatinine: '', urea: '', ast: '', alt: '',
    color: '', ph: '', glucose_urinalysis: '', protein: '', leucocytes: '',
    notes: '',
    normalValues: '',
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
      
      let testKey = 'labTest'
      if (formData.testType === 'hematology') testKey = 'hematologyTest'
      if (formData.testType === 'biochemistry') testKey = 'biochemistryTest'
      if (formData.testType === 'urinalysis') testKey = 'urinalysisTest'
      
      let results = {}
      if (formData.testType === 'hematology') {
        results = {
          rbc: formData.rbc,
          wbc: formData.wbc,
          hemoglobin: formData.hemoglobin,
          hematocrit: formData.hematocrit,
          platelets: formData.platelets
        }
      } else if (formData.testType === 'biochemistry') {
        results = {
          glucose: formData.glucose,
          cholesterol: formData.cholesterol,
          triglycerides: formData.triglycerides,
          creatinine: formData.creatinine,
          urea: formData.urea,
          ast: formData.ast,
          alt: formData.alt
        }
      } else {
        results = {
          color: formData.color,
          ph: formData.ph,
          glucose: formData.glucose_urinalysis,
          protein: formData.protein,
          leucocytes: formData.leucocytes
        }
      }

      record.examinationData[testKey] = {
        status: 'completed',
        date: formData.date,
        results: results,
        notes: formData.notes,
        normalValues: formData.normalValues,
        doctorName: formData.doctorName
      }
      record.lastModified = new Date().toISOString()

      localStorage.setItem(`exam_${patientName}`, JSON.stringify(record))
      alert('✅ Đã lưu kết quả xét nghiệm!')
      navigate('/conclusion')
    } catch (error) {
      console.error('Lỗi:', error)
      alert('❌ Lỗi khi lưu dữ liệu')
    }
  }

  const getTitle = () => {
    if (formData.testType === 'hematology') return '🔴 XÉT NGHIỆM HUYẾT HỌC'
    if (formData.testType === 'biochemistry') return '🟡 XÉT NGHIỆM SINH HÓA'
    return '💧 XÉT NGHIỆM NƯỚC TIỂU'
  }

  const getSubtitle = () => {
    if (formData.testType === 'hematology') return 'Xét nghiệm máu chi tiết'
    if (formData.testType === 'biochemistry') return 'Xét nghiệm chức năng cơ quan'
    return 'Xét nghiệm nước tiểu'
  }

  return (
    <div className="lab-test-form-page">
      <button className="btn-back" onClick={() => navigate('/examination-menu')}>
        ← Quay Lại
      </button>

      <div className="lab-container">
        <h2>{getTitle()}</h2>
        <p className="subtitle">{getSubtitle()}</p>

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
          </div>
        </div>

        {formData.testType === 'hematology' && (
          <div className="form-section">
            <h3>Kết Quả Huyết Học</h3>
            <div className="lab-grid">
              <div className="lab-item">
                <label>RBC (triệu/mm³):</label>
                <input
                  type="text"
                  value={formData.rbc}
                  onChange={(e) => setFormData(prev => ({ ...prev, rbc: e.target.value }))}
                  placeholder="4.5-5.9"
                />
              </div>
              <div className="lab-item">
                <label>WBC (nghìn/mm³):</label>
                <input
                  type="text"
                  value={formData.wbc}
                  onChange={(e) => setFormData(prev => ({ ...prev, wbc: e.target.value }))}
                  placeholder="4.5-11.0"
                />
              </div>
              <div className="lab-item">
                <label>Hemoglobin (g/dL):</label>
                <input
                  type="text"
                  value={formData.hemoglobin}
                  onChange={(e) => setFormData(prev => ({ ...prev, hemoglobin: e.target.value }))}
                  placeholder="13.5-17.5"
                />
              </div>
              <div className="lab-item">
                <label>Hematocrit (%):</label>
                <input
                  type="text"
                  value={formData.hematocrit}
                  onChange={(e) => setFormData(prev => ({ ...prev, hematocrit: e.target.value }))}
                  placeholder="40-54"
                />
              </div>
              <div className="lab-item">
                <label>Tiểu cầu (nghìn/mm³):</label>
                <input
                  type="text"
                  value={formData.platelets}
                  onChange={(e) => setFormData(prev => ({ ...prev, platelets: e.target.value }))}
                  placeholder="150-400"
                />
              </div>
            </div>
          </div>
        )}

        {formData.testType === 'biochemistry' && (
          <div className="form-section">
            <h3>Kết Quả Sinh Hóa</h3>
            <div className="lab-grid">
              <div className="lab-item">
                <label>Glucose (mg/dL):</label>
                <input
                  type="text"
                  value={formData.glucose}
                  onChange={(e) => setFormData(prev => ({ ...prev, glucose: e.target.value }))}
                  placeholder="70-100"
                />
              </div>
              <div className="lab-item">
                <label>Cholesterol (mg/dL):</label>
                <input
                  type="text"
                  value={formData.cholesterol}
                  onChange={(e) => setFormData(prev => ({ ...prev, cholesterol: e.target.value }))}
                  placeholder="<200"
                />
              </div>
              <div className="lab-item">
                <label>Triglycerides (mg/dL):</label>
                <input
                  type="text"
                  value={formData.triglycerides}
                  onChange={(e) => setFormData(prev => ({ ...prev, triglycerides: e.target.value }))}
                  placeholder="<150"
                />
              </div>
              <div className="lab-item">
                <label>Creatinine (mg/dL):</label>
                <input
                  type="text"
                  value={formData.creatinine}
                  onChange={(e) => setFormData(prev => ({ ...prev, creatinine: e.target.value }))}
                  placeholder="0.7-1.3"
                />
              </div>
              <div className="lab-item">
                <label>Urea (mg/dL):</label>
                <input
                  type="text"
                  value={formData.urea}
                  onChange={(e) => setFormData(prev => ({ ...prev, urea: e.target.value }))}
                  placeholder="7-20"
                />
              </div>
              <div className="lab-item">
                <label>AST (U/L):</label>
                <input
                  type="text"
                  value={formData.ast}
                  onChange={(e) => setFormData(prev => ({ ...prev, ast: e.target.value }))}
                  placeholder="10-40"
                />
              </div>
              <div className="lab-item">
                <label>ALT (U/L):</label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="10-40"
                />
              </div>
            </div>
          </div>
        )}

        {formData.testType === 'urinalysis' && (
          <div className="form-section">
            <h3>Kết Quả Nước Tiểu</h3>
            <div className="lab-grid">
              <div className="lab-item">
                <label>Màu sắc:</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="Vàng nhạt"
                />
              </div>
              <div className="lab-item">
                <label>pH:</label>
                <input
                  type="text"
                  value={formData.ph}
                  onChange={(e) => setFormData(prev => ({ ...prev, ph: e.target.value }))}
                  placeholder="4.5-8.0"
                />
              </div>
              <div className="lab-item">
                <label>Glucose:</label>
                <input
                  type="text"
                  value={formData.glucose_urinalysis}
                  onChange={(e) => setFormData(prev => ({ ...prev, glucose_urinalysis: e.target.value }))}
                  placeholder="Âm tính"
                />
              </div>
              <div className="lab-item">
                <label>Protein:</label>
                <input
                  type="text"
                  value={formData.protein}
                  onChange={(e) => setFormData(prev => ({ ...prev, protein: e.target.value }))}
                  placeholder="Âm tính"
                />
              </div>
              <div className="lab-item">
                <label>Bạch cầu:</label>
                <input
                  type="text"
                  value={formData.leucocytes}
                  onChange={(e) => setFormData(prev => ({ ...prev, leucocytes: e.target.value }))}
                  placeholder="Âm tính"
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-section">
          <h3>Ghi Chú</h3>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Ghi chú thêm..."
            rows={3}
          />
        </div>

        <div className="form-section">
          <h3>Giá Trị Bình Thường</h3>
          <textarea
            value={formData.normalValues}
            onChange={(e) => setFormData(prev => ({ ...prev, normalValues: e.target.value }))}
            placeholder="Ghi chú giá trị bình thường..."
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
            💾 Lưu Kết Quả
          </button>
          <button className="btn-cancel" onClick={() => navigate('/examination-menu')}>
            ✕ Hủy
          </button>
        </div>
      </div>
    </div>
  )
}

export default LabTestFormPage
