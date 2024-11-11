module.exports = {
    async createChatSession(data) {
        return await strapi.entityService.create("api::chat-session.chat-session", {
            data,
        });
    },

    async getChatSessions(filters, sort) {
        return await strapi.entityService.findMany("api::chat-session.chat-session", {
            filters,
            sort,
        });
    },
};
