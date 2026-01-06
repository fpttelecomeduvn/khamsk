# Hướng Dẫn Sử Dụng Mẫu X-Quang Chuẩn

## 📋 Giới Thiệu
Tính năng **Mẫu X-Quang Chuẩn** cho phép nhập viên chọn các mẫu kết quả X-quang tiêu chuẩn từ cơ sở dữ liệu, giúp đẩy nhanh quá trình nhập liệu và đảm bảo tính chính xác.

## 🎯 Các Loại X-Quang Hỗ Trợ

### 1. **Lồng Ngực** (Chest)
- Xquang Tim Phổi Thẳng (5 mẫu)
  - Bình thường
  - Tăng Huyết Áp
  - Viêm Phế Quản Phổi
  - Diện Tim To
  - Phổi Dày Tổ Chức Kẽ

### 2. **Ổ Bụng** (Abdomen)
- Xquang Ổ Bụng Không Chuẩn Bị
  - OBBT - Bình thường
  - OB Nghiêng - Bình thường

### 3. **Hệ Tiết Niệu** (Urinary System)
- Xquang Hệ Tiết Niệu Không Chuẩn Bị
  - Có Sonde JJ
  - Không Thấy Sỏi

### 4. **Cột Sống** (Spine)
- Xquang Cột Sống Cổ Thẳng - Nghiêng
  - Bình thường
  - Thoái hóa
  
- Xquang Cột Sống Thắt Lưng
  - Bình thường
  - Thoái hóa

### 5. **Khớp Chi** (Joint)
- Xquang Khớp Vai Thẳng
- Xquang Khớp Khuỷu Tay Thẳng - Nghiêng
- Xquang Khớp Cổ Tay
- Xquang Khớp Gối (Bình thường, Thoái hóa)
- Xquang Khớp Cổ Chân Thẳng - Nghiêng

### 6. **Vùng Đầu** (Head)
- Xquang Xoang - Blondeaux & Hirtz
- Xquang Xương Mặt Thẳng
- Xquang Xương Hộp Sọ Thẳng - Nghiêng

### 7. **Khung Chậu** (Pelvis)
- Xquang Khung Chậu Thẳng

### 8. **Đường Mật** (Biliary)
- Xquang Đường Mật - Kehr

### 9. **Xương Chi** (Limbs)
- Xquang Xương Chi - Xương Dài

### 10. **Tuyến Vú** (Breast)
- Xquang Tuyến Vú Hai Bên
- Xquang Tuyến Vú Phải
- Xquang Tuyến Vú Trái

## 📖 Hướng Dẫn Sử Dụng

### Bước 1: Mở Form X-Quang
Nhấn vào **"Chụp X-Quang"** trên menu khám hoặc từ trang XrayFormPage

### Bước 2: Chọn Loại X-Quang
1. Tìm phần **"🔍 Chọn Mẫu X-Quang Chuẩn"**
2. Click vào dropdown **"Loại X-Quang"**
3. Chọn loại X-quang muốn chụp
   - Ví dụ: "Xquang Tim Phổi Thẳng"

### Bước 3: Chọn Mẫu Kết Quả
1. Sau khi chọn loại X-quang, dropdown **"Chọn Mẫu Kết Quả"** sẽ hiển thị
2. Chọn mẫu kết quả phù hợp
   - Ví dụ: "Bình thường" hoặc "Tăng Huyết Áp"
3. Hệ thống sẽ hiển thị **Preview** kết quả

### Bước 4: Xem Trước Và Áp Dụng
1. Xem preview:
   - **📋 Mô Tả**: Các triệu chứng/hình ảnh tìm thấy
   - **✓ Kết Luận**: Kết luận chẩn đoán
2. Nếu phù hợp, nhấp **"✓ Áp dụng mẫu này"**
3. Mẫu sẽ được tự động điền vào:
   - **PHẦN 2: Mô Tả Kết Quả Chụp**
   - **PHẦN 3: Kết Luận**

### Bước 5: Hoàn Thiện Thông Tin
1. Điều chỉnh **Chỉ Định** (PHẦN 1) nếu cần
2. Thêm **Khuyến Cáo** hoặc **Lời Dặn** (PHẦN 3) nếu cần
3. Nhập **Thông Tin Người Thực Hiện**:
   - Kỹ Thuật Viên
   - Bác Sĩ Chuẩn Đoán
   - Chữ ký

### Bước 6: In Hoặc Lưu
1. Nhấn **"🖨️ In Biên Bản"** để in kết quả
2. Hoặc **"↻ Reset"** để bắt đầu lại

## 💡 Mẹo Sử Dụng

✅ **Chỉnh Sửa Sau Khi Áp Dụng**
- Bạn vẫn có thể chỉnh sửa bất kỳ phần nào sau khi áp dụng mẫu
- Mẫu chỉ là tham khảo, có thể tùy chỉnh theo từng bệnh nhân

✅ **Tìm Mẫu Phù Hợp**
- Nếu không tìm thấy mẫu chính xác, chọn mẫu gần nhất rồi chỉnh sửa

✅ **Lưu Dữ Liệu**
- Nhấn nút **"💾 Lưu Kết Quả"** để lưu vào database

## 📊 Cấu Trúc Dữ Liệu

```json
{
  "xrayTemplates": [
    {
      "id": "chest_xray",
      "name": "Xquang Tim Phổi Thẳng",
      "category": "Lồng Ngực",
      "templates": [
        {
          "id": "chest_1",
          "title": "Bình Thường",
          "description": "...",
          "conclusion": "..."
        }
      ]
    }
  ]
}
```

## ⚠️ Lưu Ý Quan Trọng

1. **Kiểm Tra Chính Xác**: Luôn kiểm tra mẫu trước khi áp dụng
2. **Cập Nhật Khuyến Cáo**: Thêm khuyến cáo điều trị nếu cần
3. **Lưu Dữ Liệu**: Nhớ lưu kết quả trước khi thoát

## 🔧 Quản Lý Mẫu

Tất cả mẫu X-quang được lưu trong file `src/data/xrayTemplates.json`

Để thêm mẫu mới:
1. Mở file `xrayTemplates.json`
2. Thêm template vào mảng tương ứng
3. Format:
```json
{
  "id": "unique_id",
  "title": "Tên Mẫu",
  "description": "Mô tả ...",
  "conclusion": "Kết luận ..."
}
```
