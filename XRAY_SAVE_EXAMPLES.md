// ============================================================
// X-RAY FORM SAVE FUNCTIONALITY - IMPLEMENTATION EXAMPLES
// ============================================================

/**
 * File: handleSaveXrayResult Function
 * Location: src/pages/XrayFormPage.tsx (Lines 145-215)
 * 
 * Purpose: Save X-ray examination results to database/localStorage
 *          and link them to patient records by insurance number
 */

// ============================================================
// Example 1: BASIC SAVE WORKFLOW
// ============================================================
/*
USER STEPS:
1. Fill in Parts 1-3 of the form (Indication, Description, Conclusion)
2. Scroll to Part 4 - THÔNG TIN BỆNH NHÂN
3. Enter Insurance Number: "BH12345678" (REQUIRED)
4. Enter Patient Name: "Nguyễn Văn A"
5. (Optional) Enter Patient ID: "123456"
6. Click "💾 Lưu Kết Quả X-Quang" button

SYSTEM PROCESS:
1. Validates that Insurance Number is filled
2. Creates XrayResult object with all form data:
   {
     id: "xray_BH12345678_1708456200000",
     insuranceNumber: "BH12345678",
     patientName: "Nguyễn Văn A",
     examinationDate: "2024-02-20",
     description: "Ổ bụng thẳng, không có dấu hiệu...",
     conclusion: "Không phát hiện bất thường...",
     ...otherFields
   }
3. Saves to localStorage key: "xray_BH12345678"
4. Updates patient record in "allPatients":
   - Finds patient with matching insuranceNumber
   - Sets xrayTest.status = "completed"
   - Adds timestamp
5. Shows success alert: "✅ Đã lưu kết quả X-Quang cho bệnh nhân: Nguyễn Văn A"

RESULT:
- X-ray data is stored
- Patient record is updated
- X-ray shows as ✓ (completed) in Patient List modal
*/

// ============================================================
// Example 2: DATA STRUCTURE IN STORAGE
// ============================================================

// Stored in localStorage as: xray_{insuranceNumber}
// Example: localStorage["xray_BH12345678"]

const exampleStoredData = [
  {
    id: "xray_BH12345678_1708456200000",
    insuranceNumber: "BH12345678",
    patientId: "123456",
    patientName: "Nguyễn Văn A",
    examinationDate: "2024-02-20",
    createdAt: "2024-02-20T10:30:00.000Z",
    xrayType: "Abdomen",
    template: "abd_001",
    
    // Indication (Part 1)
    customIndication: "Chụp X-quang ổ bụng thẳng",
    selectedIndications: ["pain", "swelling"],
    additionalIndications: "Bệnh nhân đau bụng khoảng 2 ngày",
    newIndication: "",
    useOtherIndication: false,
    
    // Description (Part 2)
    description: "Ổ bụng thẳng, không có dấu hiệu...",
    selectedResults: ["normal"],
    additionalResults: "Hình ảnh không phát hiện bất thường",
    newResult: "",
    useOtherResult: false,
    
    // Conclusion (Part 3)
    conclusion: "Không phát hiện bất thường trong ổ bụng",
    recommendations: "Tái khám nếu triệu chứng kéo dài",
    instructions: "Uống nước ấm, tránh thức ăn cứng",
    technician: "Kỹ Thuật Viên A",
    radiologist: "BS Lê Hoàng",
    signature: "Dr. Lê Hoàng",
    signatureType: "digital"
  },
  // Next X-ray examination for same patient...
]

// ============================================================
// Example 3: PATIENT RECORD UPDATE
// ============================================================

// Before Save - Patient in "allPatients":
const patientBefore = {
  id: "P001",
  insuranceNumber: "BH12345678",
  name: "Nguyễn Văn A",
  age: 45,
  gender: "Nam",
  phone: "0912345678",
  physicalTest: { status: "completed", date: "2024-01-15" },
  labTest: { status: "pending" },
  xrayTest: { status: "pending" }  // ← Before save
  // ...other fields
}

// After Save - Patient in "allPatients":
const patientAfter = {
  id: "P001",
  insuranceNumber: "BH12345678",
  name: "Nguyễn Văn A",
  age: 45,
  gender: "Nam",
  phone: "0912345678",
  physicalTest: { status: "completed", date: "2024-01-15" },
  labTest: { status: "pending" },
  xrayTest: {                        // ← After save
    status: "completed",
    date: "2024-02-20",
    result: {                        // Contains full X-ray data
      id: "xray_BH12345678_1708456200000",
      description: "...",
      conclusion: "...",
      // ...all other X-ray fields
    }
  },
  lastModified: "2024-02-20T10:30:00.000Z"
}

// ============================================================
// Example 4: HANDLING MULTIPLE X-RAY RECORDS
// ============================================================

// Patient can have multiple X-ray records
// Each stored with unique ID based on timestamp

const allXrayRecordsForPatient = [
  {
    id: "xray_BH12345678_1708456200000",  // First X-ray - Feb 20
    examinationDate: "2024-02-20",
    xrayType: "Abdomen",
    conclusion: "Bình thường"
  },
  {
    id: "xray_BH12345678_1709000000000",  // Second X-ray - Feb 27
    examinationDate: "2024-02-27",
    xrayType: "Chest",
    conclusion: "Viêm phổi nhẹ"
  },
  {
    id: "xray_BH12345678_1709500000000",  // Third X-ray - Mar 4
    examinationDate: "2024-03-04",
    xrayType: "Spine",
    conclusion: "Thoát vị đĩa đệm"
  }
]

// ============================================================
// Example 5: ERROR HANDLING
// ============================================================

// Scenario 1: Missing Insurance Number
if (!formData.insuranceNumber && !formData.patientId) {
  alert('⚠️ Vui lòng nhập Mã Bảo Hiểm Y Tế hoặc ID Bệnh Nhân để lưu kết quả!')
  return  // ← Function stops, data not saved
}

// Scenario 2: Form data is invalid
try {
  const xrayResult = { /* ...data... */ }
  localStorage.setItem(storageKey, JSON.stringify(existingXrays))
  // Success - show confirmation
  alert(`✅ Đã lưu kết quả...`)
} catch (error) {
  // Failure - show error
  alert(`❌ Lỗi khi lưu dữ liệu: ${error.message}`)
  console.error('Error:', error)
}

// ============================================================
// Example 6: INTEGRATION WITH PATIENT DASHBOARD
// ============================================================

/*
AFTER SUCCESSFUL SAVE:

1. Go to "Danh Sách Bệnh Nhân" (Patient List)
2. Click on patient's insurance number: "BH12345678"
3. Modal opens showing patient details
4. X-Quang row now shows: "✓ Completed" (in green)
   - Previously showed: "○ Pending" (in yellow)
5. Click on X-Quang row to see:
   - Examination date
   - X-ray type
   - Results summary
   - Option to view/print full report

PATIENT PROGRESS BAR UPDATED:
- Before: 5/10 tests completed (50%)
- After: 6/10 tests completed (60%)
*/

// ============================================================
// Example 7: USING "THÊM CHỈ ĐỊNH MỰI" (ADD NEW INDICATION)
// ============================================================

/*
USER SCENARIO: 
Doctor wants to record a new type of indication not in the system yet.

STEPS:
1. While filling the form, check: "✏️ Thêm Chỉ Định Mới"
2. A textarea appears with blue background
3. Enter new indication: "Chụp X-quang với chất cản quang"
4. Continue with rest of form
5. Click "💾 Lưu Kết Quả X-Quang"

RESULT:
- X-ray data is saved normally
- newIndication field contains the new data:
  {
    newIndication: "Chụp X-quang với chất cản quang",
    useOtherIndication: true
  }
- In future versions, this can be added to template library
- Creates audit trail of newly used indications
*/

// ============================================================
// Example 8: USING "KHÁC" (OTHER) OPTION
// ============================================================

/*
USER SCENARIO:
Patient has a unique condition not covered by standard templates

STEPS (Part 1):
1. Check: "🔸 Khác (Bệnh nhân không thuộc các trường hợp trên)"
2. Textarea appears with orange background
3. Enter: "Bệnh nhân bị tai nạn giao thông, cần kiểm tra toàn thân"

STEPS (Part 2 - for Results):
1. Check: "🔸 Khác (Kết quả không thuộc các trường hợp trên)"
2. Textarea appears with orange background
3. Enter: "Phát hiện gãy xương sườn, chảy máu nhẹ"

RESULT:
- Form data saved with custom information
- Can handle edge cases and unusual presentations
- System doesn't require strict adherence to templates
- Maintains flexibility for real-world complexity
*/

// ============================================================
// Example 9: PRINT vs SAVE - UNDERSTANDING THE DIFFERENCE
// ============================================================

/*
TWO SEPARATE ACTIONS:

1️⃣ 💾 SAVE (Required for data persistence)
   - Stores data to localStorage
   - Links to patient record
   - Creates permanent record
   - Updates patient status (✓ Completed)
   - Must have Insurance Number
   - Happens immediately

2️⃣ 🖨️ PRINT (Optional for documentation)
   - Creates printable HTML document
   - Can print or save as PDF
   - Used for:
     * Giving copy to patient
     * Sending to another doctor
     * Physical record keeping
   - Can be done before or after saving
   - No data persistence (just creates view)

WORKFLOW RECOMMENDATION:
1. Fill form completely
2. Click SAVE first (to store data)
3. Then PRINT (to create physical copy)
4. Can view/print again later from Patient List
*/

// ============================================================
// Example 10: ACCESSING SAVED X-RAY DATA LATER
// ============================================================

// Code example (for developers):

// Get all X-ray records for a patient
function getPatientXrays(insuranceNumber) {
  const xraysJson = localStorage.getItem(`xray_${insuranceNumber}`)
  if (!xraysJson) return []
  return JSON.parse(xraysJson)
}

// Usage:
const patientXrays = getPatientXrays("BH12345678")
console.log(`Found ${patientXrays.length} X-ray records for this patient`)
patientXrays.forEach(xray => {
  console.log(`- ${xray.examinationDate}: ${xray.xrayType}`)
})

// Get latest X-ray
function getLatestXray(insuranceNumber) {
  const xrays = getPatientXrays(insuranceNumber)
  return xrays[xrays.length - 1] || null
}

// Get X-ray by type
function getXrayByType(insuranceNumber, type) {
  const xrays = getPatientXrays(insuranceNumber)
  return xrays.filter(x => x.xrayType === type)
}

// ============================================================
// Example 11: FUTURE DATABASE INTEGRATION
// ============================================================

/*
Current: localStorage (browser storage)
Future: Backend database

MIGRATION PLAN (v2.0):
1. Create REST API endpoints:
   POST /api/xray/save
   GET  /api/xray/{patientId}
   GET  /api/xray/{patientId}/{xrayId}

2. Update handleSaveXrayResult to call API:
   const response = await fetch('/api/xray/save', {
     method: 'POST',
     body: JSON.stringify(xrayResult)
   })

3. Maintain localStorage as offline cache
4. Sync when network available
5. Full backup and archival capabilities

BENEFITS:
✅ Permanent storage
✅ Multi-device access
✅ Advanced analytics
✅ Compliance with regulations
✅ Disaster recovery
*/

// ============================================================
// Example 12: VALIDATION RULES (Current & Future)
// ============================================================

const validationRules = {
  // Required fields
  insuranceNumber: {
    required: true,
    pattern: /^[A-Z0-9]{8,20}$/,
    message: "Mã bảo hiểm phải từ 8-20 ký tự"
  },
  patientName: {
    required: false,
    minLength: 3,
    pattern: /^[a-zA-ZĐđ\s]+$/,
    message: "Tên bệnh nhân không hợp lệ"
  },
  examinationDate: {
    required: true,
    type: "date",
    message: "Ngày khám không hợp lệ"
  },
  description: {
    required: true,
    minLength: 10,
    message: "Mô tả phải có ít nhất 10 ký tự"
  },
  conclusion: {
    required: true,
    minLength: 10,
    message: "Kết luận phải có ít nhất 10 ký tự"
  }
}

// ============================================================
// SUMMARY
// ============================================================

/*
KEY FEATURES IMPLEMENTED:

✅ Save X-ray data to localStorage
✅ Link to patient via insurance number
✅ Update patient record with completion status
✅ Create unique ID for each X-ray record
✅ Add new indication/result fields
✅ Handle "Other" custom cases
✅ Validate required fields
✅ Error handling with user feedback
✅ Include patient info in print output
✅ Support multiple X-ray records per patient

READY FOR:
✅ Production use with localStorage
⏳ Database migration (v2.0)
⏳ Advanced features (analytics, reporting, etc.)

For questions or issues, see:
- XRAY_FORM_GUIDE.md (User guide)
- CHANGELOG_XRAY.md (Technical changes)
- XrayFormPage.tsx (Source code)
*/
