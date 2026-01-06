import { PatientRecord } from '../types'
import '../styles/PatientDetailsModal.css'

interface PatientDetailsModalProps {
  patient: PatientRecord
  onClose: () => void
}

function PatientDetailsModal({ patient, onClose }: PatientDetailsModalProps) {
  // Kiểm tra các xét nghiệm đã có kết quả
  const hasGeneralExamination = patient.height && patient.weight && patient.bloodPressure
  const hasScreeningQuestions = patient.medicalHistory && patient.medicalHistory.length > 0
  const hasPhysicalExam = patient.generalNotes && patient.generalNotes.length > 0
  const hasLabTests = patient.biochemistryTests && patient.biochemistryTests.length > 0
  const hasHematologyTests = patient.hematologyTests && patient.hematologyTests.length > 0
  const hasUrinalysisTests = patient.urinalysisTests && patient.urinalysisTests.length > 0
  const hasXrayTests = patient.xrayTests && patient.xrayTests.length > 0
  const hasUltrasoundTests = patient.ultrasoundTests && patient.ultrasoundTests.length > 0
  const hasECGTests = patient.ecgTests && patient.ecgTests.length > 0
  const hasConclusion = patient.finalDiagnosis && patient.finalDiagnosis.length > 0

  // Danh sách các xét nghiệm
  const examinations = [
    {
      name: '📋 Khám Tổng Quát',
      hasResult: hasGeneralExamination,
      resultCount: hasGeneralExamination ? 1 : 0,
      details: hasGeneralExamination ? `Chiều cao: ${patient.height}cm, Cân nặng: ${patient.weight}kg, HA: ${patient.bloodPressure}` : 'Chưa làm'
    },
    {
      name: '❓ Câu Hỏi Sàng Lọc',
      hasResult: hasScreeningQuestions,
      resultCount: hasScreeningQuestions ? 1 : 0,
      details: hasScreeningQuestions ? 'Đã hoàn thành' : 'Chưa làm'
    },
    {
      name: '👨‍⚕️ Khám Lâm Sàng',
      hasResult: hasPhysicalExam,
      resultCount: hasPhysicalExam ? 1 : 0,
      details: hasPhysicalExam ? 'Đã hoàn thành' : 'Chưa làm'
    },
    {
      name: '🧪 Xét Nghiệm Sinh Hóa',
      hasResult: hasLabTests,
      resultCount: patient.biochemistryTests?.length || 0,
      details: hasLabTests ? `${patient.biochemistryTests?.length || 0} mẫu xét nghiệm` : 'Chưa làm'
    },
    {
      name: '🔴 Xét Nghiệm Huyết Học',
      hasResult: hasHematologyTests,
      resultCount: patient.hematologyTests?.length || 0,
      details: hasHematologyTests ? `${patient.hematologyTests?.length || 0} mẫu xét nghiệm` : 'Chưa làm'
    },
    {
      name: '💧 Xét Nghiệm Nước Tiểu',
      hasResult: hasUrinalysisTests,
      resultCount: patient.urinalysisTests?.length || 0,
      details: hasUrinalysisTests ? `${patient.urinalysisTests?.length || 0} mẫu xét nghiệm` : 'Chưa làm'
    },
    {
      name: '📷 Chụp X-Quang',
      hasResult: hasXrayTests,
      resultCount: patient.xrayTests?.length || 0,
      details: hasXrayTests ? `${patient.xrayTests?.length || 0} bức ảnh` : 'Chưa làm'
    },
    {
      name: '🔊 Siêu Âm',
      hasResult: hasUltrasoundTests,
      resultCount: patient.ultrasoundTests?.length || 0,
      details: hasUltrasoundTests ? `${patient.ultrasoundTests?.length || 0} bức ảnh` : 'Chưa làm'
    },
    {
      name: '❤️ Điện Tim (ECG)',
      hasResult: hasECGTests,
      resultCount: patient.ecgTests?.length || 0,
      details: hasECGTests ? `${patient.ecgTests?.length || 0} bản ghi` : 'Chưa làm'
    },
    {
      name: '✓ Kết Luận',
      hasResult: hasConclusion,
      resultCount: hasConclusion ? 1 : 0,
      details: hasConclusion ? 'Đã hoàn thành' : 'Chưa làm'
    }
  ]

  const totalTests = examinations.length
  const completedTests = examinations.filter(e => e.hasResult).length

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2>📋 Thông Tin Bệnh Nhân</h2>
            <button className="btn-close" onClick={onClose} title="Đóng">✕</button>
          </div>
          <div className="patient-summary">
            <div className="summary-item">
              <span className="label">Họ và Tên:</span>
              <span className="value">{patient.fullName}</span>
            </div>
            <div className="summary-item">
              <span className="label">Số Thẻ BH:</span>
              <span className="value">{patient.insuranceNumber}</span>
            </div>
            <div className="summary-item">
              <span className="label">Ngày Khám:</span>
              <span className="value">{new Date(patient.examinationDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="summary-item">
              <span className="label">Trạng Thái:</span>
              <span className={`status-badge status-${patient.examinationStatus}`}>
                {patient.examinationStatus === 'pending' && '⏳ Chưa bắt đầu'}
                {patient.examinationStatus === 'in-progress' && '⏱️ Đang thực hiện'}
                {patient.examinationStatus === 'completed' && '✓ Hoàn thành'}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-progress">
          <div className="progress-bar-container">
            <div className="progress-label">
              Tiến độ: <strong>{completedTests}/{totalTests}</strong> xét nghiệm
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(completedTests / totalTests) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="examinations-list">
            {examinations.map((exam, index) => (
              <div key={index} className={`exam-item ${exam.hasResult ? 'completed' : 'pending'}`}>
                <div className="exam-info">
                  <div className="exam-name">{exam.name}</div>
                  <div className="exam-details">{exam.details}</div>
                </div>
                <div className="exam-status">
                  {exam.hasResult ? (
                    <div className="status-icon completed">
                      <span className="check-mark">✓</span>
                    </div>
                  ) : (
                    <div className="status-icon pending">
                      <span className="pending-mark">○</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-close-modal" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientDetailsModal
