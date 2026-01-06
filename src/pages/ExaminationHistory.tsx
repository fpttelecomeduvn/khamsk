import { useState, useEffect } from 'react'
import '../styles/ExaminationHistory.css'

interface HistoryRecord {
  id: string
  patientName: string
  examinationDate: string
  height: string
  weight: string
  bloodPressure: string
  heartRate: string
  notes: string
}

function ExaminationHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([])

  useEffect(() => {
    // Mock data
    const mockHistory: HistoryRecord[] = [
      {
        id: '1',
        patientName: 'Nguyễn Văn A',
        examinationDate: '2024-10-15',
        height: '170',
        weight: '72',
        bloodPressure: '120/80',
        heartRate: '72',
        notes: 'Tình trạng bình thường'
      },
      {
        id: '2',
        patientName: 'Trần Thị B',
        examinationDate: '2024-09-20',
        height: '162',
        weight: '55',
        bloodPressure: '118/76',
        heartRate: '68',
        notes: 'Cần theo dõi huyết áp'
      },
      {
        id: '3',
        patientName: 'Lê Văn C',
        examinationDate: '2024-08-10',
        height: '175',
        weight: '80',
        bloodPressure: '130/85',
        heartRate: '80',
        notes: 'Cân nặng hơi cao, cần kiểm soát'
      }
    ]
    setHistory(mockHistory)
  }, [])

  return (
    <div className="examination-history">
      <h2>Lịch Sử Khám Sức Khỏe</h2>
      <div className="history-filters">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên bệnh nhân..."
          className="search-input"
        />
      </div>

      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Tên Bệnh Nhân</th>
              <th>Ngày Khám</th>
              <th>Chiều Cao</th>
              <th>Cân Nặng</th>
              <th>Huyết Áp</th>
              <th>Nhịp Tim</th>
              <th>Ghi Chú</th>
            </tr>
          </thead>
          <tbody>
            {history.map(record => (
              <tr key={record.id}>
                <td>{record.patientName}</td>
                <td>{new Date(record.examinationDate).toLocaleDateString('vi-VN')}</td>
                <td>{record.height} cm</td>
                <td>{record.weight} kg</td>
                <td>{record.bloodPressure}</td>
                <td>{record.heartRate}</td>
                <td>{record.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history.length === 0 && (
        <div className="no-data">
          <p>Không có dữ liệu lịch sử khám</p>
        </div>
      )}
    </div>
  )
}

export default ExaminationHistory
