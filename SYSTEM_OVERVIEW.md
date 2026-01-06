# 🏥 Hệ Thống Quản Lý Khám Sức Khỏe Định Kỳ

## 📖 Tổng Quan

Hệ thống quản lý khám sức khỏe định kỳ (Health Examination System) là một ứng dụng web toàn diện được xây dựng bằng **React + TypeScript + Vite** để quản lý quy trình khám bệnh từ đầu đến cuối, với liên kết dữ liệu toàn bộ giữa các phần khám.

---

## ✨ Tính Năng Chính

### 🩺 **Khám Chính**
- Nhập thông tin bệnh nhân (BHYT, tên, tuổi, giới tính)
- Đo các chỉ số vital (huyết áp, nhịp tim, nhiệt độ, BMI)
- Ghi chú và quan sát lâm sàng

### 📸 **Khám X-Quang**
- 19 loại X-quang khác nhau (Ngực, Đầu, Xương sống, Khớp, v.v.)
- 28 template mẫu cho kết quả phổ biến
- Cấu trúc 3 phần: Chỉ định → Mô tả → Kết luận
- Tính năng thêm chỉ định/kết quả mới để mở rộng dữ liệu
- Tùy chọn "Khác" cho các trường hợp đặc biệt
- In và lưu kết quả

### 🧬 **Xét Nghiệm**
- Máu (Huyết học, Sinh hóa, v.v.)
- ECG, Siêu âm
- Xét nghiệm nước tiểu
- Tất cả liên kết với bệnh nhân qua mã BHYT

### 📋 **Kết Luận Tổng Kết**
- Tự động tải tất cả dữ liệu từ các phần khác
- Hiển thị trạng thái hoàn thành từng phần
- Bác sĩ viết kết luận, khuyến cáo, lịch tái khám
- Xuất báo cáo y tế toàn bộ

### 📊 **Danh Sách Bệnh Nhân**
- Quản lý danh sách bệnh nhân
- Xem chi tiết từng bệnh nhân
- Kiểm tra trạng thái các xét nghiệm hoàn thành

---

## 🎯 Quy Trình Sử Dụng

```
1️⃣ Tạo Bệnh Nhân Mới
   ↓
2️⃣ Khám Chính (đo các chỉ số)
   ↓
3️⃣ X-Quang (chọn loại, nhập mô tả) ← Nhập BHYT!
   ↓
4️⃣ Xét Nghiệm Máu (nhập kết quả)
   ↓
5️⃣ Xét Nghiệm Khác (ECG, Siêu âm, v.v.)
   ↓
6️⃣ Kết Luận (tất cả dữ liệu được tổng hợp tự động)
   ↓
7️⃣ Xuất/In Báo Cáo Toàn Bộ
```

---

## 🗂️ Cấu Trúc Dự Án

```
src/
├── pages/
│   ├── ExaminationForm.tsx          # Tạo bệnh nhân mới
│   ├── ExaminationHistory.tsx       # Danh sách khám
│   ├── PatientList.tsx              # Quản lý bệnh nhân
│   ├── XrayFormPage.tsx             # Form X-Quang (3 phần)
│   ├── XrayPage.tsx                 # Danh sách X-Quang
│   └── ExaminationDetails/
│       ├── MainExaminationSheet.tsx # Phiếu khám chính
│       ├── ConclusionPage.tsx       # Kết luận tổng kết
│       └── XrayReport.tsx           # Báo cáo X-Quang
├── components/
│   ├── Header.tsx                   # Thanh điều hướng
│   ├── ExaminationMenu.tsx          # Menu chọn mục
│   ├── InsuranceScanner.tsx         # Quét mã BHYT
│   └── PatientDetailsModal.tsx      # Chi tiết bệnh nhân
├── utils/
│   ├── examinationDataManager.ts    # ⭐ Quản lý liên kết dữ liệu
│   └── initializeData.ts            # Khởi tạo dữ liệu
├── data/
│   └── xrayTemplates.json           # 28 template X-Quang
├── types/
│   └── index.ts                     # TypeScript types
├── styles/
│   └── *.css                        # CSS cho các component
```

---

## 🔗 Liên Kết Dữ Liệu (Data Linking)

### **Cấu Trúc LocalStorage**

```typescript
{
  "exam_[BHYT]": {
    "insuranceNumber": "MA123456",
    "patientName": "Nguyễn Văn A",
    "examinationData": {
      "physicalExamination": { ... },    // Khám chính
      "xrayTest": { ... },               // X-Quang
      "labTest": { ... },                // Xét nghiệm máu
      "otherTests": { ... },             // Các xét nghiệm khác
      "finalConclusion": { ... }         // Kết luận tổng kết
    },
    "status": "completed",
    "lastModified": "2024-12-27T..."
  }
}
```

### **Các Hàm Utility**

```typescript
// 1. Lấy dữ liệu
getPatientExaminationData(insuranceNumber)
getCompletionStatus(insuranceNumber)

// 2. Cập nhật từng phần
updatePhysicalExamination(insuranceNumber, data)
updateXrayTest(insuranceNumber, data)
updateLabTest(insuranceNumber, data)
updateOtherTest(insuranceNumber, testName, data)

// 3. Hoàn thành
updateFinalConclusion(insuranceNumber, data)

// 4. Xuất
generateFullMedicalReport(insuranceNumber)
```

📖 **Chi tiết:** Xem file `DATA_LINKING_GUIDE.md`

---

## 💾 Lưu Trữ Dữ Liệu

### **LocalStorage Keys**
- `exam_[BHYT]` - Bệnh án toàn bộ
- `patients` - Danh sách bệnh nhân (cũ)
- `allPatients` - Danh sách bệnh nhân (mới)
- `xrayTemplates` - Template X-Quang

### **Dữ Liệu Được Liên Kết Bởi**
- **Mã Bảo Hiểm Y Tế (BHYT)** ← **Rất quan trọng!**
- **ID Bệnh nhân** (tùy chọn)
- **Tên bệnh nhân**

---

## 🚀 Cài Đặt & Chạy

### **Yêu Cầu**
- Node.js 16+
- npm hoặc yarn

### **Cài Đặt**
```bash
npm install
```

### **Chạy Development**
```bash
npm run dev
```

### **Build Production**
```bash
npm run build
```

---

## 📱 Các Trang Chính

| Đường Dẫn | Mô Tả | Tính Năng |
|----------|-------|----------|
| `/` | Trang chủ | Menu lựa chọn mục khám |
| `/examination` | Tạo bệnh nhân | Form đăng ký bệnh nhân mới |
| `/patient-list` | Danh sách bệnh nhân | Xem tất cả bệnh nhân, click xem chi tiết |
| `/examination-form` | Phiếu khám chính | Đo chỉ số, ghi chú |
| `/xray` | Danh sách X-Quang | Xem tất cả kết quả X-Quang |
| `/xray-form` | Form X-Quang | Nhập chỉ định, mô tả, kết luận (3 phần) |
| `/conclusion` | Kết Luận | Tóm tắt tất cả, viết kết luận cuối cùng |

---

## ✅ Danh Sách Tính Năng Đã Hoàn Thành

- ✅ Tạo bệnh nhân mới
- ✅ Khám chính với các chỉ số vital
- ✅ X-Quang 3 phần (Chỉ định → Mô tả → Kết luận)
- ✅ 19 loại X-Quang, 28 template
- ✅ Thêm chỉ định/kết quả mới
- ✅ Tùy chọn "Khác" cho trường hợp đặc biệt
- ✅ Danh sách bệnh nhân với chi tiết modal
- ✅ Trạng thái hoàn thành từng xét nghiệm
- ✅ **Liên kết dữ liệu giữa tất cả phần khám**
- ✅ Kết Luận tự động tải dữ liệu từ các phần khác
- ✅ Xuất báo cáo y tế toàn bộ
- ✅ In biên bản khám
- ✅ Lưu trữ vào localStorage
- ✅ Không có lỗi TypeScript

---

## 🔄 Phát Triển Tiếp Theo (Roadmap)

- [ ] Kết nối Database (SQL/MongoDB)
- [ ] Export PDF báo cáo
- [ ] Gửi kết quả qua Email
- [ ] Quản lý lịch tái khám
- [ ] Thông báo nhắc nhở
- [ ] Tài khoản bệnh nhân
- [ ] Thống kê sức khỏe
- [ ] OTP xác thực
- [ ] Integrations khác (FHIR, HL7)

---

## 🐛 Troubleshooting

### **Dữ liệu không lưu?**
1. Kiểm tra Console (F12) có lỗi không
2. Kiểm tra localStorage: Open DevTools → Application → LocalStorage
3. Đảm bảo nhập Mã BHYT trước khi lưu

### **Kết Luận không thấy dữ liệu X-Quang?**
1. Mã BHYT phải giống nhau ở X-Quang và Kết Luận
2. X-Quang phải lưu trước (nút "💾 Lưu Kết Quả")
3. Refresh trang nếu cần

### **Xóa toàn bộ dữ liệu (Reset)**
```javascript
// Paste vào DevTools Console
Object.keys(localStorage)
  .filter(key => key.startsWith('exam_') || key.startsWith('patients'))
  .forEach(key => localStorage.removeItem(key))
```

---

## 📞 Hỗ Trợ

- **Issues:** Báo cáo lỗi tại GitHub Issues
- **Documentation:** Chi tiết tại `DATA_LINKING_GUIDE.md`
- **Demo Code:** Xem `DEMO_DATA_LINKING.ts`

---

## 📄 Giấy Phép

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại

---

## 👥 Đóng Góp

Mọi đóng góp, báo cáo lỗi, và đề xuất tính năng đều được chào đón!

---

**Cập nhật lần cuối: 2024-12-27**

🎉 **Hệ thống quản lý khám sức khỏe định kỳ - Liên kết dữ liệu từ đầu đến cuối!**
