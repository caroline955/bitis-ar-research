/* =============================================================
  BẢNG HỎI / QUESTIONNAIRE
  - Chỉ sửa file này khi nhóm đã chốt thang đo.
  - Các câu hỏi dưới đây CHỈ LÀ DEMO UI, không phải thang đo nghiên cứu.
  - Xoá toàn bộ questions để ẩn form nếu chưa muốn khảo sát.
  - type: 'likert' | 'single' | 'text'
  - Có thể bổ sung trường age, gender... như các question bình thường.
============================================================= */
window.QUESTIONNAIRE = {
  version: 'DEMO-01',
  isDemo: true,
  questions: [
    {
      id: 'DEMO_CE1',
      type: 'likert',
      required: true,
      vi: 'Cách giới thiệu sản phẩm này thu hút sự chú ý của tôi.',
      en: 'This product presentation captured my attention.'
    },
    {
      id: 'DEMO_INFO1',
      type: 'likert',
      required: true,
      vi: 'Trải nghiệm này giúp tôi hiểu rõ hơn về sản phẩm.',
      en: 'This experience helped me better understand the product.'
    },
    {
      id: 'DEMO_INTENT1',
      type: 'likert',
      required: true,
      vi: 'Tôi muốn tìm hiểu thêm về những lựa chọn sản phẩm bền vững.',
      en: 'I would like to learn more about sustainable product options.'
    }
  ]
};
