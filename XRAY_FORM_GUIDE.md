# 📋 Hướng Dẫn Sử Dụng Form X-Quang

## 📊 Tổng Quan
Form X-Quang là một hệ thống quản lý kết quả chụp X-Quang hoàn chỉnh với khả năng:
- ✅ Nhập chỉ định chụp (Indication/Y-order)
- ✅ Mô tả chi tiết kết quả (Description)
- ✅ Ghi nhận kết luận và khuyến cáo (Conclusion)
- ✅ Sử dụng mẫu (template) có sẵn để tăng tốc độ nhập liệu
- ✅ Thêm chỉ định/kết quả mới cho những lần kiểm tra sau
- ✅ Xử lý các trường hợp "Khác" (custom cases)
- ✅ Lưu dữ liệu vào database liên kết với bệnh nhân

## 🎨 Cấu Trúc Form (4 Phần Chính)

### PHẦN 1: CHỈ ĐỊNH CHỤP X-QUANG (Nhập Kết Y Lệnh)
**Mục đích:** Ghi nhận lý do bệnh nhân cần chụp X-Quang

**Các trường:**
1. **Chỉ Định Chính** - Nhập mô tả ngắn gọn về loại chụp
   - Ví dụ: "Chụp X-quang tim phổi thẳng"
   
2. **Chỉ Định Khác (Đánh Dấu Nếu Có)** - Chọn các tùy chọn có sẵn
   - Ví dụ: Chụp đặc biệt, Chụp sau điều trị, v.v.

3. **Chỉ Định Bổ Sung** - Thêm thông tin chi tiết tự do
   - Mô tả thêm các triệu chứng hoặc yêu cầu đặc biệt

4. **✏️ Thêm Chỉ Định Mới** (mới)
   - ✔️ Bật để nhập chỉ định chưa có trong dữ liệu có sẵn
   - Dữ liệu sẽ được lưu để bổ sung cho những lần kiểm tra tiếp theo

5. **🔸 Khác (Bệnh nhân không thuộc các trường hợp trên)** (mới)
   - ✔️ Bật khi bệnh nhân có tình trạng đặc biệt khác
   - Mô tả chi tiết tình trạng của bệnh nhân

---

### PHẦN 2: MÔ TẢ KẾT QUẢ CHỤP
**Mục đích:** Ghi nhận những gì tìm thấy trong chụp X-Quang

**Các trường:**
1. **Mô Tả Chi Tiết Kết Quả** - Nội dung chính
   - Sử dụng template để tự động điền hoặc nhập tự do
   - Có thể chọn từ danh sách kết quả có sẵn

2. **Kết Quả Tiêu Chuẩn (Đánh Dấu Nếu Có)** - Chọn các kết quả phổ biến
   - Ví dụ: Bình thường, Bất thường, Cần kiểm tra thêm, v.v.

3. **Kết Quả Bổ Sung** - Thêm thông tin chi tiết tự do

4. **✏️ Thêm Kết Quả Mới** (mới)
   - ✔️ Bật để nhập kết quả chưa có trong dữ liệu có sẵn
   - Dữ liệu sẽ được lưu để bổ sung cho những lần kiểm tra tiếp theo

5. **🔸 Khác (Kết quả không thuộc các trường hợp trên)** (mới)
   - ✔️ Bật khi có kết quả không phù hợp với các mẫu có sẵn
   - Mô tả chi tiết kết quả khác

---

### PHẦN 3: KẾT LUẬN VÀ KHUYẾN CÁO
**Mục đích:** Ghi nhận chẩn đoán chính thức và hướng dẫn tiếp theo

**Các trường:**
1. **Kết Luận Chẩn Đoán** - Chẩn đoán cuối cùng dựa trên X-Quang
2. **Khuyến Cáo** - Các khuyến cáo cho bệnh nhân hoặc bác sĩ điều trị
3. **Hướng Dẫn** - Hướng dẫn tFollowup hoặc thăm dò thêm
4. **Xác Nhận/Ký Duyệt** - Thông tin kỹ thuật viên, bác sĩ chuyên khoa

---

### PHẦN 4: THÔNG TIN BỆNH NHÂN (ĐỂ LƯU KẾT QUẢ)
**Mục đích:** Liên kết dữ liệu X-Quang với bệnh nhân cụ thể

**Các trường (Bắt Buộc):**
1. **Mã Bảo Hiểm Y Tế** ⭐ (BẮT BUỘC)
   - Dùng để liên kết X-Quang với hồ sơ bệnh nhân
   - Định dạng: Số bảo hiểm chính thức của bệnh nhân

2. **Tên Bệnh Nhân** (Tùy chọn nhưng nên nhập)
   - Tên đầy đủ của bệnh nhân

3. **ID Bệnh Nhân** (Tùy chọn)
   - ID nội bộ hoặc số ID khác nếu có

---

## 🚀 Cách Sử Dụng Từng Bước

### Cách 1: Sử Dụng Template (Nhanh Nhất)
```
1. Chọn Loại X-Quang từ dropdown (Abdomen, Chest, Spine, v.v.)
2. Chọn Template phù hợp từ dropdown thứ hai
3. Bấm nút "✓ Áp Dụng Template"
   ➜ Mô Tả và Kết Luận sẽ tự điền
4. Điều chỉnh nếu cần (chỉ định, kết quả bổ sung, v.v.)
5. Nhập thông tin bệnh nhân (Phần 4)
6. Bấm "💾 Lưu Kết Quả X-Quang"
```

### Cách 2: Nhập Thủ Công (Chi Tiết Nhất)
```
1. Nhập Chỉ Định Chính (Phần 1)
2. Đánh dấu các Chỉ Định Khác nếu có
3. Thêm Chỉ Định Bổ Sung nếu cần
4. Nhập Mô Tả Chi Tiết (Phần 2)
5. Đánh dấu các Kết Quả Tiêu Chuẩn
6. Thêm Kết Quả Bổ Sung nếu cần
7. Nhập Kết Luận (Phần 3)
8. Thêm Khuyến Cáo/Hướng Dẫn
9. Nhập thông tin bệnh nhân (Phần 4)
10. Bấm "💾 Lưu Kết Quả X-Quang"
```

### Cách 3: Thêm Dữ Liệu Mới
```
Nếu chỉ định/kết quả không có trong danh sách:

1. Nhập như bình thường
2. Bật ✔️ "Thêm Chỉ Định Mới" (Phần 1) hoặc 
         "Thêm Kết Quả Mới" (Phần 2)
3. Nhập dữ liệu mới vào textarea hiển thị
4. Lưu kết quả - dữ liệu mới sẽ được lưu

Lần sau, dữ liệu này sẽ xuất hiện trong dropdown
và có thể tạo template mới từ nó
```

### Cách 4: Xử Lý Trường Hợp "Khác"
```
Khi bệnh nhân không thuộc các trường hợp chuẩn:

1. Bật ✔️ "Khác" ở Phần 1 hoặc Phần 2
2. Mô tả chi tiết tình trạng/kết quả khác
3. Nhập thông tin bệnh nhân
4. Lưu kết quả - sẽ được đánh dấu là "khác"
```

---

## 💾 Tính Năng Lưu Dữ Liệu

### Nút "💾 Lưu Kết Quả X-Quang"
- **Chức năng:** Lưu toàn bộ dữ liệu X-Quang vào database
- **Yêu cầu:** Phải nhập **Mã Bảo Hiểm Y Tế** (Phần 4)
- **Nơi lưu:** 
  - localStorage (tạm thời)
  - Sẽ tích hợp với database chính
- **Liên kết:** Dữ liệu sẽ liên kết với hồ sơ bệnh nhân theo mã bảo hiểm

### Dữ Liệu Được Lưu:
✅ Tất cả thông tin nhập vào (chỉ định, mô tả, kết luận, v.v.)
✅ Loại X-Quang và template được sử dụng
✅ Thời gian lưu (tự động)
✅ Thông tin bệnh nhân (tên, mã bảo hiểm, ID)

### Sau Khi Lưu:
✅ Sẽ có thông báo xác nhận
✅ Dữ liệu được cập nhật trong hồ sơ bệnh nhân
✅ Có thể in biên bản (nút "🖨️ In Biên Bản")
✅ Có thể xem lại trong lịch sử khám

---

## 🖨️ Tính Năng In Biên Bản

**Nút "🖨️ In Biên Bản"** 
- In toàn bộ kết quả X-Quang thành một tài liệu
- Gồm tất cả 4 phần: Chỉ định, Mô tả, Kết luận, Thông tin bệnh nhân
- Có thể lưu thành PDF hoặc in ra giấy
- Phù hợp để gửi cho bệnh nhân hoặc bác sĩ khác

---

## 📊 Tích Hợp Với Bệnh Nhân

### Liên Kết Tự Động:
1. Nhập **Mã Bảo Hiểm Y Tế** ở Phần 4
2. Bấm "💾 Lưu Kết Quả X-Quang"
3. System sẽ:
   - Tìm bệnh nhân theo mã bảo hiểm
   - Cập nhật trạng thái X-Quang thành "✓ Completed"
   - Lưu dữ liệu X-Quang vào hồ sơ bệnh nhân
   - Cập nhật ngày kiểm tra

### Xem Lịch Sử:
- Vào **Patient List** → Chọn bệnh nhân → Xem modal chi tiết
- Sẽ thấy X-Quang được đánh dấu ✓ (hoàn thành)
- Có thể xem chi tiết từng lần chụp

---

## ⚙️ Cấu Hình Mẫu (Template)

### Vị trí File:
`src/data/xrayTemplates.json`

### Cấu Trúc:
```json
{
  "xrayTemplates": [
    {
      "id": "abdomen",
      "name": "Abdomen (Ổ Bụng)",
      "templates": [
        {
          "id": "abd_001",
          "title": "Abdomen - Chụp thẳng",
          "description": "Ổ bụng thẳng, không có dấu hiệu...",
          "conclusion": "Không phát hiện bất thường..."
        }
      ]
    }
  ]
}
```

### Thêm Template Mới:
1. Mở file `xrayTemplates.json`
2. Tìm danh mục phù hợp (hoặc tạo danh mục mới)
3. Thêm object template với `id`, `title`, `description`, `conclusion`
4. Reload ứng dụng

---

## 🔍 Mẹo & Thủ Thuật

### Tiết Kiệm Thời Gian:
- ✨ Dùng Template cho những ca phổ biến
- 🏷️ Thêm Chỉ Định/Kết Quả Mới để xây dựng thư viện
- 📋 Copy-paste từ những ca tương tự

### Đảm Bảo Chất Lượng:
- ✔️ Luôn kiểm tra lại thông tin bệnh nhân
- ✔️ Nhập Mã Bảo Hiểm chính xác (quan trọng!)
- ✔️ Thêm Khuyến Cáo rõ ràng cho bệnh nhân
- ✔️ In biên bản để có bản lưu trữ

### Xử Lý Lỗi:
- ⚠️ Nếu không thể lưu: Kiểm tra mã bảo hiểm
- ⚠️ Nếu mất dữ liệu: Nhập lại form (chưa có auto-save)
- ⚠️ Nếu không tìm thấy bệnh nhân: Hãy kiểm tra danh sách bệnh nhân trước

---

## 📱 Hỗ Trợ & Phản Hồi

Nếu gặp vấn đề hoặc có gợi ý:
- Liên hệ nhóm IT: [Email/Phone]
- Báo cáo lỗi kèm theo thông tin bệnh nhân (ẩn danh)
- Đề xuất template mới cho những ca đặc biệt

---

**Phiên Bản:** 1.0
**Cập Nhật Lần Cuối:** 2024
**Hỗ Trợ:** Bệnh viện [Tên BV]
