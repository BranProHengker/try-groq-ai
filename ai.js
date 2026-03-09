const Groq = require('groq-sdk');
const { GROQ_API_KEY, OWNER_USERNAME, MAX_HISTORY_LENGTH, AI_MODEL, AI_TEMPERATURE, AI_MAX_TOKENS } = require('./config');
const { buildSystemPrompt } = require('./character');


const groq = new Groq({ apiKey: GROQ_API_KEY });

const conversationHistory = new Map();

/**
 * Cek apakah user adalah pemilik bot (Bran-kun)
 */
function isOwner(msg) {
  return msg.from?.username?.toLowerCase() === OWNER_USERNAME.toLowerCase();
}


function getUserName(msg) {
  if (isOwner(msg)) return 'Bran-kun';
  return msg.from?.first_name || 'Teman';
}

/**
 * Mendapatkan periode waktu saat ini
 */
function getTimePeriod() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'pagi';
  if (hour >= 11 && hour < 15) return 'siang';
  if (hour >= 15 && hour < 18) return 'sore';
  return 'malam';
}

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

  if (history.length > MAX_HISTORY_LENGTH) {
    conversationHistory.set(chatId, history.slice(-MAX_HISTORY_LENGTH));
  }
}

/**
 * Reset riwayat percakapan user
 */
function resetHistory(chatId) {
  conversationHistory.delete(chatId);
}

/**
 * Mengirim pesan ke Groq API dan mendapat respons AI
 */
async function getAIResponse(chatId, userMessage, msg) {
  addToHistory(chatId, 'user', userMessage);

  const userName = getUserName(msg);
  const owner = isOwner(msg);
  const currentTime = getTimePeriod();
  const systemPrompt = buildSystemPrompt(userName, owner, currentTime);

  const history = getUserHistory(chatId);
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
  ];

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: AI_MODEL,
      temperature: AI_TEMPERATURE,
      max_tokens: AI_MAX_TOKENS,
      top_p: 0.9,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || 'Mou~ aku bingung mau jawab apa...';

    addToHistory(chatId, 'assistant', aiResponse);
    return aiResponse;
  } catch (error) {
    console.error('❌ Groq API Error:', error.message);

    const name = owner ? 'Bran-kun' : `${userName}-san`;

    if (error.status === 429) {
      return `😤 Mou~ terlalu banyak pesan sekaligus! Tunggu sebentar ya ${name}... aku butuh istirahat dulu.`;
    }
    if (error.status === 401) {
      return `⚠️ A-ada masalah dengan konfigurasi... ${name}, tolong periksa API key-nya ya!`;
    }

    return `😢 Go-gomen ${name}... ada yang error. Coba lagi nanti ya!`;
  }
}

module.exports = { getAIResponse, resetHistory, getUserName, isOwner };
