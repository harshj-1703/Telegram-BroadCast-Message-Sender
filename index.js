require('dotenv').config()
const express = require('express');

const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName:"telegram" });
const db = mongoose.connection;

const userSchema = new mongoose.Schema({
  userId: Number,
  chatId: Number
});

const User = mongoose.model('TelegramUsers', userSchema);

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  console.log(`Received message from user ${userId}, chat ID: ${chatId}`);

  const existingUser = await User.findOne({ userId: userId });
  if (!existingUser) {
    const newUser = new User({
      userId: userId,
      chatId: chatId
    });
    await newUser.save();
    await bot.sendMessage(chatId, "Congratulations You are Added to our Group, Now You will be get all notifications for the Government-Document-Management By Harsh Jolapara.");
  }
});

app.post('/send-message', async (req, res) => {
  try {
    const message = req.body.message;
    const users = await User.find();

    for (const user of users) {
      await bot.sendMessage(user.chatId, message, { parse_mode: "HTML" });
    }

    res.send('Message sent to all users successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});