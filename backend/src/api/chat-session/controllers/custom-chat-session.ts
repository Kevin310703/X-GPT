module.exports = {
    async createCustomSession(ctx) {
        try {
            const { title } = ctx.request.body;

            // Kiểm tra dữ liệu đầu vào
            if (!title) {
                return ctx.badRequest("Title is required");
            }

            // Tạo một Chat Session mới
            const newChatSession = await strapi.entityService.create("api::chat-session.chat-session", {
                data: {
                    title,
                    document_id: require("uuid").v4(), // Tạo UUID cho document_id
                },
            });

            return ctx.created(newChatSession);
        } catch (error) {
            console.error("Error creating custom chat session:", error);
            ctx.internalServerError("An error occurred while creating the chat session");
        }
    },

    async getCustomSessions(ctx) {
        try {
            const sessions = await strapi.entityService.findMany("api::chat-session.chat-session", {
                filters: ctx.query.filters || {}, // Lọc dựa trên query
                sort: ctx.query.sort || "createdAt:desc", // Sắp xếp theo thời gian
            });

            return ctx.ok(sessions);
        } catch (error) {
            console.error("Error fetching custom chat sessions:", error);
            ctx.internalServerError("An error occurred while fetching chat sessions");
        }
    },
};
