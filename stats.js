// ============================================
//  📊 CHAT STATS — Track User Statistics
// ============================================

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// Pastikan folder data ada
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Load stats dari file
 */
function loadStats() {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('⚠️ Gagal load stats:', err.message);
  }
  return {};
}

/**
 * Simpan stats ke file
 */
function saveStats(stats) {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (err) {
    console.error('⚠️ Gagal simpan stats:', err.message);
  }
}

/**
 * Catat pesan dari user
 */
function recordMessage(chatId, userName, messageText) {
  const stats = loadStats();

  if (!stats[chatId]) {
    stats[chatId] = {
      userName,
      totalMessages: 0,
      totalWords: 0,
      firstChat: new Date().toISOString(),
      lastChat: new Date().toISOString(),
    };
  }

  stats[chatId].userName = userName;
  stats[chatId].totalMessages += 1;
  stats[chatId].totalWords += (messageText || '').split(/\s+/).filter(Boolean).length;
  stats[chatId].lastChat = new Date().toISOString();

  saveStats(stats);
}

/**
 * Mendapatkan stats user yang sudah di-format
 */
function getFormattedStats(chatId, userName) {
  const stats = loadStats();
  const userStats = stats[chatId];

  if (!userStats) {
    return `📊 *Chat Statistics*\n\nThere's no data for ${userName} yet. Start chatting with me first~! 😊`;
  }

  const firstDate = new Date(userStats.firstChat);
  const lastDate = new Date(userStats.lastChat);

  const firstFormatted = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(firstDate);

  const lastFormatted = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(lastDate);

  // Hitung rata-rata kata per pesan
  const avgWords = userStats.totalMessages > 0
    ? Math.round(userStats.totalWords / userStats.totalMessages)
    : 0;

  return `
📊 *Chat Statistics — ${userName}* 📊

💬 Total Messages: *${userStats.totalMessages}*
📝 Total Words: *${userStats.totalWords}*
📏 Avg Words/Message: *${avgWords}*

📅 First Chat: _${firstFormatted}_
🕐 Last Chat: _${lastFormatted}_

_Arigatou for chatting with me often, ne~!_ 💕
  `.trim();
}

module.exports = { recordMessage, getFormattedStats };
