const Groq = require('groq-sdk');
const { GROQ_API_KEY, OWNER_USERNAME, MAX_HISTORY_LENGTH, AI_MODEL, AI_TEMPERATURE, AI_MAX_TOKENS } = require('./config');
const { buildSystemPrompt } = require('./character');
const { loadHistory, saveHistory } = require('./memory');
const { getMoodInfo, recordInteraction } = require('./mood');
const { recordMessage } = require('./stats');

const groq = new Groq({ apiKey: GROQ_API_KEY });

// Load persistent history saat startup
const conversationHistory = loadHistory();

function isOwner(msg) {
  return msg.from?.username?.toLowerCase() === OWNER_USERNAME.toLowerCase();
}

function getUserName(msg) {
  if (isOwner(msg)) return 'Bran-kun';
  return msg.from?.first_name || 'Teman';
}

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

function addToHistory(chatId, role, content) {
  const history = getUserHistory(chatId);
  history.push({ role, content });

  if (history.length > MAX_HISTORY_LENGTH) {
    conversationHistory.set(chatId, history.slice(-MAX_HISTORY_LENGTH));
  }

  // Auto-save ke file
  saveHistory(conversationHistory);
}

function resetHistory(chatId) {
  conversationHistory.delete(chatId);
  saveHistory(conversationHistory);
}

function getIndonesianDate() {
  const now = new Date();
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeZone: 'Asia/Jakarta'
  }).format(now);
}

async function getTodayHoliday() {
  try {
    return "Belum ada data peringatan khusus hari ini.";
  } catch (err) {
    return "Tidak ada data.";
  }
}

async function getAIResponse(chatId, userMessage, msg) {
  addToHistory(chatId, 'user', userMessage);

  const userName = getUserName(msg);
  const owner = isOwner(msg);
  const currentTime = getTimePeriod();
  const fullDate = getIndonesianDate();
  const holiday = await getTodayHoliday();

  // Mood system
  const moodInfo = getMoodInfo(chatId, currentTime);
  recordInteraction(chatId);

  // Stats tracking
  recordMessage(chatId, userName, userMessage);

  const systemPrompt = buildSystemPrompt(userName, owner, currentTime, fullDate, holiday, moodInfo);

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

module.exports = { getAIResponse, resetHistory, getUserName, isOwner, getTimePeriod };
