# tcmt-platform

Nền tảng app dùng chung cho Đội Kỹ thuật - Cơ giới (Công ty CP Tân Cảng Miền Trung).

## Cấu trúc

```
/index.html          → Cổng (Portal) - danh sách app
/apps/baoduong/       → Quản lý bảo dưỡng & hư hỏng thiết bị
/apps/sanluong/        → Bảng tổng hợp sản lượng
/apps/nhatky/          → Nhật ký sản xuất
/apps/chamcong/        → Bảng chấm công
/shared/               → Module dùng chung (Firebase, theme, auth) - sẽ thêm ở giai đoạn sau
```

## Triển khai (Cloudflare Pages)

1. Đăng nhập/đăng ký tài khoản tại https://dash.cloudflare.com (miễn phí, không cần thẻ tín dụng).
2. Vào **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Chọn repo GitHub `tcmt-platform` này.
4. Cấu hình build:
   - Framework preset: **None**
   - Build command: (để trống)
   - Build output directory: `/` (thư mục gốc)
5. Bấm **Save and Deploy**. Sau ~1 phút, Cloudflare cấp domain miễn phí dạng
   `tcmt-platform.pages.dev` (hoặc tên khác nếu trùng) — **không cần gia hạn, không hết hạn, không mất phí**, chỉ mất nếu tự xoá project.
6. Từ lần sau, mỗi khi push code mới lên nhánh `main`, Cloudflare tự động build & deploy lại (giống GitHub Pages nhưng nhanh hơn nhờ CDN toàn cầu + tự nén Brotli).

## Giai đoạn tiếp theo (chưa làm trong bản này)

- Thêm `shared/firebase-config.js` + `shared/auth.js` để dùng chung 1 đăng nhập Firebase Authentication
  cho mọi app (cần anh Khoa cung cấp **Web API Key** của Firebase project `tcmt-bao-duong`:
  Firebase Console → ⚙️ Project settings → tab General → mục "Your apps" → SDK config).
- Tách seed data lớn (đặc biệt app sản lượng, hiện ~2.2MB) ra file `.json` riêng, tải khi cần.
- Đồng bộ giao diện (`shared/theme.css`) giữa các app.
