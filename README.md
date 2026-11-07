# Tủ lạnh nhỏ

Ứng dụng quản lý thực phẩm tiếng Việt, ưu tiên điện thoại. Giao diện chat, menu bên trái, phối màu theo từng khu vực.

## Tính năng hiện có

- Thêm thực phẩm bằng tên; số lượng mặc định 1 và lựa chọn ngăn mát/ngăn đông ngay tại ô nhập.
- Ghép icon theo nhóm thực phẩm; mốc nhắc sớm có khoảng thời gian, điều kiện và nguồn công khai trên từng thẻ.
- Sửa tên, số lượng, ngày mua, hạn sử dụng.
- Danh sách sắp đến hạn (trong 3 ngày), quá hạn, đã dùng; tìm kiếm, xóa, hoàn tác đã dùng.
- Đổi tên tủ lạnh bằng nút góc phải.
- Sao lưu/khôi phục JSON, xuất lịch nhắc ICS.
- Firebase Authentication với Google; cần tên miền nằm trong Authorized domains.

## Chạy và triển khai

Đây là website HTML/CSS/JavaScript tĩnh, không cần bước build. Phục vụ thư mục này bằng máy chủ HTTP hoặc GitHub Pages. Không mở trực tiếp bằng `file://` vì đăng nhập Google cần HTTP/HTTPS.

Firebase project: `tu-lanh-nho`. Cấu hình web trong `firebase-config.json` là cấu hình công khai phía trình duyệt, không phải tài khoản dịch vụ. Không thêm khóa riêng, token GitHub hay mật khẩu vào kho này.

## Giới hạn hiện tại

- Mốc tham khảo dựa trên FoodSafety.gov, University of Maryland Extension và Alabama Extension; xem `sources.html`. Đây không phải hạn chính xác của từng món. Ngăn đông nói về chất lượng khi giữ liên tục ≤ −18°C; ngăn mát giả định ≤ 4°C. Ngày trên bao bì và hướng dẫn đúng sản phẩm được ưu tiên.
- Tên quá chung hoặc thiếu hướng dẫn sẽ lưu chưa có mốc, không tự gán một ngày. Mốc tự động cũ có lỗi bị bỏ để người dùng xác nhận lại trong Sửa; hạn tự nhập được giữ. Chưa có AI.
- Dữ liệu lưu bằng localStorage trên từng trình duyệt, tách danh sách theo tài khoản Google. Chưa đồng bộ đám mây; không dùng trên thiết bị chia sẻ để lưu dữ liệu riêng tư.
- Chưa có push notification khi app đóng. File ICS có thể nhập vào ứng dụng lịch; khả năng nhắc phụ thuộc ứng dụng lịch.
- Google đã bật trên Firebase. Cần kiểm tra đăng nhập trọn luồng trên tên miền xuất bản.
- Website đã xuất bản tại https://vanty1xxx-coder.github.io/tu-lanh-nho/ . Đăng nhập Google cần kiểm tra trọn luồng trên thiết bị người dùng.

Tham khảo bảo quản: https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts

