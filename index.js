require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

const userChatIds = new Map();

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  console.log(msg.text);
  userChatIds.set(userId, chatId);

  console.log(`Received message from user ${userId}, chat ID: ${chatId}`);
});

function sendMessageToUser(userId, message) {
//   const chatId = userChatIds.get(userId);
  if (userId) {
    bot.sendMessage(userId, message);
  } else {
    console.error(`User ${userId} not found`);
  }
}

//send message
const userId = '1704881327';
const message = 'Hello, this is a message from your Telegram bot.';
sendMessageToUser(userId, message);