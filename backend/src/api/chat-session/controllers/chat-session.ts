/**
 * chat-session controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::chat-session.chat-session', ({ strapi }) => ({
  // Ghi đè phương thức `findOne` để populate `chat_messages`
  async findOne(ctx) {
    const { id } = ctx.params;

    // Sử dụng query của Strapi để tìm session và populate các trường quan hệ
    const entity = await strapi.db.query('api::chat-session.chat-session').findOne({
      where: { id },
      populate: ['chat_messages'], // Populate `chat_messages` từ quan hệ
    });

    if (!entity) {
      return ctx.notFound('Chat session not found');
    }

    // Trả về dữ liệu đã populate
    return { data: entity };
  },

  // Tùy chọn: Ghi đè `find` để populate `chat_messages` trong danh sách
  async find(ctx) {
    const entities = await strapi.db.query('api::chat-session.chat-session').findMany({
      populate: ['chat_messages'], // Populate `chat_messages` trong danh sách
    });

    return { data: entities };
  },
}));
