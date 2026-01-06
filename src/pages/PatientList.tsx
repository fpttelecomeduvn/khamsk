import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainExaminationSheet from './ExaminationDetails/MainExaminationSheet'
import ExaminationMenu from '../components/ExaminationMenu'
import PatientDetailsModal from '../components/PatientDetailsModal'
import { PatientRecord } from '../types'
import '../styles/PatientList.css'

interface PatientListItem {
  id: string
  insuranceNumber: string
  fullName: string
  lastExaminationDate: string
  status: 'pending' | 'in-progress' | 'completed'
  dateOfBirth?: string
  gender?: string
  phoneNumber?: string
  address?: string
  email?: string
  createdAt?: string
  examinationData?: any
}

function PatientList() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<PatientListItem[]>([])
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<PatientRecord | null>(null)

  useEffect(() => {
    const loadedPatients = JSON.parse(localStorage.getItem('patients') || '[]')
    setPatients(loadedPatients)
  }, [])

  const [searchText, setSearchText] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'details' | 'menu' | 'conclusion'>('list')

  const filteredPatients = useMemo(() => {
    return patients.filter(p =>
      p.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      p.insuranceNumber.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [patients, searchText])

  const handleSavePatient = (patient: PatientRecord) => {
    console.log('Saving patient:', patient)
    alert('Phiếu khám đã được lưu thành công!')
    setViewMode('menu')
  }

  // Modal chi tiết bệnh nhân
  if (selectedPatientForDetails) {
    return (
      <PatientDetailsModal 
        patient={selectedPatientForDetails}
        onClose={() => setSelectedPatientForDetails(null)}
      />
    )
  }

  // View: Menu chọn loại xét nghiệm
  if (viewMode === 'menu' && selectedPatientId) {
    const patient = patients.find(p => p.id === selectedPatientId)
    return (
      <ExaminationMenu
        patientName={patient?.fullName}
        onBack={() => {
          setSelectedPatientId(null)
          setViewMode('list')
        }}
        onSelectExamination={(type: string) => {
          if (type === 'main') {
            setViewMode('details')
          } else if (type === 'conclusion') {
            setViewMode('conclusion')
          } else {
            console.log('Opening examination:', type)
          }
        }}
      />
    )
  }

  // View: Chi tiết phiếu khám
  if (viewMode === 'details') {
    return (
      <div className="patient-detail-view">
        <button
          className="btn-back"
          onClick={() => setViewMode('menu')}
        >
          ← Quay Lại Menu
        </button>
        <MainExaminationSheet
          patientId={selectedPatientId || ''}
          onSave={handleSavePatient}
        />
      </div>
    )
  }

  // View: Danh sách bệnh nhân
  return (
    <div className="patient-list-page">
      <div className="patient-list-header">
        <h2>👥 Danh Sách Người Khám</h2>
        <p className="patient-count">Tổng: {patients.length} bệnh nhân</p>
      </div>

      <div className="patient-list-actions">
        <button className="btn-new-examination" onClick={() => navigate('/examination')}>
          ➕ Khám Mới
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="🔍 Tìm kiếm theo tên hoặc số thẻ BH..."
          className="search-input"
        />
        {searchText && (
          <button
            className="btn-clear-search"
            onClick={() => setSearchText('')}
          >
            ✕
          </button>
        )}
      </div>

      <div className="patient-list-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Số Thẻ BH</th>
              <th>Tên Bệnh Nhân</th>
              <th>Lần Khám Cuối</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <tr key={patient.id} className={`status-${patient.status}`}>
                  <td>{index + 1}</td>
                  <td 
                    className="insurance-number clickable"
                    onClick={() => {
                      localStorage.setItem('currentPatientName', patient.fullName)
                      navigate(`/examination-results/${encodeURIComponent(patient.fullName)}`)
                    }}
                    title="Click để xem kết quả khám"
                  >
                    {patient.insuranceNumber}
                  </td>
                  <td 
                    className="patient-name clickable"
                    onClick={() => {
                      localStorage.setItem('currentPatientName', patient.fullName)
                      navigate(`/examination-results/${encodeURIComponent(patient.fullName)}`)
                    }}
                    title="Click để xem kết quả khám"
                  >
                    {patient.fullName}
                  </td>
                  <td>{new Date(patient.lastExaminationDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`status-badge status-${patient.status}`}>
                      {patient.status === 'pending' && '⏳ Chưa bắt đầu'}
                      {patient.status === 'in-progress' && '⏱️ Đang thực hiện'}
                      {patient.status === 'completed' && '✓ Hoàn thành'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setSelectedPatientId(patient.id)
                        setViewMode('menu')
                      }}
                      title="Chọn và nhập kết quả"
                    >
                      ➕
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        if (window.confirm(`Bạn chắc chắn muốn xóa bệnh nhân "${patient.fullName}"? Hành động này không thể hoàn tác.`)) {
                          const updatedPatients = patients.filter(p => p.id !== patient.id)
                          setPatients(updatedPatients)
                          localStorage.setItem('patients', JSON.stringify(updatedPatients))
                          alert('✓ Đã xóa bệnh nhân')
                        }
                      }}
                      title="Xóa bệnh nhân"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  Không tìm thấy bệnh nhân
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="patient-list-info">
        <p>💡 <strong>Click vào số thẻ BH</strong> để xem chi tiết thông tin khám sức khỏe của bệnh nhân</p>
        <p>🔍 Sử dụng ô tìm kiếm để tìm bệnh nhân theo tên hoặc số thẻ bảo hiểm</p>
      </div>
    </div>
  )
}

export default PatientList
