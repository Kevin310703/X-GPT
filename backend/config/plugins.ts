export default () => ({});

module.exports = ({ env }) => ({
    email: {
      provider: 'strapi-provider-email-smtp',
      providerOptions: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Đặt là false khi dùng port 587
        auth: {
          user: 'zgenhr@gmail.com',
          pass: 'xdse xmdf osrd gskt',
        },
        rejectUnauthorized: false, // Tạm thời để false nếu có lỗi về SSL
        requireTLS: true,
        connectionTimeout: 5000, // Tăng timeout
      },
      settings: {
        defaultFrom: 'zgenhr@gmail.com',
        defaultReplyTo: 'zgenhr@gmail.com',
      },
    },
  });
  