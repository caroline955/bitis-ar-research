# Biti's × AR — Website nghiên cứu truyền thông marketing

Website prototype **1 trang duy nhất**: Xem giày 3D / mở AR trên điện thoại → trả lời bảng hỏi → lưu Google Sheets.

**Không phải website chính thức của Biti's.** Mô hình 3D là phiên bản **lấy cảm hứng từ** Biti's Hunter Matric 10 HSW017500TRG, không phải bản quét 3D chính xác của hãng. Mô tả vật liệu là quan sát thiết kế từ ảnh tham chiếu, không phải công bố thành phần vật liệu đã xác minh.

## 1. Các file

- `index.html` — website chính, **CSS được nhúng sẵn**; có logic AR và Google Sheets.
- `matric10-inspired.glb` — mô hình giày 3D minh họa, dài khoảng 27,3 cm trong thế giới AR.
- `shoe-cutout.png` — ảnh sản phẩm từ ảnh tham chiếu người dùng cung cấp, để dự phòng lúc 3D chưa tải.
- `product-reference.jpg` — ảnh sản phẩm tham chiếu.
- `questionnaire.js` — **CHỈNH BẢNG HỎI TẠI ĐÂY**.
- `apps-script.gs` — mã Google Apps Script nhận câu trả lời và ghi vào Google Sheets.
- `preview-desktop.png`, `preview-mobile.png` — ảnh xem trước giao diện (không phải ảnh chứng minh AR hoạt động).

## 2. Chạy xem giao diện

Có thể mở `index.html` bằng Chrome/Edge để xem bố cục; một số trình duyệt sẽ chặn model `.glb` khi chạy trực tiếp từ `file://`.

Để chạy ổn định trên máy tính:

```bash
cd bitis-ar-research-final
python -m http.server 8000
```

Mở `http://localhost:8000` (cần Internet để tải thư viện `<model-viewer>` từ CDN).

**AR thật**: triển khai website lên HTTPS bằng Netlify / Vercel / GitHub Pages, mở bằng điện thoại có ARCore/Scene Viewer hoặc iOS AR Quick Look tương thích, sau đó nhấn **Đặt giày vào không gian thật**. Laptop chỉ xem được mô hình 3D, không thể tự xuất hiện camera AR điện thoại.

Không thể bảo đảm mọi máy đều hỗ trợ AR; kiểm thử trực tiếp trên điện thoại trước khi khảo sát thật.

## 3. Lưu kết quả về Google Sheets (cần m thực hiện 1 lần)

**Bước 1.** Tạo một Google Sheet mới và đặt tên tùy ý, ví dụ `Biti's AR - Survey Responses`.

**Bước 2.** Trong Google Sheet, chọn **Extensions → Apps Script**. Xóa code mặc định, dán toàn bộ nội dung file `apps-script.gs`, sau đó bấm **Save**.

**Bước 3.** Trong Apps Script, chọn **Deploy → New deployment → Select type: Web app**.

- **Execute as:** Me (tài khoản sở hữu Google Sheet).
- **Who has access:** Anyone (để người trả lời không cần đăng nhập Google).
- Cấp quyền theo màn hình Google và sao chép **Web app URL** kết thúc bằng `/exec`.

**Bước 4.** Mở `index.html`, tìm dòng:

```js
const APPS_SCRIPT_URL = '';
```

Dán URL của m vào giữa hai dấu nháy:

```js
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXX/exec';
```

**Bước 5.** Upload lại website lên HTTPS, thử trả lời bảng hỏi một lần, rồi mở Google Sheet để xác minh có tab `Responses` và một dòng mới. Tên cột sẽ tự mở rộng theo các mã câu hỏi.

> Khi `APPS_SCRIPT_URL` còn trống, website chỉ **lưu dữ liệu thử nghiệm trong localStorage của trình duyệt**, **không tự gửi về Sheets**. Có thể chọn **Dữ liệu thử nghiệm → Xuất CSV** ở cuối trang để lấy bản sao. Khi đã cấu hình endpoint, website gửi form sang Apps Script và kiểm tra phản hồi xác nhận từ Sheet. Không nên coi việc nhấn nút gửi là bằng chứng dữ liệu đã lưu nếu chưa thấy phản hồi thành công.

### Lưu ý về an toàn dữ liệu

Web app triển khai công khai có thể nhận các request ngoài ý muốn; chỉ thu thập dữ liệu cần thiết cho nghiên cứu, không yêu cầu thông tin nhạy cảm, và giới hạn quyền xem/sửa Google Sheet cho nhóm. Mẫu hiện chỉ ghi mã người tham gia ẩn danh, thời điểm gửi, ngôn ngữ, thao tác AR và câu trả lời. Khi triển khai khảo sát chính thức, cần hoàn thiện thông báo nghiên cứu, đồng ý tham gia và chính sách lưu giữ dữ liệu.

## 4. Thay bảng hỏi khi nhóm chốt thang đo

Chỉ sửa file `questionnaire.js`. Các câu hỏi hiện tại là **demo để kiểm thử chức năng**, chưa phải thang đo đã kiểm định.

Ví dụ:

```js
window.QUESTIONNAIRE = {
  version: 'OFFICIAL-01',
  isDemo: false,
  questions: [
    {
      id: 'CE1',
      type: 'likert',
      required: true,
      vi: 'Nội dung câu hỏi tiếng Việt.',
      en: 'English question text.'
    },
    {
      id: 'AGE',
      type: 'single',
      required: true,
      vi: 'Nhóm tuổi của bạn?',
      en: 'Your age group?',
      options: [
        {value:'18-24', vi:'18–24 tuổi', en:'18–24 years'},
        {value:'25-34', vi:'25–34 tuổi', en:'25–34 years'}
      ]
    },
    {
      id: 'COMMENT',
      type: 'text',
      required: false,
      vi: 'Ý kiến khác (không bắt buộc)',
      en: 'Additional comments (optional)'
    }
  ]
};
```

Mỗi câu trả lời lưu vào một cột có tên đúng mã `id` (`CE1`, `AGE`...) trong Google Sheet. Nếu để `questions: []`, biểu mẫu sẽ ẩn và chỉ hiển thị lời nhắc cho nhóm.

## 5. Cần làm trước khi thu dữ liệu NCKH thật

- Thay bộ câu hỏi demo bằng các thang đo phù hợp với giả thuyết nghiên cứu; cân nhắc kiểm tra độ tin cậy, tính hợp lệ sau pilot.
- Xác minh thông tin vật liệu Biti's theo đúng mã sản phẩm hoặc xóa các khẳng định không có bằng chứng.
- Kiểm thử AR trên Android và iPhone thật, đặc biệt iOS cần hỗ trợ AR Quick Look.
- Kiểm thử chính sách riêng tư và sự đồng ý tham gia khảo sát.
- Nếu nghiên cứu cần đo **tác động riêng của AR** thay vì cảm nhận về website, thiết kế nghiên cứu phải kiểm soát được đối tượng thực sự dùng AR; việc nhấn nút AR không tự chứng minh đã xem AR.

