// ============================================================
// X-RAY FORM - TEST CASES & VALIDATION
// ============================================================

/**
 * File: XRAY_TEST_CASES.md
 * Purpose: Document test cases for X-ray form functionality
 * Testing Level: Unit, Integration, and User Acceptance Tests
 */

# Test Cases for X-Ray Form

## ✅ Test Suite 1: BASIC FORM FUNCTIONALITY

### Test 1.1: Form Initialization
**Objective**: Verify form loads with correct default values
**Steps**:
1. Navigate to X-Ray Form page
2. Observe initial state

**Expected Results**:
- ✓ All sections (1-4) are visible
- ✓ Default indication filled: "Chụp X-quang tim phổi thẳng"
- ✓ New fields (newIndication, newResult) are empty
- ✓ Checkboxes for "Thêm Chỉ Định Mới" and "Khác" are unchecked
- ✓ Patient fields are empty
- ✓ Date field shows today's date

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 1.2: Form Navigation
**Objective**: Verify user can scroll/navigate all 4 parts
**Steps**:
1. Scroll down through entire form
2. Check visibility of each part

**Expected Results**:
- ✓ PHẦN 1 (Indication) visible and accessible
- ✓ PHẦN 2 (Description) visible and accessible
- ✓ PHẦN 3 (Conclusion) visible and accessible
- ✓ PHẦN 4 (Patient Info) visible and accessible
- ✓ Action buttons at bottom (Save, Print, Reset)

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 1.3: Input Field Validation
**Objective**: Verify text inputs accept correct data
**Steps**:
1. Fill in "Chỉ Định Chính" field: "Chụp X-quang cột sống"
2. Fill in "Tên Bệnh Nhân": "Trần Thị B"
3. Fill in "Mã Bảo Hiểm": "BH98765432"
4. Scroll and verify inputs

**Expected Results**:
- ✓ Text appears correctly in all fields
- ✓ Values persist when scrolling
- ✓ No data loss on form navigation
- ✓ Special characters handled properly

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## ✅ Test Suite 2: NEW FEATURES - "THÊM CHỈ ĐỊNH MỰI"

### Test 2.1: Add New Indication - Checkbox Toggle
**Objective**: Verify checkbox toggles textarea visibility
**Steps**:
1. In PHẦN 1, locate "✏️ Thêm Chỉ Định Mới" checkbox
2. Click checkbox (check it)
3. Observe textarea
4. Click checkbox again (uncheck it)

**Expected Results**:
- ✓ When checked: Blue textarea appears below checkbox
- ✓ Textarea has placeholder: "Nhập chỉ định mới để bổ sung..."
- ✓ When unchecked: Textarea disappears
- ✓ Checkbox state toggles correctly
- ✓ Data in textarea is retained when toggling

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 2.2: Add New Indication - Data Entry
**Objective**: Verify new indication data can be entered
**Steps**:
1. Check "✏️ Thêm Chỉ Định Mới"
2. Enter text: "Chụp X-quang với thuốc cản quang iodine"
3. Scroll form and return
4. Check if text persists

**Expected Results**:
- ✓ Text can be typed freely
- ✓ Text appears as entered
- ✓ Text persists when scrolling
- ✓ Form doesn't submit while editing
- ✓ Special characters accepted

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 2.3: Add New Result - Same as Indication
**Objective**: Verify identical functionality for "Thêm Kết Quả Mới"
**Steps**:
1. Scroll to PHẦN 2 (Description)
2. Check "✏️ Thêm Kết Quả Mới"
3. Enter: "Bất thường không xác định ở vùng vùng phổi trái"
4. Verify checkbox toggle and data persistence

**Expected Results**:
- ✓ Same behavior as "Thêm Chỉ Định Mới"
- ✓ Blue textarea appears/disappears correctly
- ✓ Data is retained
- ✓ No conflicts with other form fields

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## ✅ Test Suite 3: "KHÁC" (OTHER) FUNCTIONALITY

### Test 3.1: Other Indication - Checkbox Behavior
**Objective**: Verify "Khác" option in PHẦN 1 works correctly
**Steps**:
1. In PHẦN 1, locate "🔸 Khác" checkbox
2. Click to check it
3. Observe textarea

**Expected Results**:
- ✓ Orange textarea appears with placeholder
- ✓ Placeholder: "Mô tả chi tiết tình trạng khác của bệnh nhân..."
- ✓ Textarea allows free-text entry
- ✓ Unchecking hides textarea

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 3.2: Other Result - Checkbox Behavior
**Objective**: Verify "Khác" option in PHẦN 2 works correctly
**Steps**:
1. In PHẦN 2, locate "🔸 Khác (Kết quả không thuộc...)" checkbox
2. Click to check it
3. Observe orange textarea

**Expected Results**:
- ✓ Orange textarea appears
- ✓ Placeholder: "Mô tả chi tiết kết quả khác của chụp X-quang..."
- ✓ Can enter custom results
- ✓ Data persists when scrolling

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## ✅ Test Suite 4: PATIENT INFORMATION (PHẦN 4)

### Test 4.1: Part 4 Section Visibility
**Objective**: Verify PHẦN 4 displays correctly
**Steps**:
1. Scroll to bottom of form
2. Locate "👤 PHẦN 4: THÔNG TIN BỆNH NHÂN"
3. Check visual styling

**Expected Results**:
- ✓ Section has purple left border
- ✓ Purple header styling applied
- ✓ Three input fields visible:
  - Mã Bảo Hiểm Y Tế
  - Tên Bệnh Nhân
  - ID Bệnh Nhân
- ✓ Section background is light gray (#f5f5f5)

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 4.2: Patient Information Entry
**Objective**: Verify patient data can be entered correctly
**Steps**:
1. Enter Insurance Number: "BH2024001234"
2. Enter Patient Name: "Đặng Văn C"
3. Enter Patient ID: "ID-56789"
4. Scroll and verify persistence

**Expected Results**:
- ✓ All fields accept text input
- ✓ No character restrictions (except as designed)
- ✓ Data appears in fields exactly as typed
- ✓ Data persists when scrolling/navigating
- ✓ Can clear fields without issues

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 4.3: Insurance Number Requirement
**Objective**: Verify insurance number is required for save
**Steps**:
1. Leave Insurance Number empty
2. Try to save (click "💾 Lưu Kết Quả X-Quang")
3. Observe alert message

**Expected Results**:
- ✓ Alert appears: "⚠️ Vui lòng nhập Mã Bảo Hiểm Y Tế..."
- ✓ Form is NOT saved
- ✓ User can dismiss alert and enter insurance number
- ✓ Function returns without processing

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## ✅ Test Suite 5: SAVE FUNCTIONALITY

### Test 5.1: Save with Complete Data
**Objective**: Verify successful save with all required fields
**Steps**:
1. Fill form completely:
   - PHẦN 1: Indication + custom indication
   - PHẦN 2: Description + custom result
   - PHẦN 3: Conclusion + recommendations
   - PHẦN 4: Insurance BH2024002000, Name "Phạm Thị D"
2. Click "💾 Lưu Kết Quả X-Quang"
3. Observe result

**Expected Results**:
- ✓ Success alert appears: "✅ Đã lưu kết quả X-Quang cho bệnh nhân: Phạm Thị D"
- ✓ Alert closes automatically or on click
- ✓ Form remains unchanged (data not cleared)
- ✓ Console shows no errors
- ✓ Data is stored in localStorage

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 5.2: Save with Minimal Data
**Objective**: Verify save works with minimal required fields
**Steps**:
1. Clear most fields
2. Enter only:
   - Insurance Number: "BH2024002000"
   - Patient Name: "Test Patient"
3. Click save

**Expected Results**:
- ✓ Save succeeds even with minimal data
- ✓ Success alert appears
- ✓ Empty fields are saved as empty strings
- ✓ No validation errors for optional fields

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 5.3: Error Handling - Missing Insurance
**Objective**: Verify proper error message
**Steps**:
1. Fill form with good data
2. Delete/clear Insurance Number
3. Try to save

**Expected Results**:
- ✓ Warning alert appears
- ✓ Message is clear: "⚠️ Vui lòng nhập Mã Bảo Hiểm Y Tế..."
- ✓ Save operation is aborted
- ✓ No data is saved to localStorage

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 5.4: localStorage Verification
**Objective**: Verify data is actually stored in localStorage
**Steps**:
1. Open browser DevTools (F12)
2. Go to "Application" → "Local Storage"
3. Find the key: `xray_BH2024002000` (or your insurance number)
4. Expand the key and view value

**Expected Results**:
- ✓ Key exists with format: `xray_{insuranceNumber}`
- ✓ Value is a JSON array of X-ray records
- ✓ Latest record contains:
  - id field with unique timestamp
  - insuranceNumber matching form entry
  - patientName, examinationDate, description, conclusion
  - timestamp in createdAt field
  - useOtherIndication, useOtherResult flags

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## ✅ Test Suite 6: PATIENT RECORD UPDATE

### Test 6.1: Patient List Integration
**Objective**: Verify X-ray status updates in patient list
**Steps**:
1. Save X-ray for patient with BH: "BH2024002000"
2. Navigate to "Danh Sách Bệnh Nhân" (Patient List)
3. Click on insurance number "BH2024002000"
4. Modal opens showing patient details

**Expected Results**:
- ✓ Patient modal loads
- ✓ X-Quang row shows: "✓ Completed" (green checkmark)
- ✓ Progress bar updated to include X-Quang
- ✓ Exam count increased (e.g., 5/10 → 6/10)

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 6.2: allPatients Update
**Objective**: Verify allPatients record is updated
**Steps**:
1. Open DevTools → Application → Local Storage
2. Find key: "allPatients"
3. Search for patient with matching insurance
4. Check xrayTest property

**Expected Results**:
- ✓ Patient found in allPatients array
- ✓ xrayTest.status = "completed"
- ✓ xrayTest.date matches examination date
- ✓ xrayTest.result contains full X-ray object
- ✓ lastModified timestamp is recent

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## ✅ Test Suite 7: TEMPLATE FUNCTIONALITY

### Test 7.1: Template Selection
**Objective**: Verify template dropdown and selection
**Steps**:
1. At top of form, click "Loại X-Quang" dropdown
2. Select "Chest"
3. Click "Template" dropdown
4. Observe available templates

**Expected Results**:
- ✓ Chest category shows available templates
- ✓ Each template has title displayed
- ✓ Templates are listed correctly
- ✓ Can select any template from list

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 7.2: Template Application
**Objective**: Verify template auto-fills form
**Steps**:
1. Select X-Ray Type: "Abdomen"
2. Select Template: "Abdomen - Chụp thẳng"
3. Click "✓ Áp Dụng Template"
4. Scroll to PHẦN 2

**Expected Results**:
- ✓ Description field auto-filled with template description
- ✓ Conclusion field auto-filled with template conclusion
- ✓ Custom indication updated to X-ray type name
- ✓ Selected template shown in form

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## ✅ Test Suite 8: PRINT FUNCTIONALITY

### Test 8.1: Print Button
**Objective**: Verify print output includes new data
**Steps**:
1. Fill form with:
   - Indication: "Chụp X-quang thái dương"
   - Patient Name: "Hoàng Văn E"
   - Insurance: "BH2024003000"
2. Click "🖨️ In Biên Bản"
3. Observe print preview

**Expected Results**:
- ✓ Print window opens
- ✓ Header shows "BIÊN BẢN KẾT QUẢ CHỤP X-QUANG"
- ✓ Patient info shown:
  - Bệnh nhân: Hoàng Văn E
  - Mã bảo hiểm: BH2024003000
- ✓ All form sections visible
- ✓ Can print to printer or save as PDF

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 8.2: Print with Custom Data
**Objective**: Verify custom indication/result appears in print
**Steps**:
1. Check "✏️ Thêm Chỉ Định Mới"
2. Enter: "Chụp X-quang kiểm tra bất thường lạ"
3. Fill other required fields
4. Click "🖨️ In Biên Bản"
5. Check if custom data appears

**Expected Results**:
- ✓ Print preview shows custom data
- ✓ Custom indication appears in output
- ✓ All new fields included in print
- ✓ Print format is professional and readable

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## ✅ Test Suite 9: RESET FUNCTIONALITY

### Test 9.1: Reset Button
**Objective**: Verify reset clears all form data
**Steps**:
1. Fill entire form with test data
2. Click "↻ Reset" button
3. Observe form state

**Expected Results**:
- ✓ All text fields cleared
- ✓ All checkboxes unchecked
- ✓ Dropdown selections reset
- ✓ Date reset to today
- ✓ Custom indication reset to default
- ✓ New fields reset to empty/false
- ✓ Patient info fields cleared

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## ✅ Test Suite 10: EDGE CASES & ERROR HANDLING

### Test 10.1: Special Characters in Text
**Objective**: Verify form handles special characters
**Steps**:
1. Enter in various fields:
   - "Chụp X-quang: Đặc biệt (😊)"
   - "BH-2024/001*special"
   - "Nguyễn Văn Á (Người dân)"
2. Try to save

**Expected Results**:
- ✓ Special characters accepted
- ✓ No data corruption
- ✓ Save succeeds
- ✓ Data stored correctly with special characters

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 10.2: Very Long Text
**Objective**: Verify form handles long text input
**Steps**:
1. Enter 500+ character text in Description field
2. Try to save
3. Verify in localStorage

**Expected Results**:
- ✓ Long text accepted without truncation
- ✓ Form doesn't break or lag
- ✓ Save completes successfully
- ✓ Full text stored in localStorage

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 10.3: Rapid Clicking Save Button
**Objective**: Verify no duplicate records created
**Steps**:
1. Fill form completely
2. Click "💾 Save" button 3 times rapidly
3. Check localStorage

**Expected Results**:
- ✓ Multiple alerts appear (one per click)
- ✓ Each save creates separate record with unique ID
- ✓ Records have different timestamps
- ✓ No data loss or corruption

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 10.4: Network/Storage Failure
**Objective**: Verify error handling for storage issues
**Steps**:
1. (Advanced) Mock localStorage failure in DevTools
2. Try to save form
3. Observe error message

**Expected Results**:
- ✓ Error alert appears: "❌ Lỗi khi lưu dữ liệu..."
- ✓ User-friendly error message shown
- ✓ Form not cleared (data retained for retry)
- ✓ Function handles exception gracefully

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## ✅ Test Suite 11: BROWSER COMPATIBILITY

### Test 11.1: Chrome
**Steps**: Run all tests in Chrome (latest version)
**Expected**: All tests pass

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 11.2: Firefox
**Steps**: Run all tests in Firefox (latest version)
**Expected**: All tests pass

**Pass/Fail**: [  ] Pass  [  ] Fail

---

### Test 11.3: Edge
**Steps**: Run all tests in Edge (latest version)
**Expected**: All tests pass

**Pass/Fail**: [  ] Pass  [  ] Fail

---

## 📊 TEST SUMMARY

| Suite | Test Cases | Passed | Failed | Notes |
|-------|-----------|--------|--------|-------|
| 1. Basic Form | 3 | [ ] | [ ] | |
| 2. Add New | 3 | [ ] | [ ] | |
| 3. Other Option | 2 | [ ] | [ ] | |
| 4. Patient Info | 3 | [ ] | [ ] | |
| 5. Save Function | 4 | [ ] | [ ] | |
| 6. Patient Update | 2 | [ ] | [ ] | |
| 7. Template | 2 | [ ] | [ ] | |
| 8. Print | 2 | [ ] | [ ] | |
| 9. Reset | 1 | [ ] | [ ] | |
| 10. Edge Cases | 4 | [ ] | [ ] | |
| 11. Compatibility | 3 | [ ] | [ ] | |
| **TOTAL** | **34** | [ ] | [ ] | |

---

## 📋 TEST EXECUTION CHECKLIST

- [ ] All test suites executed
- [ ] All pass/fail results recorded
- [ ] Screenshots taken for failures
- [ ] Browser console checked for errors
- [ ] localStorage verified for data persistence
- [ ] Patient list integration confirmed
- [ ] Print output verified
- [ ] Edge cases handled correctly
- [ ] Performance acceptable (no lag/slowness)
- [ ] Documentation updated for any issues

---

**Test Date**: _______________
**Tester Name**: _______________
**Test Environment**: Chrome / Firefox / Edge
**Overall Result**: [  ] PASS  [  ] FAIL

**Notes/Issues Found**:
_________________________________
_________________________________
_________________________________
