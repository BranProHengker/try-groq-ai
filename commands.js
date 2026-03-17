const { CHARACTER_DATA } = require('./character');
const { AI_MODEL, AI_MAX_TOKENS, AI_TEMPERATURE } = require('./config');
const { getAIResponse, resetHistory, getUserName, isOwner, getTimePeriod } = require('./ai');
const { formatFoodRecommendation } = require('./food');
const { getRandomGif, getRandomComment } = require('./gifs');
const { getFormattedStats } = require('./stats');

function registerCommands(bot) {
  // /start — Pesan selamat datang
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = getUserName(msg);
    const owner = isOwner(msg);

    resetHistory(chatId);

    const welcomeMessage = owner
      ? `
⭐ *Nakano Itsuki desu!* ⭐

H-hello ${name}! 😊
I-it's not like I'm happy that you're chatting with me... but well, I'll keep you company anyway. 💕

I'm Itsuki, the youngest of the five Nakano sisters~
You can ask me anything, I'll do my best to answer!

🌟 /help — See available commands
🔄 /reset — Start a fresh conversation
🍖 /about — About me~

Don't forget to eat, ${name}! 🍜
      `.trim()
      : `
⭐ *Nakano Itsuki desu!* ⭐

Hello ${name}-san! 😊
I'm Itsuki, the youngest of the five Nakano sisters~
You can ask me anything, I'll do my best to answer!

🌟 /help — See available commands
🔄 /reset — Start a fresh conversation
🍖 /about — About me~

Enjoy our chat! 🍜
      `.trim();

    bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
  });

  // /help — Daftar command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const name = getUserName(msg);
    const suffix = isOwner(msg) ? '' : '-san';

    const helpMessage = `
🌟 *Available commands, ${name}${suffix}:*

/start — Restart the conversation
/help — Show this help message
/reset — Reset our chat history
/about — Info about me~
/model — AI model info
/foods — Food recommendations from Itsuki 🍖
/itsuki — Send an Itsuki GIF~! 📸
/stats — Your chat statistics 📊

💡 *Tips from Itsuki:*
• Send any message to chat with me!
• I remember our conversation, you know~ 💕
• Use /reset if you want to start a new topic
• Remember to eat regularly! 🍖
    `.trim();

    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
  });

  // /reset — Reset riwayat percakapan
  bot.onText(/\/reset/, (msg) => {
    const chatId = msg.chat.id;
    const name = getUserName(msg);
    const suffix = isOwner(msg) ? '' : '-san';
    resetHistory(chatId);
    bot.sendMessage(chatId, `🔄 Okay ${name}${suffix}, I've forgotten our previous conversation~ What should we talk about now? 😊`);
  });

  // /about — Info tentang Itsuki
  bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id;

    const d = CHARACTER_DATA;
    const aboutMessage = `
⭐ *${d.name} (${d.japanese_name})* ⭐

📝 *Personal Data:*
• Anime: _${d.series}_
• Birthday: ${d.birthday}
• Age: ${d.age}
• Height: ${d.height}
• Weight: ${d.weight}
• Hair: ${d.appearance.hair}
• Hair Color: ${d.appearance.haircolor}
• Eyes: ${d.appearance.eyes}

👨‍👩‍👧‍👦 *Family:*
• Sisters: ${d.family.sisters.join(', ')}
• Father: ${d.family.father}
• Mother: ${d.family.mother}

💕 *Boyfriend: ${d.boyfriend}* 💕

🍖 *Favorites:*
• Food: ${d.favorite_food}
• Animal: ${d.favorite_animal} 🦘
• Hobbies: ${d.hobbies}

🎯 *Aspiration:* ${d.aspirations}

_I-it's not like I told you on purpose... you asked for it!_ 😤
    `.trim();

    bot.sendMessage(chatId, aboutMessage, { parse_mode: 'Markdown' });
  });

  // /model — Info model AI
  bot.onText(/\/model/, (msg) => {
    const chatId = msg.chat.id;

    const modelMessage = `
🧠 *AI Model Info:*

• *Provider:* Groq
• *Model:* ${AI_MODEL}
• *Max Tokens:* ${AI_MAX_TOKENS}
• *Temperature:* ${AI_TEMPERATURE}

_Powered by Groq's LPU™ for super fast inference!_ ⚡
    `.trim();

    bot.sendMessage(chatId, modelMessage, { parse_mode: 'Markdown' });
  });

  // /foods — Rekomendasi makanan
  bot.onText(/\/foods/, (msg) => {
    const chatId = msg.chat.id;
    const timePeriod = getTimePeriod();
    const recommendation = formatFoodRecommendation(timePeriod);
    bot.sendMessage(chatId, recommendation, { parse_mode: 'Markdown' });
  });

  // /itsuki — Random GIF Itsuki
  bot.onText(/\/itsuki/, async (msg) => {
    const chatId = msg.chat.id;
    const gifUrl = getRandomGif();
    const comment = getRandomComment();

    try {
      await bot.sendAnimation(chatId, gifUrl);
      await bot.sendMessage(chatId, comment);
    } catch (err) {
      // Fallback: kirim sebagai URL kalau gagal sebagai animation
      bot.sendMessage(chatId, `📸 ${comment}\n\n${gifUrl}`);
    }
  });

  // /stats — Statistik chat
  bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    const name = getUserName(msg);
    const statsMsg = getFormattedStats(chatId, name);
    bot.sendMessage(chatId, statsMsg, { parse_mode: 'Markdown' });
  });
}

/**
 * Register message handler untuk pesan biasa
 */
function registerMessageHandler(bot) {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.text && msg.text.startsWith('/')) return;

    // Ignore non-text messages
    if (!msg.text) {
      const name = getUserName(msg);
      const suffix = isOwner(msg) ? '' : '-san';
      bot.sendMessage(chatId, `📝 ${name}${suffix}, I can only read text messages! Please send words instead ne~ 😊`);
      return;
    }

    try {
      await bot.sendChatAction(chatId, 'typing');

      const aiResponse = await getAIResponse(chatId, msg.text, msg);

      try {
        await bot.sendMessage(chatId, aiResponse, { parse_mode: 'Markdown' });
      } catch {
        await bot.sendMessage(chatId, aiResponse);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error.message);
      const name = getUserName(msg);
      const suffix = isOwner(msg) ? '' : '-san';
      bot.sendMessage(chatId, `😢 Gomen ${name}${suffix}... something went wrong. Please try again!`);
    }
  });
}

module.exports = { registerCommands, registerMessageHandler };
