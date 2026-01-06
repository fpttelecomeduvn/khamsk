# 🎯 X-RAY FORM - QUICK REFERENCE CARD

## 📱 Form Structure (One Page Overview)

```
┌─────────────────────────────────────────────────────┐
│              FORM X-QUANG (X-RAY FORM)             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  TEMPLATE SELECTION (Top of Form)                  │
│  ┌────────────────┬────────────────────┐           │
│  │ Loại X-Quang  │ Template Selection │           │
│  └────────────────┴────────────────────┘           │
│  [✓ Áp Dụng Template] (Apply)                      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📋 PHẦN 1: CHỈ ĐỊNH (INDICATION)                  │
│  ├─ Chỉ Định Chính (Main)                          │
│  ├─ Chỉ Định Khác (Other checkboxes)               │
│  ├─ Chỉ Định Bổ Sung (Additional)                  │
│  ├─ ✏️ Thêm Chỉ Định Mới (NEW)                     │
│  └─ 🔸 Khác (OTHER - custom)                       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📝 PHẦN 2: MÔ TẢ (DESCRIPTION)                     │
│  ├─ Mô Tả Chi Tiết (Main description)              │
│  ├─ Kết Quả Tiêu Chuẩn (Standard results)          │
│  ├─ Kết Quả Bổ Sung (Additional)                   │
│  ├─ ✏️ Thêm Kết Quả Mới (NEW)                      │
│  └─ 🔸 Khác (OTHER - custom)                       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✓ PHẦN 3: KẾT LUẬN (CONCLUSION)                   │
│  ├─ Kết Luận Chẩn Đoán (Diagnosis)                 │
│  ├─ Khuyến Cáo (Recommendations)                   │
│  ├─ Hướng Dẫn (Instructions)                       │
│  └─ Xác Nhận/Ký Duyệt (Signature)                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  👤 PHẦN 4: THÔNG TIN BỆNH NHÂN (NEW)              │
│  ├─ Mã Bảo Hiểm Y Tế ⭐ (REQUIRED)                  │
│  ├─ Tên Bệnh Nhân                                  │
│  └─ ID Bệnh Nhân (Optional)                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ACTION BUTTONS:                                   │
│  [💾 Lưu]  [🖨️ In]  [↻ Reset]                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## ⌨️ KEYBOARD SHORTCUTS & QUICK ACTIONS

| Action | How to Do | Result |
|--------|-----------|--------|
| **Add New Indication** | Check ✏️ box in Part 1 | Blue textarea appears |
| **Add Custom Case (Indication)** | Check 🔸 box in Part 1 | Orange textarea appears |
| **Add New Result** | Check ✏️ box in Part 2 | Blue textarea appears |
| **Add Custom Case (Result)** | Check 🔸 box in Part 2 | Orange textarea appears |
| **Apply Template** | Select + Click ✓ button | Auto-fills description/conclusion |
| **Save X-ray** | Fill Part 4 + Click 💾 | Saves to database |
| **Print Report** | Click 🖨️ button | Opens print dialog |
| **Clear Form** | Click ↻ Reset | All fields cleared |

---

## 🔐 REQUIRED vs OPTIONAL FIELDS

### REQUIRED (Must Fill to Save):
- ⭐ **Mã Bảo Hiểm Y Tế** (Insurance Number) - Part 4
  - Format: Any text, but should match official insurance ID
  - Why: Used to link X-ray to patient record
  - Example: "BH2024001234"

### STRONGLY RECOMMENDED:
- **Tên Bệnh Nhân** (Patient Name) - Part 4
  - Helps identify record later
  - Example: "Nguyễn Văn A"

### OPTIONAL:
- **ID Bệnh Nhân** (Patient ID) - Part 4
- **Chỉ Định Khác** (Other indications) - Part 1
- **Kết Quả Bổ Sung** (Additional results) - Part 2

---

## 💾 SAVE FUNCTIONALITY - FLOWCHART

```
┌─────────────────────────────────┐
│  Click "💾 Lưu Kết Quả X-Quang" │
└────────────┬────────────────────┘
             ↓
    ┌──────────────────┐
    │ Is Insurance #   │
    │ filled?          │
    └────┬──────────┬──┘
         │ NO       │ YES
         ↓         ↓
    ⚠️ Alert   Continue
    "Vui lòng  ↓
     nhập..."  Create record
              (unique ID + timestamp)
              ↓
         Store in localStorage
         key: xray_{Insurance#}
              ↓
         Find patient by Insurance#
         in "allPatients"
              ↓
         Update patient:
         - xrayTest.status = "completed"
         - xrayTest.date = today
         - lastModified = now
              ↓
         ✅ Show success alert:
         "✅ Đã lưu kết quả cho..."
              ↓
         Go to Patient List
         → Click Insurance # → See ✓
```

---

## 📋 COMMON TASKS & SOLUTIONS

### Task: Use a Template Quickly
```
1. Click "Loại X-Quang" dropdown → Select "Chest"
2. Click "Template" dropdown → Select "Chest - PA"
3. Click [✓ Áp Dụng Template]
4. Verify/modify if needed
5. Fill Part 4 (patient info)
6. Click [💾 Save]
Time: ~2 minutes
```

### Task: Enter Custom Patient Data
```
1. Check ✏️ "Thêm Chỉ Định Mới" in Part 1
2. Enter custom indication in blue box
3. OR check 🔸 "Khác" for truly custom cases
4. Fill rest of form normally
5. Fill Part 4 (patient insurance REQUIRED)
6. Click [💾 Save]
Time: ~5 minutes
```

### Task: Handle Special Case
```
1. Check 🔸 "Khác" in Part 1 AND/OR Part 2
2. Write detailed custom description in orange box
3. Don't try to force into standard templates
4. Fill Part 4 completely
5. Click [💾 Save]
6. System marks as "custom" in database
Time: ~5 minutes
```

### Task: Find Saved X-ray Later
```
1. Go to "Danh Sách Bệnh Nhân" (Patient List)
2. Search for or click patient's Insurance #
3. Modal opens showing all exams
4. X-Quang now shows ✓ (completed)
5. Click to see details or print
Time: ~1 minute
```

### Task: Print Official Report
```
1. Fill entire form
2. Click [🖨️ In Biên Bản]
3. Print preview opens
4. Click [Print] or [Save as PDF]
5. Choose printer/location
6. Done!
Note: Can print even without saving
Time: ~1 minute
```

---

## 🎨 COLOR CODING GUIDE

| Color | Meaning | Location |
|-------|---------|----------|
| 🔵 Blue | Indication/Description section | Section 1 & 2 |
| 🟡 Light Blue | New fields for future data | Textarea backgrounds |
| 🟠 Orange | Custom "Other" cases | Textarea backgrounds |
| 🟢 Green | Conclusion/Success | Section 3 + Save button |
| 🟣 Purple | Patient information section | Section 4 |
| ⚪ Gray | Background/text areas | Form elements |

---

## ⚡ TIPS & TRICKS

### Speed Up Data Entry:
- 🚀 Use templates for common cases (saves 70% time)
- 📋 Copy text from similar previous X-rays
- ⌨️ Use keyboard to tab between fields
- 🔄 Don't fill unnecessary "Khác" boxes - use when needed only

### Ensure Quality:
- ✅ Always fill **Insurance Number** (Part 4)
- ✅ Check conclusion for typos before saving
- ✅ Print report for documentation backup
- ✅ Verify patient name matches ID

### Handle Errors:
- ⚠️ Can't save? Check if Insurance # is filled
- ⚠️ Lost data? Use browser back button
- ⚠️ Wrong patient? Delete from localStorage manually
- ⚠️ Need undo? Click Reset and re-enter (careful!)

---

## 🔍 TROUBLESHOOTING QUICK GUIDE

| Problem | Cause | Solution |
|---------|-------|----------|
| "Can't save" | Missing Insurance # | Fill Part 4 - Mã Bảo Hiểm |
| "Data disappeared" | Browser cache cleared | Re-enter data or restore from backup |
| "Template doesn't show" | Wrong X-ray type | Verify selection in dropdown |
| "Print looks wrong" | Browser print settings | Check print preview before printing |
| "Patient not found" | Insurance # mismatch | Verify exact number matches allPatients |
| "Form too slow" | Too much text | Check localStorage size (~5MB limit) |
| "Checkbox won't toggle" | Bug (rare) | Refresh page and try again |

---

## 📊 FORM DATA STRUCTURE

### What Gets Saved:
```javascript
{
  id: "xray_BH2024001234_1708456200000",  // Unique ID
  insuranceNumber: "BH2024001234",         // Patient link
  patientName: "Nguyễn Văn A",             // For reference
  examinationDate: "2024-02-20",           // When done
  createdAt: "2024-02-20T10:30:00.000Z",  // When saved
  
  // Part 1 - Indication
  customIndication: "...",
  selectedIndications: [...],
  additionalIndications: "...",
  newIndication: "...",
  useOtherIndication: false,
  
  // Part 2 - Description
  description: "...",
  selectedResults: [...],
  additionalResults: "...",
  newResult: "...",
  useOtherResult: false,
  
  // Part 3 - Conclusion
  conclusion: "...",
  recommendations: "...",
  instructions: "...",
  technician: "...",
  radiologist: "...",
  
  // Metadata
  xrayType: "Abdomen",
  template: "abd_001",
  signature: "...",
  signatureType: "digital"
}
```

### Where It's Stored:
```
Browser localStorage:
├─ "xray_BH2024001234" → Array of X-ray records
└─ "allPatients" → Updated patient record with:
   └─ xrayTest.status = "completed"
      xrayTest.result = above object
```

---

## 📱 BROWSER SUPPORT

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Fully Supported | Best performance |
| Firefox | ✅ Fully Supported | Excellent support |
| Safari | ✅ Fully Supported | Some minor styling |
| Edge | ✅ Fully Supported | Chromium-based |
| IE 11 | ❌ Not Supported | Too old |

---

## 🔒 DATA SECURITY NOTES

⚠️ **Current Status**: localStorage (browser-based)
- ✅ Encrypted by browser
- ✅ Persists across sessions
- ⚠️ Cleared if browser cache cleared
- ⚠️ Not backed up

🔐 **Future**: Migration to secure backend database (v2.0)
- ✅ Server-side encryption
- ✅ Automatic backups
- ✅ Access controls
- ✅ HIPAA/compliance ready

---

## 📞 GETTING HELP

### Quick Reference:
- 📖 **User Guide**: `XRAY_FORM_GUIDE.md`
- 🔧 **Tech Details**: `CHANGELOG_XRAY.md`
- 💻 **Code Examples**: `XRAY_SAVE_EXAMPLES.md`
- ✅ **Testing**: `XRAY_TEST_CASES.md`
- 📋 **This File**: `QUICK_REFERENCE.md`

### Contact:
- **Hospital IT**: For access/account issues
- **System Admin**: For database/backup questions
- **Developer**: For technical/custom features

---

## ⏱️ AVERAGE TIME REQUIREMENTS

| Action | Time | Notes |
|--------|------|-------|
| Fill form (using template) | 2-3 min | Fastest path |
| Fill form (manual entry) | 5-10 min | Depends on detail |
| Save X-ray result | 10 sec | After filling |
| Print report | 1 min | Print dialog |
| View patient history | 30 sec | Via Patient List |
| Find specific X-ray | 1-2 min | Via Patient List |

---

## ✨ VERSION & UPDATES

**Current Version**: 1.3.0
**Release Date**: 2024
**Status**: ✅ Production Ready

**Latest Features**:
- ✅ Add new indication/result fields
- ✅ "Other/Khác" custom case option
- ✅ Save to database (localStorage)
- ✅ Patient record linking
- ✅ Enhanced printing

**Next Update**: v1.4.0
- [ ] Template creation from saved data
- [ ] X-ray history viewer
- [ ] Advanced search

---

**Last Updated**: 2024
**Maintained By**: Hospital IT Team
**Support Contact**: [Hospital Email/Phone]

---

> **💡 Tip**: Bookmark this page for quick reference!
> **🔖 Shortcut**: Print this page and post near workstation
