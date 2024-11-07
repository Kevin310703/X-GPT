export default () => ({});

module.exports = ({ env }) => ({
    email: {
        provider: "sendgrid",
        providerOptions: {
            apiKey: env("SENDGRID_API_KEY"),
        },
        settings: {
            defaultFrom: "zgenhr@gmail.com",
            defaultReplyTo: "zgenhr@gmail.com",
        },
    },
});