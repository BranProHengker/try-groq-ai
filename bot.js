require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Groq = require('groq-sdk');

// ============================================
//  🤖 KONFIGURASI BOT
// ============================================

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Validasi environment variables
if (!TELEGRAM_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN belum diset di file .env');
  process.exit(1);
}
if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY belum diset di file .env');
  process.exit(1);
}

// Inisialisasi Groq client
const groq = new Groq({ apiKey: GROQ_API_KEY });

// Inisialisasi Telegram bot (polling mode)
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// ============================================
//  💾 CONVERSATION MEMORY
// ============================================

// Menyimpan riwayat chat per user (in-memory)
const conversationHistory = new Map();

// Batas maksimal riwayat pesan per user (agar tidak kehabisan token)
const MAX_HISTORY_LENGTH = 20;

// System prompt — kustomisasi kepribadian bot AI kamu di sini!
const SYSTEM_PROMPT = `Kamu adalah asisten AI yang cerdas, ramah, dan helpful. 
Kamu bisa menjawab dalam bahasa Indonesia maupun bahasa Inggris, sesuaikan dengan bahasa pengguna.
Berikan jawaban yang jelas, akurat, dan informatif.
Jika kamu tidak yakin tentang sesuatu, katakan dengan jujur.
Gunakan emoji sesekali untuk membuat percakapan lebih hidup 😊`;

/**
 * Mendapatkan riwayat percakapan user
 */
function getUserHistory(chatId) {
  if (!conversationHistory.has(chatId)) {
    conversationHistory.set(chatId, []);
  }
  return conversationHistory.get(chatId);
}

/**
 * Menambahkan pesan ke riwayat percakapan user
 */
function addToHistory(chatId, role, content) {
  const history = getUserHistory(chatId);
  history.push({ role, content });

  // Potong riwayat jika terlalu panjang
  if (history.length > MAX_HISTORY_LENGTH) {
    // Simpan hanya N pesan terakhir
    conversationHistory.set(chatId, history.slice(-MAX_HISTORY_LENGTH));
  }
}

/**
 * Reset riwayat percakapan user
 */
function resetHistory(chatId) {
  conversationHistory.delete(chatId);
}

// ============================================
//  🧠 GROQ AI INTEGRATION
// ============================================

/**
 * Mengirim pesan ke Groq API dan mendapat respons AI
 */
async function getAIResponse(chatId, userMessage) {
  // Tambahkan pesan user ke riwayat
  addToHistory(chatId, 'user', userMessage);

  const history = getUserHistory(chatId);

  // Bangun array messages dengan system prompt + riwayat
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
  ];

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || 'Maaf, saya tidak bisa merespons saat ini.';

    // Tambahkan respons AI ke riwayat
    addToHistory(chatId, 'assistant', aiResponse);

    return aiResponse;
  } catch (error) {
    console.error('❌ Groq API Error:', error.message);

    // Handle specific errors
    if (error.status === 429) {
      return '⏳ Rate limit tercapai. Tunggu sebentar lalu coba lagi ya.';
    }
    if (error.status === 401) {
      return '🔑 API key tidak valid. Silakan periksa konfigurasi.';
    }

    return '❌ Maaf, terjadi error saat memproses pesan kamu. Coba lagi ya!';
  }
}

// ============================================
//  📨 TELEGRAM COMMAND HANDLERS
// ============================================

// /start — Pesan selamat datang
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'Kamu';

  resetHistory(chatId);

  const welcomeMessage = `
🤖 *Halo ${userName}!* Selamat datang!

Aku adalah bot AI yang didukung oleh *Groq AI*.
Kamu bisa bertanya apa saja dan aku akan berusaha menjawab dengan sebaik mungkin!

🔹 Kirim pesan apa saja untuk mulai ngobrol
🔹 /help — Lihat daftar perintah
🔹 /reset — Reset riwayat percakapan
🔹 /model — Lihat model AI yang digunakan

Silakan mulai chat! 💬
  `.trim();

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// /help — Daftar command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  const helpMessage = `
📖 *Daftar Perintah:*

/start — Mulai ulang bot
/help — Tampilkan bantuan ini
/reset — Reset riwayat percakapan
/model — Info model AI yang digunakan

💡 *Tips:*
• Kirim pesan teks biasa untuk ngobrol dengan AI
• Bot mengingat konteks percakapan kamu
• Gunakan /reset jika ingin memulai topik baru
  `.trim();

  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// /reset — Reset riwayat percakapan
bot.onText(/\/reset/, (msg) => {
  const chatId = msg.chat.id;
  resetHistory(chatId);
  bot.sendMessage(chatId, '🔄 Riwayat percakapan telah direset. Kamu bisa mulai topik baru!');
});

// /model — Info model AI
bot.onText(/\/model/, (msg) => {
  const chatId = msg.chat.id;

  const modelMessage = `
🧠 *Info Model AI:*

• *Provider:* Groq
• *Model:* LLaMA 3.3 70B Versatile
• *Max Tokens:* 2048
• *Temperature:* 0.7

_Model ini didukung oleh Groq's LPU™ untuk inferensi super cepat!_ ⚡
  `.trim();

  bot.sendMessage(chatId, modelMessage, { parse_mode: 'Markdown' });
});

// ============================================
//  💬 MESSAGE HANDLER (Pesan biasa)
// ============================================

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Abaikan command (sudah ditangani di atas)
  if (msg.text && msg.text.startsWith('/')) return;

  // Abaikan pesan non-teks (foto, sticker, dll)
  if (!msg.text) {
    bot.sendMessage(chatId, '📝 Saat ini aku hanya bisa memproses pesan teks ya!');
    return;
  }

  try {
    // Kirim "sedang mengetik..." indicator
    await bot.sendChatAction(chatId, 'typing');

    // Dapatkan respons AI
    const aiResponse = await getAIResponse(chatId, msg.text);

    // Kirim respons (coba dengan Markdown, fallback ke plain text)
    try {
      await bot.sendMessage(chatId, aiResponse, { parse_mode: 'Markdown' });
    } catch {
      // Jika Markdown parsing gagal, kirim sebagai plain text
      await bot.sendMessage(chatId, aiResponse);
    }
  } catch (error) {
    console.error('❌ Error memproses pesan:', error.message);
    bot.sendMessage(chatId, '❌ Terjadi error. Coba lagi ya!');
  }
});

// ============================================
//  🚀 BOT STARTUP
// ============================================

bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.code, error.message);
});

console.log('');
console.log('🤖 ═══════════════════════════════════════');
console.log('   Telegram AI Bot berhasil dimulai!');
console.log('   Powered by Groq AI (LLaMA 3.3 70B)');
console.log('🤖 ═══════════════════════════════════════');
console.log('');
console.log('📡 Menunggu pesan dari Telegram...');
console.log('   Tekan Ctrl+C untuk berhenti');
console.log('');
