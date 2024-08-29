export default () => ({
  telegram: {
    error_bot_token: process.env.TELEGRAM_BOT_TOKEN_ERROR,
    error_chat_id: process.env.TELEGRAM_ERROR_CHAT_ID,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
  },
});
