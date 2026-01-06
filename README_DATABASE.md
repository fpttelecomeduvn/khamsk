# 📦 Database & Data Management System

## Tổng Quan

Hệ thống quản lý khám sức khỏe có một cấu trúc database hoàn chỉnh để lưu trữ tất cả thông tin bệnh nhân, kết quả khám, và hình ảnh y tế.

## 📁 Cấu Trúc Thư Mục

```
khamsk/
├── src/
│   ├── data/
│   │   └── sampleData.ts          # Dữ liệu mẫu (6 bệnh nhân, 2 phiếu khám)
│   ├── types/
│   │   └── database.ts             # Schema & TypeScript interfaces
│   ├── utils/
│   │   ├── databaseManager.ts      # Quản lý database (CRUD operations)
│   │   └── imageUploader.ts        # Xử lý upload & lưu trữ hình ảnh
│   ├── pages/
│   │   └── DataController.tsx      # Trang quản lý database
│   └── styles/
│       └── DataController.css      # Styling cho Data Controller
├── public/
│   └── images/
│       ├── xray/                   # Thư mục lưu hình X-quang
│       ├── ultrasound/             # Thư mục lưu hình siêu âm
│       └── endoscopy/              # Thư mục lưu hình nội soi
└── README_DATABASE.md              # File này
```

## 📊 Database Schema

### 1. **Patient (Bệnh Nhân)**

```typescript
interface Patient {
  id: string                         // ID duy nhất (patient_xxx)
  fullName: string                   // Tên bệnh nhân
  dateOfBirth: string               // Ngày sinh (yyyy-mm-dd)
  gender: 'male' | 'female' | 'other'
  insuranceNumber?: string          // Số thẻ BHYT (tùy chọn)
  phoneNumber?: string              // Điện thoại
  address?: string                  // Địa chỉ
  email?: string                    // Email
  createdAt: string                 // Ngày tạo (ISO timestamp)
  updatedAt: string                 // Cập nhật lần cuối
  status: 'active' | 'inactive' | 'archived'
}
```

**Ví dụ:**
```json
{
  "id": "patient_001",
  "fullName": "Nguyễn Văn A",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "insuranceNumber": "BH2024001",
  "phoneNumber": "0912345678",
  "address": "123 Đường Trần Hưng Đạo, TP HCM",
  "email": "nguyenvana@email.com",
  "status": "active"
}
```

### 2. **ExaminationRecord (Bộ Hồ Sơ Khám)**

```typescript
interface ExaminationRecord {
  id: string                         // ID duy nhất (exam_xxx)
  patientId: string                 // Tham chiếu bệnh nhân
  patientName: string               // Tên bệnh nhân (cache)
  createdDate: string               // Ngày khám (yyyy-mm-dd)
  completionStatus: {               // Trạng thái hoàn thành
    mainExamination: boolean
    xrayTest: boolean
    ecgTest: boolean
    ultrasoundTest: boolean
    hematologyTest: boolean
    biochemistryTest: boolean
    urinalysisTest: boolean
    conclusion: boolean
  }
  examinationData: {                // Dữ liệu khám từ 7 loại kiểm tra
    mainExamination?: MainExaminationData
    xrayTest?: XrayTestData
    ecgTest?: ECGTestData
    ultrasoundTest?: UltrasoundTestData
    hematologyTest?: HematologyTestData
    biochemistryTest?: BiochemistryTestData
    urinalysisTest?: UrinalysisTestData
    conclusion?: ConclusionData
  }
}
```

### 3. **Main Examination (Khám Chính)**

```typescript
interface MainExaminationData {
  date: string                      // yyyy-mm-dd
  height: number                    // cm
  weight: number                    // kg
  bloodPressure: string            // 120/80
  heartRate: number                // bpm
  temperature: number              // °C
  respiratoryRate: number          // breaths/min
  generalCondition: string         // Tình trạng chung
  skinExamination: string          // Khám da
  cardiacExamination: string       // Khám tim
  pulmonaryExamination: string     // Khám phổi
  abdominalExamination: string     // Khám bụng
  neurologicalExamination: string  // Khám thần kinh
  notes: string                    // Ghi chú
  doctorName: string               // Tên bác sĩ
  status: 'completed' | 'pending'
}
```

### 4. **X-Ray Test (Chụp X-Quang)**

```typescript
interface XrayTestData {
  date: string
  type: 'chest' | 'abdominal' | 'extremity' | 'spine' | 'other'
  bodyPart: string                 // Vị trí chụp
  findings: string                 // Phát hiện
  conclusion: string               // Kết luận
  recommendations: string          // Khuyến cáo
  imageUrl?: string               // /images/xray/filename.jpg
  imageBase64?: string            // Base64 của hình ảnh
  doctorName: string
  status: 'completed' | 'pending'
}
```

### 5. **ECG Test (Điện Tim)**

```typescript
interface ECGTestData {
  date: string
  heartRate: number               // nhịp/phút
  rhythm: 'normal' | 'irregular' | 'other'
  findings: string[]              // Mảng các phát hiện
  hasAtrialFibrillation: boolean
  hasPrematureContractions: boolean
  hasSTChanges: boolean
  hasTWaveChanges: boolean
  hasQRSWidening: boolean
  otherFindings: string
  conclusion: string
  recommendations: string
  doctorName: string
  status: 'completed' | 'pending'
}
```

### 6. **Ultrasound Test (Siêu Âm)**

```typescript
interface UltrasoundTestData {
  date: string
  type: 'abdominal' | 'cardiac' | 'thyroid' | 'breast' | 'pelvic' | 'other'
  liverStatus: 'normal' | 'fatty_liver' | 'cirrhosis' | 'abnormal' | 'N/A'
  gallbladderStatus: 'normal' | 'stones' | 'abnormal' | 'N/A'
  pancreasStatus: 'normal' | 'abnormal' | 'N/A'
  spleenStatus: 'normal' | 'abnormal' | 'N/A'
  leftKidneyStatus: 'normal' | 'stones' | 'abnormal' | 'N/A'
  rightKidneyStatus: 'normal' | 'stones' | 'abnormal' | 'N/A'
  findings: string
  conclusion: string
  recommendations: string
  imageUrl?: string
  imageBase64?: string
  doctorName: string
  status: 'completed' | 'pending'
}
```

### 7. **Hematology Test (Xét Nghiệm Huyết Học)**

```typescript
interface HematologyTestData {
  date: string
  redBloodCells: { value: number; unit: string; normal: string }
  whiteBloodCells: { value: number; unit: string; normal: string }
  hemoglobin: { value: number; unit: string; normal: string }
  hematocrit: { value: number; unit: string; normal: string }
  platelets: { value: number; unit: string; normal: string }
  notes: string
  normalValues: string
  doctorName: string
  status: 'completed' | 'pending'
}
```

### 8. **Biochemistry Test (Xét Nghiệm Sinh Hóa)**

```typescript
interface BiochemistryTestData {
  date: string
  glucose: { value: number; unit: string; normal: string }
  cholesterol: { value: number; unit: string; normal: string }
  triglycerides: { value: number; unit: string; normal: string }
  creatinine: { value: number; unit: string; normal: string }
  urea: { value: number; unit: string; normal: string }
  AST: { value: number; unit: string; normal: string }
  ALT: { value: number; unit: string; normal: string }
  notes: string
  normalValues: string
  doctorName: string
  status: 'completed' | 'pending'
}
```

### 9. **Urinalysis Test (Xét Nghiệm Nước Tiểu)**

```typescript
interface UrinalysisTestData {
  date: string
  color: string
  pH: { value: number; normal: string }
  glucose: string                  // negative/positive/trace
  protein: string
  leucocytes: string
  nitrites: string
  specificGravity: { value: number; normal: string }
  notes: string
  normalValues: string
  doctorName: string
  status: 'completed' | 'pending'
}
```

### 10. **Conclusion (Kết Luận)**

```typescript
interface ConclusionData {
  date: string
  conclusion: string               // Nội dung kết luận
  healthLevel: 'excellent' | 'good' | 'fair' | 'poor'
  recommendations: string          // Khuyến cáo
  followUpRequired: boolean
  followUpDays?: number
  doctorName: string
  status: 'completed' | 'pending'
}
```

### 11. **Image Metadata (Metadata Hình Ảnh)**

```typescript
interface ImageMetadata {
  id: string                       // img_xxx
  patientId: string
  patientName: string
  type: 'xray' | 'ultrasound' | 'endoscopy' | 'other'
  subType?: string                 // Chi tiết loại (e.g., "abdominal")
  fileName: string                 // xray_NguyenVanA_2024-12-27_xxx.jpg
  filePath: string                 // /images/xray/filename.jpg
  fileSize: number                 // bytes
  uploadedDate: string             // ISO timestamp
  description?: string
  examinationId?: string           // Tham chiếu exam record
}
```

## 💾 Lưu Trữ Dữ Liệu

### LocalStorage

- **Vị trí:** Browser's LocalStorage
- **Dung lượng:** 5-10MB (tùy trình duyệt)
- **Key chính:** `examination_database`
- **Hình ảnh:** Base64 encoded, stored with key `img_{imageId}`

### Cấu trúc Database trong LocalStorage

```json
{
  "examination_database": {
    "version": "1.0.0",
    "lastUpdated": "2024-12-27T10:30:00.000Z",
    "patients": [...],
    "examinationRecords": [...],
    "images": [...]
  }
}
```

## 🛠️ Database Manager - API Reference

### Khởi tạo

```typescript
import { db } from '@/utils/databaseManager'

// Khởi tạo database
db.initialize()

// Lấy database hiện tại
const database = db.getDatabase()
```

### Patient Operations

```typescript
// Thêm bệnh nhân
const patient = db.addPatient({
  id: 'patient_001',
  fullName: 'Nguyễn Văn A',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  // ...
})

// Cập nhật bệnh nhân
db.updatePatient('patient_001', {
  phoneNumber: '0912345678'
})

// Lấy thông tin bệnh nhân
const patient = db.getPatient('patient_001')

// Lấy tất cả bệnh nhân
const allPatients = db.getAllPatients()

// Xóa bệnh nhân (và tất cả dữ liệu liên quan)
db.deletePatient('patient_001')
```

### Examination Record Operations

```typescript
// Tạo exam record mới
const record = db.createExaminationRecord('patient_001', 'Nguyễn Văn A')

// Cập nhật completion status
db.updateCompletionStatus('exam_xxx', 'xrayTest', true)

// Lấy tất cả exams của bệnh nhân
const records = db.getPatientExaminationRecords('patient_001')

// Xóa exam record
db.deleteExaminationRecord('exam_xxx')
```

### Image Operations

```typescript
// Thêm image metadata
const metadata = db.addImageMetadata({
  id: 'img_123',
  patientId: 'patient_001',
  patientName: 'Nguyễn Văn A',
  type: 'xray',
  fileName: 'xray_NguyenVanA_2024-12-27.jpg',
  // ...
})

// Lấy hình ảnh theo loại
const xrayImages = db.getImagesByType('patient_001', 'xray')

// Lấy tất cả hình ảnh của bệnh nhân
const allImages = db.getPatientImages('patient_001')

// Xóa hình ảnh
db.deleteImage('img_123')

// Xóa tất cả hình ảnh của bệnh nhân
db.deletePatientImages('patient_001')
```

### Backup/Restore

```typescript
// Tạo backup
const backup = db.createBackup()

// Export JSON
const json = db.exportAsJSON()

// Import từ JSON
db.importFromJSON(jsonString)

// Download backup file
db.downloadBackup()

// Xóa toàn bộ database
db.clearDatabase() // Cần xác nhận
```

### Statistics

```typescript
const stats = db.getStatistics()
// {
//   totalPatients: 10,
//   totalExaminations: 25,
//   completedExaminations: 15,
//   totalImages: 42,
//   imagesByType: {
//     xray: 20,
//     ultrasound: 15,
//     endoscopy: 7
//   }
// }
```

## 📸 Image Uploader - API Reference

```typescript
import { ImageUploader } from '@/utils/imageUploader'

// Upload X-ray
const metadata = await ImageUploader.uploadXrayImage(
  file,
  'patient_001',
  'Nguyễn Văn A',
  'exam_123'
)

// Upload Ultrasound
const metadata = await ImageUploader.uploadUltrasoundImage(
  file,
  'patient_001',
  'Nguyễn Văn A',
  'abdominal',
  'exam_123'
)

// Upload Endoscopy
const metadata = await ImageUploader.uploadEndoscopyImage(
  file,
  'patient_001',
  'Nguyễn Văn A',
  'gastroscopy',
  'exam_123'
)

// Lấy image base64
const base64 = ImageUploader.getImageBase64('img_123')

// Tạo data URL để display
const dataUrl = ImageUploader.getImageDataUrl('img_123')

// Xóa image
ImageUploader.deleteImage('img_123')

// Kiểm tra dung lượng
const usage = ImageUploader.getStorageUsage()
// { usedMB: 2.5, images: 10, largestImage: 0.8 }

// Kiểm tra dung lượng còn trống
const space = ImageUploader.checkStorageSpace()
// { available: true, usedPercentage: 50, warning: false }
```

## 📊 Data Controller

Trang quản lý database tại `/data-controller` cung cấp:

- 📊 Thống kê tổng quát (bệnh nhân, lần khám, hình ảnh)
- 👥 Danh sách bệnh nhân
- 💾 Export/Import dữ liệu
- 📸 Thống kê hình ảnh
- 💿 Kiểm tra dung lượng lưu trữ
- 🗑️ Xóa toàn bộ database

## 🔄 Workflow Lưu Trữ Dữ Liệu

```
1. Bệnh nhân bước vào → Tạo Patient record
   ↓
2. Bắt đầu khám → Tạo ExaminationRecord
   ↓
3. Nhập từng loại khám
   - Main Examination
   - X-ray (+ hình ảnh)
   - ECG
   - Ultrasound (+ hình ảnh)
   - Lab tests
   ↓
4. Lưu kết luận → Update conclusion
   ↓
5. Dữ liệu lưu vào database
   - exam_${patientName} (deprecated)
   - examination_database (new)
```

## 🔒 Bảo Mật & Giới Hạn

- LocalStorage limit: ~5-10MB
- Hình ảnh: Base64 encoded
- Không có end-to-end encryption (tùy chọn thêm)
- Tất cả dữ liệu lưu cục bộ (không cloud)

## 🚀 Hướng Phát Triển

- [ ] Thêm cloud backup (Firebase, AWS S3)
- [ ] Hỗ trợ export Excel/PDF
- [ ] Encryption dữ liệu nhạy cảm
- [ ] Compression hình ảnh
- [ ] Indexeddb để tăng dung lượng
- [ ] Real-time sync giữa devices
