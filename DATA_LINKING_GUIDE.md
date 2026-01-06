# 📋 Hướng Dẫn Liên Kết Dữ Liệu Khám Bệnh

## Tổng Quan

Hệ thống quản lý khám sức khỏe định kỳ đã được cập nhật để liên kết dữ liệu từ tất cả các phần khám thành một bệnh án toàn diện. Dữ liệu được lưu trữ và tổng hợp theo mã bảo hiểm của bệnh nhân.

---

## 🔗 Quy Trình Liên Kết Dữ Liệu

### 1. **Khám Chính (Phiếu Khám)**
- Nhập thông tin bệnh nhân: BHYT, tên, tuổi, giới tính
- Đo các chỉ số: Huyết áp, nhịp tim, nhiệt độ, BMI, v.v.
- Ghi chú về tình trạng chung
- **Dữ liệu được lưu vào:** `exam_${insuranceNumber}` → `physicalExamination`

### 2. **X-Quang**
- Chọn loại X-quang (Ngực, Đầu, Xương sống, v.v.)
- Chọn template hoặc nhập tự do
- Nhập mô tả và kết luận
- **Quan trọng:** Nhập **Mã Bảo Hiểm Y Tế** để liên kết với bệnh nhân
- Nút "💾 Lưu Kết Quả X-Quang" sẽ lưu vào `exam_${insuranceNumber}` → `xrayTest`

### 3. **Xét Nghiệm Máu / Xét Nghiệm Khác**
- Nhập kết quả các xét nghiệm
- Liên kết thông qua mã bảo hiểm
- **Dữ liệu được lưu vào:** `exam_${insuranceNumber}` → `labTest` hoặc `otherTests`

### 4. **Kết Luận Tổng Kết**
- Trang Kết Luận tự động tải toàn bộ dữ liệu từ các phần trước
- Hiển thị:
  - 📊 Dữ liệu từ Khám chính
  - 📸 Kết quả X-Quang
  - 🧬 Kết quả Xét nghiệm máu
  - 🔬 Các xét nghiệm khác
  - ✓ Trạng thái hoàn thành
- Bác sĩ nhập Kết luận, Khuyến cáo, và thông tin tái khám
- Nút "💾 Lưu Kết Luận" lưu kết quả cuối cùng

---

## 💾 Cấu Trúc Dữ Liệu LocalStorage

```
localStorage: {
  "exam_[BHYT]": {
    "insuranceNumber": "MA123456",
    "patientName": "Nguyễn Văn A",
    "examinationStartDate": "2024-12-27",
    "examinationData": {
      "physicalExamination": {
        "blood_pressure": "120/80",
        "heart_rate": 72,
        "bmi": 22.5,
        "date": "2024-12-27"
      },
      "xrayTest": {
        "status": "completed",
        "type": "Chụp X-quang ngực",
        "description": "Mô tả chi tiết...",
        "conclusion": "Kết luận...",
        "date": "2024-12-27"
      },
      "labTest": {
        "status": "completed",
        "results": { "RBC": 4.5, "WBC": 7.0 },
        "date": "2024-12-27"
      },
      "finalConclusion": {
        "healthStatus": "good",
        "summary": "Tóm tắt sức khỏe",
        "recommendations": "Khuyến cáo...",
        "followUpRequired": true,
        "followUpDays": 30
      }
    },
    "status": "completed",
    "lastModified": "2024-12-27T10:30:00Z"
  }
}
```

---

## 🛠️ Các Hàm Utility Quản Lý Dữ Liệu

Tất cả các hàm nằm trong file: `src/utils/examinationDataManager.ts`

### **1. getPatientExaminationData(insuranceNumber)**
Lấy toàn bộ bệnh án của bệnh nhân
```typescript
const record = getPatientExaminationData('MA123456')
console.log(record.examinationData) // Tất cả dữ liệu khám
```

### **2. updatePhysicalExamination(insuranceNumber, data)**
Cập nhật dữ liệu khám chính
```typescript
updatePhysicalExamination('MA123456', {
  blood_pressure: '120/80',
  heart_rate: 72,
  bmi: 22.5
})
```

### **3. updateXrayTest(insuranceNumber, data)**
Cập nhật kết quả X-quang
```typescript
updateXrayTest('MA123456', {
  type: 'Chụp X-quang ngực',
  description: '...',
  conclusion: '...'
})
```

### **4. updateLabTest(insuranceNumber, data)**
Cập nhật kết quả xét nghiệm máu
```typescript
updateLabTest('MA123456', {
  results: { 'RBC': 4.5, 'WBC': 7.0 },
  notes: '...'
})
```

### **5. updateOtherTest(insuranceNumber, testName, data)**
Cập nhật xét nghiệm khác (ECG, Siêu âm, v.v.)
```typescript
updateOtherTest('MA123456', 'ECG', {
  result: 'Bình thường',
  notes: '...'
})
```

### **6. updateFinalConclusion(insuranceNumber, data)**
Lưu kết luận tổng kết (chỉ gọi từ ConclusionPage)
```typescript
updateFinalConclusion('MA123456', {
  healthStatus: 'good',
  summary: '...',
  recommendations: '...',
  followUpRequired: true,
  followUpDays: 30
})
```

### **7. getCompletionStatus(insuranceNumber)**
Kiểm tra các phần đã hoàn thành
```typescript
const status = getCompletionStatus('MA123456')
console.log(status)
// {
//   physicalExamination: true,
//   xrayTest: true,
//   labTest: false,
//   otherTests: true,
//   finalConclusion: false
// }
```

### **8. generateFullMedicalReport(insuranceNumber)**
Tạo báo cáo y tế toàn bộ (dạng text)
```typescript
const report = generateFullMedicalReport('MA123456')
// Lưu hoặc xuất file
```

---

## 📱 Luồng Công Việc Khuyến Nghị

### **Ngày Khám - Bước 1: Khám Chính**
1. Tạo bệnh nhân mới → Nhập BHYT
2. Vào "Phiếu Khám Chính"
3. Đo các chỉ số, ghi chú
4. Lưu (dữ liệu tự động lưu vào `exam_BHYT`)

### **Ngày Khám - Bước 2: X-Quang**
1. Vào "X-Quang"
2. Nhập **Mã Bảo Hiểm** (quan trọng!)
3. Chọn loại X-quang, nhập mô tả/kết luận
4. Nút "💾 Lưu Kết Quả X-Quang"
5. Dữ liệu tự động thêm vào `exam_BHYT`

### **Ngày Khám - Bước 3: Xét Nghiệm Khác**
1. Vào các trang xét nghiệm (máu, ECG, siêu âm, v.v.)
2. Nhập kết quả
3. Lưu (tương tự X-quang)

### **Bước 4: Kết Luận Tổng Kết**
1. Vào "Kết Luận"
2. Trang tự động hiển thị tất cả dữ liệu từ các phần trước
3. Kiểm tra trạng thái hoàn thành
4. Bác sĩ viết Kết luận, Khuyến cáo, Tái khám
5. Nút "💾 Lưu Kết Luận" → Hoàn thành bệnh án
6. Nút "📄 Xuất Báo Cáo Toàn Bộ" → In hoặc lưu file

---

## 🔍 Tìm Dữ Liệu Bệnh Nhân

### **Từ Console (Developer Tools)**
```javascript
// Lấy tất cả bệnh án
const allRecords = Object.keys(localStorage)
  .filter(key => key.startsWith('exam_'))
  .map(key => JSON.parse(localStorage.getItem(key)))

// Lấy 1 bệnh án cụ thể
const record = JSON.parse(localStorage.getItem('exam_MA123456'))
console.log(record)
```

### **Từ Code**
```typescript
import { getPatientExaminationData } from './utils/examinationDataManager'

const record = getPatientExaminationData('MA123456')
if (record) {
  console.log('Khám chính:', record.examinationData.physicalExamination)
  console.log('X-Quang:', record.examinationData.xrayTest)
  console.log('Kết luận:', record.examinationData.finalConclusion)
}
```

---

## 🐛 Troubleshooting

### **Dữ liệu X-Quang không lưu**
- ✅ Kiểm tra: Có nhập Mã Bảo Hiểm Y Tế không?
- ✅ Kiểm tra: Có nhấn nút "💾 Lưu Kết Quả X-Quang" không?
- ✅ Kiểm tra Console: Có lỗi JavaScript không?

### **Kết Luận không thấy dữ liệu từ X-Quang**
- ✅ Mã BHYT trong X-Quang và ConclusionPage phải giống nhau
- ✅ X-Quang phải được lưu trước khi vào Kết Luận
- ✅ Refresh trang để tải lại dữ liệu

### **Xóa toàn bộ dữ liệu (nếu cần reset)**
```javascript
// Xóa tất cả bệnh án
Object.keys(localStorage)
  .filter(key => key.startsWith('exam_'))
  .forEach(key => localStorage.removeItem(key))
```

---

## 📊 Tính Năng Nâng Cao

### **Tái Khám Tự Động**
Khi lưu Kết Luận với `followUpRequired: true` và `followUpDays: 30`, hệ thống sẽ:
- Ghi nhớ ngày tái khám
- Có thể thêm notification trong tương lai

### **Báo Cáo Y Tế**
Hàm `generateFullMedicalReport()` tạo báo cáo dạng text chứa:
- Thông tin bệnh nhân
- Tất cả kết quả xét nghiệm
- Kết luận và khuyến cáo
- Có thể copy-paste vào Word hoặc lưu thành file

### **Lịch Sử Khám**
Mỗi lần cập nhật, `lastModified` được ghi nhớ để theo dõi lịch sử thay đổi.

---

## 🚀 Phát Triển Tiếp Theo

- [ ] Kết nối với Database thay vì LocalStorage
- [ ] Export báo cáo PDF
- [ ] Gửi kết quả cho bệnh nhân qua Email/SMS
- [ ] Quản lý lịch tái khám
- [ ] Thống kê sức khỏe cộng đồng
- [ ] Kiểm tra tương tác thuốc

---

**Tài liệu này cập nhật lần cuối: 2024-12-27**
