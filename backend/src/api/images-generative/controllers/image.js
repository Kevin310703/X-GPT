const axios = require('axios');

module.exports = {
  async generateImage(ctx) {
    try {
      const { prompt } = ctx.request.body;

      if (!prompt) {
        return ctx.badRequest('Prompt is required');
      }

      const HUGGING_FACE_TOKEN = "<your_huggingface_token>"; // Thay thế bằng token Hugging Face của bạn

      // Gửi yêu cầu tới Hugging Face API
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large',
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
          },
          responseType: 'arraybuffer', // Nhận phản hồi dưới dạng binary
        }
      );

      // Mã hóa hình ảnh binary thành base64
      const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');

      ctx.send({ image: imageBase64 });
    } catch (error) {
      ctx.throw(500, 'Image generation failed');
    }
  },
};
