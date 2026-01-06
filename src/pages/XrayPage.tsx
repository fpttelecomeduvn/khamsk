import { FC } from 'react'
import XrayReport from './ExaminationDetails/XrayReport'
import '../styles/XrayPage.css'

interface XrayPageProps {
  patientId?: string
  patientName?: string
}

const XrayPage: FC<XrayPageProps> = ({ patientId, patientName }) => {
  const handleSaveReport = (data: any) => {
    console.log('X-Ray Report saved:', data)
    // Ở đây bạn có thể gọi API để lưu dữ liệu
  }

  return (
    <div className="xray-page">
      <div className="page-header">
        <h2>📷 Phiếu Chụp X-Quang</h2>
        <p className="page-subtitle">Nhập thông tin và kết quả chụp X-quang của bệnh nhân</p>
      </div>

      <XrayReport
        patientId={patientId}
        patientName={patientName}
        onSave={handleSaveReport}
      />
    </div>
  )
}

export default XrayPage
