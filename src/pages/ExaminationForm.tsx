import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ExaminationForm.css'

interface NewPatientData {
  insuranceNumber: string
  fullName: string
  dateOfBirth: string
  gender: string
  phoneNumber: string
  address: string
  email?: string
}

// Global context để share data
export const PatientContext = React.createContext<any>(null)

function ExaminationForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<NewPatientData>({
    insuranceNumber: '',
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    phoneNumber: '',
    address: '',
    email: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Xóa lỗi khi user bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Cho phép bỏ trống hầu hết các field, chỉ bắt buộc tên bệnh nhân
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Tên bệnh nhân không được bỏ trống'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Chuyển đổi dd/mm/yyyy thành yyyy-mm-dd
  const convertDateFormat = (dateStr: string): string => {
    if (!dateStr) return ''
    if (dateStr.includes('-')) return dateStr // Đã là yyyy-mm-dd
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    return dateStr
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Convert date format if needed
    const convertedDate = convertDateFormat(formData.dateOfBirth)

    // Tạo patient object mới
    const newPatient = {
      id: formData.fullName, // Sử dụng tên bệnh nhân làm ID
      insuranceNumber: formData.insuranceNumber,
      fullName: formData.fullName,
      dateOfBirth: convertedDate,
      gender: formData.gender,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      email: formData.email,
      lastExaminationDate: new Date().toISOString().split('T')[0],
      status: 'in-progress',
      createdAt: new Date().toISOString(),
      examinationData: {}
    }

    // Lưu vào localStorage với key là tên bệnh nhân
    localStorage.setItem(`exam_${formData.fullName}`, JSON.stringify(newPatient))
    
    // Lưu currentPatientName để các page khác biết bệnh nhân hiện tại
    localStorage.setItem('currentPatientName', formData.fullName)
    
    // Cập nhật danh sách bệnh nhân (để hiển thị trong PatientList)
    const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]')
    const patientIndex = existingPatients.findIndex((p: any) => p.fullName === formData.fullName)
    
    if (patientIndex >= 0) {
      existingPatients[patientIndex] = newPatient
    } else {
      existingPatients.push(newPatient)
    }
    localStorage.setItem('patients', JSON.stringify(existingPatients))

    alert('✅ Bệnh nhân đã được thêm vào danh sách khám!')
    
    // Reset form
    setFormData({
      insuranceNumber: '',
      fullName: '',
      dateOfBirth: '',
      gender: 'male',
      phoneNumber: '',
      address: '',
      email: ''
    })

    // Chuyển đến menu khám
    navigate('/examination-menu')
  }

  return (
    <div className="examination-form">
      <h2>➕ Khám Sức Khỏe Mới</h2>
      <p className="form-subtitle">Nhập thông tin bệnh nhân mới để bắt đầu khám sức khỏe</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h3>Thông Tin Bảo Hiểm</h3>
          
          <div className="form-group">
            <label htmlFor="insuranceNumber">Số Thẻ Bảo Hiểm Y Tế *</label>
            <input
              type="text"
              id="insuranceNumber"
              name="insuranceNumber"
              value={formData.insuranceNumber}
              onChange={handleChange}
              placeholder="VD: BH123456789"
              className={errors.insuranceNumber ? 'error' : ''}
              required
            />
            {errors.insuranceNumber && <span className="error-text">{errors.insuranceNumber}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Thông Tin Cá Nhân</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Họ và Tên *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className={errors.fullName ? 'error' : ''}
                required
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Giới Tính</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Ngày Sinh (dd/mm/yyyy)</label>
              <input
                type="text"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="VD: 15/05/1990"
                className={errors.dateOfBirth ? 'error' : ''}
              />
              {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Số Điện Thoại *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="0912345678"
                className={errors.phoneNumber ? 'error' : ''}
                required
              />
              {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="address">Địa Chỉ *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Đường ABC, Quận XYZ, TP. HCM"
              className={errors.address ? 'error' : ''}
              required
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="email">Email (tùy chọn)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            ✓ Thêm Bệnh Nhân và Bắt Đầu Khám
          </button>
        </div>
      </form>

      <div className="form-info">
        <p>💡 Sau khi thêm, bệnh nhân sẽ xuất hiện trong "Danh Sách Khám" để nhập kết quả xét nghiệm</p>
        <p>🔑 Số BHYT là thông tin quan trọng - không thể trùng lặp</p>
      </div>
    </div>
  )
}

export default ExaminationForm

