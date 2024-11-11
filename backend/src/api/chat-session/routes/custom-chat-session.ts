module.exports = {
    routes: [
        {
            method: "POST",
            path: "/custom-chat-sessions",
            handler: "custom-chat-session.createCustomSession",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/custom-chat-sessions",
            handler: "custom-chat-session.getCustomSessions",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
