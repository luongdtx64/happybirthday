# Birthday Card

Trang chúc mừng sinh nhật: bánh gato SVG, hoa nở, thổi nến bằng micro, nhạc Happy Birthday (Web Audio API), thư gõ chữ, album polaroid.

## Cấu trúc
- `index.html`  : khung trang
- `css/style.css`: giao diện (trắng và hồng)
- `js/app.js`   : toàn bộ logic

## Chạy thử
Micro chỉ hoạt động trên https hoặc localhost:

    python -m http.server 8000
    # mở http://localhost:8000

## Link riêng
Tên và lời chúc được mã hóa hex sau dấu `#` của URL. Deploy lên GitHub Pages / Netlify / Vercel để gửi link cho bạn bè.

## Ảnh kỷ niệm
Ảnh chọn trong form chỉ hiện trên máy tạo. Để ảnh hiện cho mọi người, thêm ảnh vào thư mục `img/` và khai báo đường dẫn trong mảng `photos` ở `js/app.js`.
