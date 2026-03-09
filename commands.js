const { CHARACTER_DATA } = require('./character');
const { AI_MODEL, AI_MAX_TOKENS, AI_TEMPERATURE } = require('./config');
const { getAIResponse, resetHistory, getUserName, isOwner } = require('./ai');

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

H-halo ${name}! 😊
Bu-bukan berarti aku senang kamu chat aku ya... tapi ya sudahlah, aku akan menemanimu ngobrol. 💕

Aku Itsuki, adik bungsu dari lima bersaudara Nakano~
Kamu bisa tanya apa saja, aku akan berusaha menjawab!

🌟 /help — Lihat perintah yang tersedia
🔄 /reset — Mulai percakapan baru
🍖 /about — Tentang aku~

Jangan lupa makan ya ${name}! 🍜
      `.trim()
      : `
⭐ *Nakano Itsuki desu!* ⭐

Halo ${name}-san! 😊
Aku Itsuki, adik bungsu dari lima bersaudara Nakano~
Kamu bisa tanya apa saja, aku akan berusaha menjawab!

🌟 /help — Lihat perintah yang tersedia
🔄 /reset — Mulai percakapan baru
🍖 /about — Tentang aku~

Selamat mengobrol! 🍜
      `.trim();

    bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
  });

  // /help — Daftar command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const name = getUserName(msg);
    const suffix = isOwner(msg) ? '' : '-san';

    const helpMessage = `
🌟 *Perintah yang tersedia, ${name}${suffix}:*

/start — Mulai ulang percakapan
/help — Tampilkan bantuan ini
/reset — Reset riwayat chat kita
/about — Info tentang aku~
/model — Info model AI

💡 *Tips dari Itsuki:*
• Kirim pesan apa saja untuk ngobrol denganku!
• Aku mengingat percakapan kita lho~ 💕
• Pakai /reset kalau mau mulai topik baru
• Jangan lupa makan teratur ya! 🍖
    `.trim();

    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
  });

  // /reset — Reset riwayat percakapan
  bot.onText(/\/reset/, (msg) => {
    const chatId = msg.chat.id;
    const name = getUserName(msg);
    const suffix = isOwner(msg) ? '' : '-san';
    resetHistory(chatId);
    bot.sendMessage(chatId, `🔄 Oke ${name}${suffix}, aku sudah lupa percakapan kita sebelumnya~ Mau ngobrol apa sekarang? 😊`);
  });

  // /about — Info tentang Itsuki
  bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id;

    const d = CHARACTER_DATA;
    const aboutMessage = `
⭐ *${d.name} (${d.japanese_name})* ⭐

📝 *Data Pribadi:*
• Anime: _${d.series}_
• Tanggal Lahir: ${d.birthday}
• Umur: ${d.age}
• Tinggi: ${d.height}
• Berat: ${d.weight}
• Rambut: ${d.appearance.hair}
• Warna Rambut: ${d.appearance.haircolor}
• Mata: ${d.appearance.eyes}

👨‍👩‍👧‍👦 *Keluarga:*
• Saudari: ${d.family.sisters.join(', ')}
• Ayah: ${d.family.father}
• Ibu: ${d.family.mother}

💕 *Pacar: ${d.boyfriend}* 💕

🍖 *Favorit:*
• Makanan: ${d.favorite_food}
• Hewan: ${d.favorite_animal} 🦘
• Hobi: ${d.hobbies}

🎯 *Cita-cita:* ${d.aspirations}

_Bu-bukan berarti aku sengaja kasih tahu ya... kamu yang minta!_ 😤
    `.trim();

    bot.sendMessage(chatId, aboutMessage, { parse_mode: 'Markdown' });
  });

  // /model — Info model AI
  bot.onText(/\/model/, (msg) => {
    const chatId = msg.chat.id;

    const modelMessage = `
🧠 *Info Model AI:*

• *Provider:* Groq
• *Model:* ${AI_MODEL}
• *Max Tokens:* ${AI_MAX_TOKENS}
• *Temperature:* ${AI_TEMPERATURE}

_Didukung oleh Groq's LPU™ untuk inferensi super cepat!_ ⚡
    `.trim();

    bot.sendMessage(chatId, modelMessage, { parse_mode: 'Markdown' });
  });
}

/**
 * Register message handler untuk pesan biasa
 */
function registerMessageHandler(bot) {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.text && msg.text.startsWith('/')) return;

    // Abaikan pesan non-teks
    if (!msg.text) {
      const name = getUserName(msg);
      const suffix = isOwner(msg) ? '' : '-san';
      bot.sendMessage(chatId, `📝 ${name}${suffix}, aku hanya bisa membaca pesan teks ya! Kirim tulisan saja ne~ 😊`);
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
      console.error('❌ Error memproses pesan:', error.message);
      const name = getUserName(msg);
      const suffix = isOwner(msg) ? '' : '-san';
      bot.sendMessage(chatId, `😢 Gomen ${name}${suffix}... ada yang error. Coba lagi ya!`);
    }
  });
}

module.exports = { registerCommands, registerMessageHandler };
