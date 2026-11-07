# Tủ lạnh nhỏ

Ứng dụng quản lý thực phẩm tiếng Việt, ưu tiên điện thoại. Giao diện chat, menu bên trái, phối màu theo từng khu vực.

## Tính năng hiện có

- Thêm thực phẩm bằng tên; số lượng mặc định 1 và lựa chọn ngăn mát/ngăn đông ngay tại ô nhập.
- Ghép icon theo nhóm thực phẩm; mốc nhắc sớm có khoảng thời gian, điều kiện và nguồn công khai trên từng thẻ.
- Sửa tên, số lượng, ngày mua, hạn sử dụng.
- Danh sách sắp đến hạn (trong 3 ngày), quá hạn, đã dùng; tìm kiếm, xóa, hoàn tác đã dùng.
- Đổi tên tủ lạnh bằng nút góc phải.
- Sao lưu/khôi phục JSON, xuất lịch nhắc ICS.
- Bắt buộc đăng nhập Google qua Firebase Authentication trước khi sử dụng. Không có chế độ khách; lỗi kết nối giữ nguyên màn hình đăng nhập. Tên miền cần nằm trong Authorized domains.

## Chạy và triển khai

Đây là website HTML/CSS/JavaScript tĩnh, không cần bước build. Phục vụ thư mục này bằng máy chủ HTTP hoặc GitHub Pages. Không mở trực tiếp bằng `file://` vì đăng nhập Google cần HTTP/HTTPS.

Firebase project: `tu-lanh-nho`. Cấu hình web trong `firebase-config.json` là cấu hình công khai phía trình duyệt, không phải tài khoản dịch vụ. Không thêm khóa riêng, token GitHub hay mật khẩu vào kho này.

## Giới hạn hiện tại

- Mốc tham khảo dựa trên FoodSafety.gov, University of Maryland Extension và Alabama Extension; xem `sources.html`. Đây không phải hạn chính xác của từng món. Ngăn đông nói về chất lượng khi giữ liên tục ≤ −18°C; ngăn mát giả định ≤ 4°C. Ngày trên bao bì và hướng dẫn đúng sản phẩm được ưu tiên.
- Mọi món có mốc tự động: trung bình làm tròn khi có tài liệu, hoặc lịch kiểm tra mặc định 3 ngày ngăn mát / 1 tháng ngăn đông khi thiếu dữ liệu. Mốc mặc định không phải hạn dùng an toàn. Trứng không phù hợp cấp đông được nhắc kiểm tra ngay. Các mốc tự động cũ được cập nhật, hạn tự nhập được giữ. Chưa có AI.
- Dữ liệu lưu bằng localStorage trên từng trình duyệt, tách danh sách theo tài khoản Google. Chưa đồng bộ đám mây; không dùng trên thiết bị chia sẻ để lưu dữ liệu riêng tư.
- Chưa có push notification khi app đóng. File ICS có thể nhập vào ứng dụng lịch; khả năng nhắc phụ thuộc ứng dụng lịch.
- Google đã bật trên Firebase. Cần kiểm tra đăng nhập trọn luồng trên tên miền xuất bản.
- Website đã xuất bản tại https://vanty1xxx-coder.github.io/tu-lanh-nho/ . Đăng nhập Google cần kiểm tra trọn luồng trên thiết bị người dùng.

Tham khảo bảo quản: https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts


Đăng nhập bắt buộc được thực thi trên giao diện website tĩnh. Mã nguồn công khai; dữ liệu vẫn lưu trên thiết bị theo UID, chưa có cơ sở dữ liệu máy chủ.

## Trừ thực phẩm khi nấu

Nhập `đã nấu 1 cá, 1 cà chua` hoặc `-1 cá, -1 cà chua` tại ô chat. App kiểm tra toàn bộ lệnh trước khi trừ. Món còn dư giảm số lượng; món về 0 chuyển sang Đã dùng. Có nút hoàn tác lần trừ. Nếu nhiều lô cùng món, ưu tiên lô đến mốc trước; tên viết ngắn chỉ được nhận khi khớp một món duy nhất. Không gộp hay tự đổi giữa các đơn vị khác nhau.
# Nhắc hạn và gợi ý món Việt

- Món còn đúng 1 ngày, chưa dùng và số lượng > 0 xuất hiện trong banner và mục **Nhắc trước 1 ngày**. Đăng nhập trước khi đọc dữ liệu.
- Thông báo hệ thống là tùy chọn, chỉ hỏi quyền khi người dùng nhấn bật. Chống lặp theo món/ngày/tài khoản. Chỉ kiểm tra khi app mở; không có backend push khi app đóng. Có thể xuất lịch ICS rồi nhập vào lịch điện thoại.
- **Gợi ý món Việt** ở thanh bên trái chọn tối đa 3 công thức có nguồn trực tiếp từ Món Ngon Mỗi Ngày (Ajinomoto Việt Nam), đối chiếu nguyên liệu còn lại, ưu tiên mốc gần và đa dạng cơm/bún/cháo. Mỗi món có link nguồn, lượng thực tế trong tủ và nguyên liệu còn thiếu. Thư viện được chọn thủ công, không tự bịa công thức hay khẩu phần.
- Không dùng thực phẩm đã dùng, số lượng 0 hoặc quá mốc/hạn để gợi ý. Xem công thức gốc để đối chiếu loại nguyên liệu và định lượng. Xem gợi ý không tự trừ thực phẩm; nhập lệnh đã nấu để ghi lượng thực tế.

