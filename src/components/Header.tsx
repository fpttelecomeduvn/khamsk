import { FC } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Header.css'

const Header: FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">🏥 Sổ Khám Sức Khỏe Định Kỳ</h1>
        <nav className="nav">
          <Link to="/" className="nav-link">🏠 Trang Chủ</Link>
          <Link to="/examination" className="nav-link">➕ Khám Mới</Link>
          <Link to="/patient-list" className="nav-link">📋 Danh Sách Khám</Link>
          <Link to="/history" className="nav-link">📜 Lịch Sử</Link>
          <Link to="/data-controller" className="nav-link">🗄️ Quản Lý Dữ Liệu</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
