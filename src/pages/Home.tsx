import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'

const Home: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>🏥 Hệ Thống Quản Lý Khám Sức Khỏe Định Kỳ</h1>
        <p>Giải pháp toàn diện cho quản lý phiếu khám và kết quả xét nghiệm</p>
      </div>

      <div className="home-actions">
        <button className="action-card" onClick={() => navigate('/examination')}>
          <div className="card-icon">➕</div>
          <div className="card-title">Khám Mới</div>
          <div className="card-description">Thêm bệnh nhân mới và bắt đầu khám sức khỏe</div>
        </button>

        <button className="action-card" onClick={() => navigate('/patient-list')}>
          <div className="card-icon">📋</div>
          <div className="card-title">Danh Sách Khám</div>
          <div className="card-description">Xem và quản lý danh sách bệnh nhân đang khám</div>
        </button>

        <button className="action-card" onClick={() => navigate('/history')}>
          <div className="card-icon">📜</div>
          <div className="card-title">Lịch Sử</div>
          <div className="card-description">Xem lịch sử khám sức khỏe của bệnh nhân</div>
        </button>
      </div>

      <div className="home-info">
        <h2>📌 Hướng Dẫn Sử Dụng</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-content">
              <h3>Khám Mới</h3>
              <p>Nhập thông tin bệnh nhân mới (tên, số BHYT, ngày sinh, v.v.)</p>
            </div>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <div className="step-content">
              <h3>Danh Sách Khám</h3>
              <p>Xem các bệnh nhân đã được thêm vào hệ thống</p>
            </div>
          </div>

          <div className="step">
            <span className="step-number">3</span>
            <div className="step-content">
              <h3>Chọn Bệnh Nhân</h3>
              <p>Chọn bệnh nhân từ danh sách để nhập kết quả xét nghiệm</p>
            </div>
          </div>

          <div className="step">
            <span className="step-number">4</span>
            <div className="step-content">
              <h3>Nhập Kết Quả</h3>
              <p>Nhập các loại xét nghiệm: X-Quang, ECG, Siêu âm, Huyết học, v.v.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="home-features">
        <h2>✨ Tính Năng Chính</h2>
        <ul className="features-list">
          <li>✓ Quản lý thông tin bệnh nhân với số BHYT duy nhất</li>
          <li>✓ Nhập và lưu trữ kết quả xét nghiệm đa dạng</li>
          <li>✓ Tìm kiếm bệnh nhân theo tên hoặc số thẻ BHYT</li>
          <li>✓ In phiếu khám và kết quả xét nghiệm</li>
          <li>✓ Lịch sử khám sức khỏe đầy đủ</li>
          <li>✓ Giao diện thân thiện, dễ sử dụng</li>
        </ul>
      </div>
    </div>
  )
}

export default Home
