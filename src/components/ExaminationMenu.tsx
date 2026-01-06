import { useNavigate } from 'react-router-dom'
import '../styles/ExaminationMenu.css'

interface ExaminationMenuProps {
  patientName?: string
  onBack: () => void
  onSelectExamination: (type: string) => void
}

function ExaminationMenu({ patientName, onBack, onSelectExamination }: ExaminationMenuProps) {
  const navigate = useNavigate()
  const examinations = [
    {
      id: 'main',
      name: 'Phiếu Khám Chính',
      icon: '📋',
      description: 'Thông tin chung và khám toàn thân'
    },
    {
      id: 'xray',
      name: 'X-Quang',
      icon: '📷',
      description: 'Chụp X-quang và kết quả'
    },
    {
      id: 'ecg',
      name: 'Điện Tim (ECG)',
      icon: '💓',
      description: 'Kết quả điện tim'
    },
    {
      id: 'ultrasound',
      name: 'Siêu Âm',
      icon: '🔊',
      description: 'Kết quả siêu âm'
    },
    {
      id: 'blood',
      name: 'Xét Nghiệm Huyết Học',
      icon: '🩸',
      description: 'Xét nghiệm máu chi tiết'
    },
    {
      id: 'biochemistry',
      name: 'Xét Nghiệm Sinh Hóa',
      icon: '🧬',
      description: 'Xét nghiệm chỉ số sinh hóa'
    },
    {
      id: 'urinalysis',
      name: 'Xét Nghiệm Nước Tiểu',
      icon: '💧',
      description: 'Xét nghiệm nước tiểu'
    },
    {
      id: 'conclusion',
      name: 'Kết Luận',
      icon: '✅',
      description: 'Tổng hợp và kết luận sức khỏe'
    }
  ]

  return (
    <div className="examination-menu-container">
      <div className="menu-header">
        <button className="btn-back" onClick={onBack}>
          ← Quay Lại
        </button>
        <h2>📊 Menu Nhập Kết Quả Khám</h2>
        <p className="patient-info">
          👤 <strong>{patientName}</strong>
        </p>
      </div>

      <div className="examination-grid">
        {examinations.map(exam => (
          <div
            key={exam.id}
            className="examination-card"
            onClick={() => {
              // Set current patient name để các form biết bệnh nhân hiện tại
              if (patientName) {
                localStorage.setItem('currentPatientName', patientName)
              }
              
              if (exam.id === 'xray') {
                navigate('/xray-form')
              } else if (exam.id === 'ecg') {
                navigate('/ecg-form')
              } else if (exam.id === 'ultrasound') {
                navigate('/ultrasound-form')
              } else if (exam.id === 'blood') {
                navigate('/lab-test-form?type=hematology')
              } else if (exam.id === 'biochemistry') {
                navigate('/lab-test-form?type=biochemistry')
              } else if (exam.id === 'urinalysis') {
                navigate('/lab-test-form?type=urinalysis')
              } else if (exam.id === 'conclusion') {
                navigate('/conclusion')
              } else {
                onSelectExamination(exam.id)
              }
            }}
          >
            <div className="exam-icon">{exam.icon}</div>
            <h3>{exam.name}</h3>
            <p>{exam.description}</p>
            <button className="btn-open">
              Mở →
            </button>
          </div>
        ))}
      </div>

      <div className="menu-instructions">
        <h4>📝 Hướng dẫn sử dụng:</h4>
        <ul>
          <li>Nhấp vào từng mục để nhập kết quả xét nghiệm</li>
          <li>Bắt đầu với "Phiếu Khám Chính" để nhập thông tin cơ bản</li>
          <li>Sau đó nhập chi tiết cho từng loại xét nghiệm</li>
          <li>Cuối cùng, truy cập "Kết Luận" để tổng hợp dữ liệu và phân loại sức khỏe</li>
          <li>Tất cả dữ liệu sẽ được đồng bộ vào phiếu khám chính</li>
          <li>Nhấp "Quay Lại" để quay về danh sách bệnh nhân</li>
        </ul>
      </div>
    </div>
  )
}

export default ExaminationMenu
