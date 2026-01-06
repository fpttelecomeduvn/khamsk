# Health Examination System - User Guide

## Tổng Quan Hệ Thống

**Hệ thống quản lý khám sức khỏe định kỳ** - được xây dựng cho **Bệnh viện A** để quản lý tối đa **20,000 lần khám/năm** với 3 loại khám:

1. **Khám Định Kỳ** (Circular 14/2013) - Công ty, tổ chức
2. **Khám Cảnh Sát** (Circular 62/2023) - Lực lượng công an
3. **Khám Tái Hòa Nhập** (Drug Rehab) - Những người đang phục hồi

---

## Quy Trình Khám 5 Bước

### Bước 1: Tiếp Nhận Bệnh Nhân (Reception)

**URL:** `http://localhost:5173/reception`

**Mục đích:** Tạo phiên khám mới và nhập danh sách bệnh nhân

**Hướng dẫn:**

1. **Tạo Phiên Khám Mới**
   - Nhập tên phiên khám (VD: "Khám công ty ABC - T1/2026")
   - Chọn ngày khám
   - Chọn loại khám (Định kỳ / Cảnh sát / Tái hòa nhập)
   - Nhấn "➜ Tiếp Tục Nhập Bệnh Nhân"

2. **Nhập Danh Sách Bệnh Nhân**
   - Điền thông tin bệnh nhân từng dòng:
     - Họ tên
     - Ngày sinh
     - CMND/Passport
     - Giới tính
     - Điện thoại
     - Địa chỉ
   - Nhấn "+ Thêm Bệnh Nhân" để thêm dòng
   - Nhấn "✓ Hoàn Thành & Khám Chuyên Khoa" để bắt đầu khám

**Lưu ý:**
- Tối thiểu 1 bệnh nhân
- CMND phải duy nhất (không được trùng)
- Ngày sinh bắt buộc để tính tuổi

---

### Bước 2: Khám Chuyên Khoa (Clinical Exam)

**URL:** `http://localhost:5173/clinical/{batchId}`

**Mục đích:** Bác sĩ nhập kết quả khám cho từng chuyên khoa

**Hướng dẫn:**

1. **Giao Diện Chính**
   - **Bên Trái:** Danh sách bệnh nhân + thông tin bệnh nhân hiện tại
   - **Bên Phải:** Chọn chuyên khoa + form nhập dữ liệu

2. **Chọn Chuyên Khoa**
   - Nhấn nút chuyên khoa cần khám:
     - Internal Medicine (Khám lâm sàng)
     - Ophthalmology (Khám mắt)
     - Laboratory (Xét nghiệm)
     - X-Ray, ECG, Ultrasound, v.v.

3. **Nhập Kết Quả Khám**
   - Form sẽ tự động tải cấu hình chuyên khoa từ server
   - Điền dữ liệu theo từng trường (BP, nhịp tim, chỉ số xét nghiệm, v.v.)
   - Nhấn "Lưu dữ liệu"

4. **Chuyển Bệnh Nhân Tiếp Theo**
   - Nhấn "Tiếp →" để chuyển sang bệnh nhân kế tiếp
   - Nhấn "← Trước" để quay lại bệnh nhân trước
   - Khi hoàn thành tất cả bệnh nhân, nhấn "Tiếp →" lần cuối để đi đến bước Kết Luận

**Lưu ý:**
- Có thể khám nhiều chuyên khoa cho cùng 1 bệnh nhân
- Hệ thống tự động tính loại khám dựa trên các chỉ số nhập vào

---

### Bước 3: Khám Paraclinical (Optional)

**Đang phát triển** - Bước này được tích hợp vào Bước 2 thông qua chọn chuyên khoa "X-Ray", "ECG", "Ultrasound"

---

### Bước 4: Kết Luận (Conclusion)

**URL:** `http://localhost:5173/conclusion/{batchId}`

**Mục đích:** Xem kết quả cuối cùng và có thể ghi đè nếu cần

**Hướng dẫn:**

1. **Xem Danh Sách Bệnh Nhân**
   - Bên trái: Danh sách tất cả bệnh nhân đã khám
   - Bấm vào bệnh nhân để xem chi tiết

2. **Kết Quả Khám**
   - Xem kết quả từ các chuyên khoa
   - Xem **Loại Khám Cuối Cùng** (RANK_I đến RANK_V hoặc FAILED)

3. **Ghi Đè Kết Quả** (Chỉ Trưởng Phòng/Admin)
   - Nhấn "⚙ Ghi Đè Kết Quả"
   - Chọn loại khám mới
   - Nhập lý do ghi đè
   - Nhấn "Xác Nhận Ghi Đè"

4. **Hoàn Thành Phiên Khám**
   - Sau khi xử lý tất cả bệnh nhân
   - Nhấn "✓ Hoàn Thành Phiên Khám" để lưu kết quả

---

### Bước 5: Lịch Sử & Thống Kê (History)

**URL:** `http://localhost:5173/history/{batchId}`

**Mục đích:** Xem thống kê và lịch sử khám

**Hướng dẫn:**

1. **Thống Kê Tổng Hợp**
   - Tổng số bệnh nhân
   - Số người hoàn thành / đang khám / chưa khám
   - Phân bố loại khám (Biểu đồ)

2. **Danh Sách Chi Tiết**
   - Bộ lọc theo loại khám (Loại I, II, III, IV, V, Không đạt)
   - Xem đầy đủ thông tin từng bệnh nhân

3. **Xuất Kết Quả**
   - Nhấn "📄 PDF" - xuất báo cáo PDF
   - Nhấn "📊 Excel" - xuất danh sách Excel
   - Nhấn "🖨 In" - in kết quả

---

## Phân Loại Sức Khỏe

### Loại I (RANK_I) - Hoàn toàn đủ sức khỏe
- ✅ Đạt tất cả tiêu chí
- 🟢 Màu xanh

### Loại II (RANK_II) - Đủ sức khỏe
- ✅ Chỉ số bình thường hoặc chênh lệch nhẹ
- 🔵 Màu xanh dương

### Loại III (RANK_III) - Sức khỏe chưa đạt
- ⚠️ Cần theo dõi thêm
- 🟡 Màu vàng

### Loại IV (RANK_IV) - Cần chữa trị
- 🔴 Cần điều trị ngay
- 🟠 Màu cam

### Loại V (RANK_V) - Mất sức khỏe lao động
- ❌ Không thể làm việc
- 🔴 Màu đỏ

### FAILED - Không Đạt (Police)
- ❌ Vi phạm tiêu chí bắt buộc (HIV+, Drug+, v.v.)
- ⚫ Màu đen

---

## Tiêu Chí Tính Loại Khám

### Khám Định Kỳ (Circular 14)

**Nội Khoa:**
- BP < 130/85 → RANK_I
- BP < 140/90 → RANK_II
- BP < 160/100 → RANK_III
- BP ≥ 160/100 → RANK_IV/V

**Nhãn Khoa:**
- Vision ≥ 20/15 OD + OS → RANK_I
- Vision ≥ 20/20 → RANK_II
- Vision < 20/20 → RANK_III/IV/V

**Xét Nghiệm:**
- HIV/HBsAg/Syphilis Negative → RANK_I/II
- HIV/HBsAg/Syphilis Positive → RANK_V
- Glucose Normal → RANK_I/II
- Glucose ≥ 200 → RANK_IV/V

**Loại Cuối Cùng = MAX(tất cả chuyên khoa)** - "Yếu hơn nhất quyết định"

### Khám Cảnh Sát (Circular 62)

**Tiêu chí Knockout:**
- HIV Positive → **FAILED**
- Drug Test Positive → **FAILED**
- Tattoos visible → **FAILED**
- HBsAg Positive → **FAILED**

Nếu PASS tất cả tiêu chí bắt buộc, áp dụng như Khám Định Kỳ

---

## Quản Lý Phiên Khám

### Danh Sách Phiên Khám

**URL:** `http://localhost:5173/patients`

**Chức Năng:**
- Xem tất cả phiên khám đã tạo
- Tìm kiếm phiên khám theo tên/CMND
- Khóa phiên khám (ngăn nhập thêm bệnh nhân)
- Xem chi tiết từng phiên khám

### Quay Lại Chỉnh Sửa

**Có thể:**
- Quay lại Bước 2 để nhập thêm chuyên khoa
- Quay lại Bước 4 để ghi đè loại khám

**Không thể:**
- Thay đổi thông tin bệnh nhân sau khi nhập
- Xóa dữ liệu đã lưu (an toàn dữ liệu)

---

## Tài Khoản & Quyền Hạn

### Loại Người Dùng

| Vai Trò | Quyền |
|---------|-------|
| **Receptionist** | Tạo phiên, nhập bệnh nhân |
| **Doctor** | Nhập dữ liệu khám |
| **Chief Doctor** | Ghi đè kết quả, kết luận phiên |
| **Admin** | Quản lý toàn bộ hệ thống |

### Đăng Nhập

**URL:** `http://localhost:5173/login`

```
Tài khoản mặc định:
- Receptionist: receptionist / password123
- Doctor: doctor / password123
- Chief Doctor: chief_doctor / password123
- Admin: admin / password123
```

---

## Cài Đặt & Chạy Hệ Thống

### Yêu Cầu
- Node.js 18+
- PostgreSQL 15+
- npm hoặc yarn

### Chạy Backend
```bash
cd backend
npm install
npm run start:dev
```
Server chạy tại: `http://localhost:3000/api`

### Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend chạy tại: `http://localhost:5173`

### Cấu Hình Môi Trường

**Backend (.env)**
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=khamsk
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=your-secret-key-here
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:3000/api
```

---

## Khắc Phục Sự Cố

### Lỗi: "Cannot connect to database"
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra thông tin kết nối DB trong `.env`

### Lỗi: "Invalid token"
- Đăng xuất và đăng nhập lại
- Xóa `localStorage` rồi reload trang

### Form không tải chuyên khoa
- Kiểm tra backend đang chạy
- Kiểm tra VITE_API_URL chính xác

### Bệnh nhân không xuất hiện trong danh sách
- Kiểm tra phiên khám đã được tạo
- Kiểm tra bệnh nhân đã được nhập (Step 1)

---

## Hỗ Trợ

**Email:** support@hospital-a.vn  
**Hotline:** 1900-xxxx  
**Tài liệu:** https://github.com/fpttelecomeduvn/khamsk

---

**Phiên bản:** 2.0 - Released Jan 2026
