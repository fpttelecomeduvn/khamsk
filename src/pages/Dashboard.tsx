import { useState, useEffect } from 'react'
import '../styles/Dashboard.css'

interface ExaminationRecord {
  id: string
  patientName: string
  lastExamination: string
  nextScheduled: string
  status: 'Bình thường' | 'Cần theo dõi' | 'Cần kiểm tra'
}

function Dashboard() {
  const [records, setRecords] = useState<ExaminationRecord[]>([])

  useEffect(() => {
    // Mock data
    const mockData: ExaminationRecord[] = [
      {
        id: '1',
        patientName: 'Nguyễn Văn A',
        lastExamination: '2024-10-15',
        nextScheduled: '2025-01-15',
        status: 'Bình thường'
      },
      {
        id: '2',
        patientName: 'Trần Thị B',
        lastExamination: '2024-09-20',
        nextScheduled: '2025-02-20',
        status: 'Cần theo dõi'
      },
      {
        id: '3',
        patientName: 'Lê Văn C',
        lastExamination: '2024-08-10',
        nextScheduled: '2024-12-10',
        status: 'Cần kiểm tra'
      }
    ]
    setRecords(mockData)
  }, [])

  return (
    <div className="dashboard">
      <h2>Bảng Điều Khiển</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Tổng Bệnh Nhân</h3>
          <p className="stat-number">{records.length}</p>
        </div>
        <div className="stat-card">
          <h3>Bình Thường</h3>
          <p className="stat-number">{records.filter(r => r.status === 'Bình thường').length}</p>
        </div>
        <div className="stat-card">
          <h3>Cần Theo Dõi</h3>
          <p className="stat-number">{records.filter(r => r.status === 'Cần theo dõi').length}</p>
        </div>
        <div className="stat-card warning">
          <h3>Cần Kiểm Tra</h3>
          <p className="stat-number">{records.filter(r => r.status === 'Cần kiểm tra').length}</p>
        </div>
      </div>

      <h3 className="section-title">Danh Sách Bệnh Nhân</h3>
      <div className="records-table">
        <table>
          <thead>
            <tr>
              <th>Tên Bệnh Nhân</th>
              <th>Lần Khám Cuối</th>
              <th>Khám Tiếp Theo</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id} className={`status-${record.status.toLowerCase().replace(/\s+/g, '-')}`}>
                <td>{record.patientName}</td>
                <td>{new Date(record.lastExamination).toLocaleDateString('vi-VN')}</td>
                <td>{new Date(record.nextScheduled).toLocaleDateString('vi-VN')}</td>
                <td><span className="status-badge">{record.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
