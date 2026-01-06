import { useState, useRef } from 'react'
import '../../styles/XrayReport.css'

interface XrayReportData {
  hospitalName: string
  patientName: string
  gender: string
  age: string
  examinationDate: string
  imageNumber: string
  indication: string
  findings: string
  recommendations: string
  doctorName: string
  doctorSignature: string
  reportDate: string
}

interface XrayReportProps {
  patientId?: string
  patientName?: string
  onSave?: (data: XrayReportData) => void
}

function XrayReport({ patientName, onSave }: XrayReportProps) {
  const printRef = useRef<HTMLDivElement>(null)
  
  const [reportData, setReportData] = useState<XrayReportData>({
    hospitalName: 'BỆNH VIỆN / CƠ SỞ Y TẾ',
    patientName: patientName || '',
    gender: '',
    age: '',
    examinationDate: new Date().toISOString().split('T')[0],
    imageNumber: '',
    indication: '',
    findings: '',
    recommendations: '',
    doctorName: '',
    doctorSignature: '',
    reportDate: new Date().toISOString().split('T')[0]
  })

  const handleChange = (field: keyof XrayReportData, value: string) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800')
      if (printWindow) {
        printWindow.document.write(printRef.current.innerHTML)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(reportData)
    }
    alert('Kết quả X-quang đã được lưu!')
  }

  return (
    <div className="xray-report-container">
      <div className="form-controls">
        <div className="control-group">
          <label>Tên Đơn Vị / Bệnh Viện</label>
          <input
            type="text"
            value={reportData.hospitalName}
            onChange={(e) => handleChange('hospitalName', e.target.value)}
            placeholder="Nhập tên bệnh viện hoặc cơ sở y tế"
            className="hospital-input"
          />
        </div>
        <div className="action-buttons">
          <button className="btn-save" onClick={handleSave}>
            💾 Lưu Kết Quả
          </button>
          <button className="btn-print" onClick={handlePrint}>
            🖨️ In Kết Quả
          </button>
        </div>
      </div>

      <div className="xray-report" ref={printRef}>
        <div className="report-header">
          <div className="hospital-name">{reportData.hospitalName}</div>
          <div className="report-title">PHIẾU CHỤP X-QUANG</div>
          <div className="report-meta">
            <div className="meta-item">
              <span>Lần thứ:</span>
              <input
                type="text"
                value={reportData.imageNumber}
                onChange={(e) => handleChange('imageNumber', e.target.value)}
                placeholder="Số"
                className="meta-input"
              />
            </div>
          </div>
        </div>

        <div className="patient-info-section">
          <div className="info-row">
            <div className="info-field">
              <label>Họ tên người bệnh:</label>
              <input
                type="text"
                value={reportData.patientName}
                onChange={(e) => handleChange('patientName', e.target.value)}
                placeholder="Nguyễn Văn A"
                className="patient-input"
              />
            </div>
          </div>

          <div className="info-row">
            <div className="info-field">
              <label>Giới tính:</label>
              <select
                value={reportData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="info-select"
              >
                <option value="">-- Chọn --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="info-field">
              <label>Tuổi:</label>
              <input
                type="number"
                value={reportData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="Tuổi"
                className="info-input"
              />
            </div>
            <div className="info-field">
              <label>Ngày khám:</label>
              <input
                type="date"
                value={reportData.examinationDate}
                onChange={(e) => handleChange('examinationDate', e.target.value)}
                className="info-input"
              />
            </div>
          </div>

          <div className="info-row">
            <div className="info-field">
              <label>Dự chuẩn đoán:</label>
              <textarea
                value={reportData.indication}
                onChange={(e) => handleChange('indication', e.target.value)}
                placeholder="Mô tả dự chuẩn đoán"
                className="indication-textarea"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="report-section">
          <div className="section-title">YÊU CẦU CHỤP</div>
          <div className="section-content">
            <textarea
              value={reportData.indication}
              onChange={(e) => handleChange('indication', e.target.value)}
              placeholder="Chụp tìm phát hiện..."
              className="full-textarea"
              rows={3}
            />
          </div>
        </div>

        <div className="report-section">
          <div className="section-header">
            <span className="date-range">Ngày ___ tháng ___ năm 20___</span>
            <span className="bac-si">BÁC SĨ GIẢI PHẪU</span>
          </div>
        </div>

        <div className="report-section">
          <div className="section-title">KẾT QUẢ</div>
          <div className="section-content">
            <div className="result-box">
              <textarea
                value={reportData.findings}
                onChange={(e) => handleChange('findings', e.target.value)}
                placeholder="Hình ảnh tìm phát hiện thương tổn..."
                className="full-textarea"
                rows={5}
              />
            </div>
          </div>
        </div>

        <div className="report-section">
          <div className="section-footer">
            <span className="footer-date">Ngày ___ tháng ___ năm 20___</span>
            <span className="footer-title">BÁC SĨ CHUYÊN KHOA</span>
          </div>
        </div>

        <div className="report-section">
          <div className="section-title">LỜI KHUYÊN CỦA BÁC SĨ CHUYÊN KHOA</div>
          <div className="section-content">
            <textarea
              value={reportData.recommendations}
              onChange={(e) => handleChange('recommendations', e.target.value)}
              placeholder="Khuyên cáo và hướng dẫn điều trị..."
              className="full-textarea"
              rows={4}
            />
          </div>
        </div>

        <div className="signature-section">
          <div className="signature-item">
            <label>Chữ ký / Ký số của BS chuyên khoa:</label>
            <div className="signature-box">
              <textarea
                value={reportData.doctorSignature}
                onChange={(e) => handleChange('doctorSignature', e.target.value)}
                placeholder="Ký tên hoặc nhập chữ ký số"
                className="signature-textarea"
                rows={3}
              />
            </div>
          </div>

          <div className="signature-item">
            <label>Họ tên Bác sĩ:</label>
            <input
              type="text"
              value={reportData.doctorName}
              onChange={(e) => handleChange('doctorName', e.target.value)}
              placeholder="Tên bác sĩ chuyên khoa"
              className="doctor-input"
            />
          </div>

          <div className="signature-item">
            <label>Ngày lập báo cáo:</label>
            <input
              type="date"
              value={reportData.reportDate}
              onChange={(e) => handleChange('reportDate', e.target.value)}
              className="date-input"
            />
          </div>
        </div>

        <div className="report-footer">
          <p>Ghi chú: Chữ ký có thể bỏ trống hoặc sử dụng chữ ký số</p>
        </div>
      </div>
    </div>
  )
}

export default XrayReport
