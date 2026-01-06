# Hệ Thống Quản Lý Khám Sức Khỏe Định Kỳ

Ứng dụng web được xây dựng bằng React + TypeScript để quản lý và theo dõi thông tin khám sức khỏe định kỳ của bệnh nhân.

## 🌟 Tính Năng

- **Bảng Điều Khiển**: Xem tổng quan về tình trạng sức khỏe của bệnh nhân
- **Biểu Mẫu Khám**: Tạo và cập nhật thông tin khám mới
- **Lịch Sử Khám**: Xem toàn bộ lịch sử khám của bệnh nhân
- **Giao Diện Thân Thiện**: Thiết kế responsive, dễ sử dụng

## 📋 Cấu Trúc Dự Án

```
health-examination-system/
├── src/
│   ├── components/        # React Components
│   │   └── Header.tsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── ExaminationForm.tsx
│   │   └── ExaminationHistory.tsx
│   ├── styles/            # CSS files
│   │   ├── Dashboard.css
│   │   ├── ExaminationForm.css
│   │   ├── ExaminationHistory.css
│   │   ├── Header.css
│   │   └── index.css
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TypeScript Node configuration
├── package.json           # Dependencies and scripts
└── README.md              # Documentation
```

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu
- Node.js v16 trở lên
- npm hoặc yarn

### Bước 1: Cài Đặt Dependencies
```bash
npm install
```

### Bước 2: Chạy Development Server
```bash
npm run dev
```
Ứng dụng sẽ mở tự động tại `http://localhost:5173`

### Bước 3: Build cho Production
```bash
npm run build
```

### Bước 4: Preview Build
```bash
npm run preview
```

## 📦 Các Thư Viện Chính

- **React 18.2**: Library UI
- **React Router DOM 6.20**: Quản lý định tuyến
- **TypeScript 5.3**: Type safety
- **Vite 5.0**: Build tool
- **Axios 1.6**: HTTP client
- **Date-fns 2.30**: Xử lý ngày tháng

## 🎨 Các Trang Chính

### 1. Trang Chủ (Dashboard)
- Hiển thị thống kê tổng quan
- Danh sách bệnh nhân với trạng thái sức khỏe
- Lịch khám tiếp theo

### 2. Khám Mới
- Form nhập thông tin bệnh nhân
- Ghi lại các chỉ số sức khỏe (chiều cao, cân nặng, huyết áp, nhịp tim)
- Ghi chú thêm về tình trạng sức khỏe

### 3. Lịch Sử Khám
- Xem toàn bộ lịch sử khám
- Tìm kiếm theo tên bệnh nhân
- Chi tiết từng lần khám

## 🔧 Phát Triển Thêm

Dự án này là một bản khởi động. Bạn có thể mở rộng với các tính năng:
- Kết nối backend API
- Cơ sở dữ liệu để lưu trữ dữ liệu
- Xác thực người dùng (Authentication)
- Export báo cáo (PDF, Excel)
- Biểu đồ thống kê nâng cao
- Thông báo nhắc nhở khám

## 📝 Ghi Chú

- Dữ liệu hiện tại là mock data (dữ liệu giả)
- Để sử dụng thực tế, cần kết nối với backend API
- Tất cả các chỉ số y tế cần được xác nhận bởi nhân viên y tế

## 📄 Giấy Phép

MIT License
