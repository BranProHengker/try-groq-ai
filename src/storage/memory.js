// ============================================
//  🧠 PERSISTENT MEMORY — File-based Storage
// ============================================

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// Pastikan folder data ada
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Load semua conversation history dari file
 */
function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return new Map(Object.entries(data));
    }
  } catch (err) {
    console.error('⚠️ Gagal load history:', err.message);
  }
  return new Map();
}

/**
 * Simpan semua conversation history ke file
 */
function saveHistory(historyMap) {
  try {
    const obj = Object.fromEntries(historyMap);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.error('⚠️ Gagal simpan history:', err.message);
  }
}

module.exports = { loadHistory, saveHistory, DATA_DIR };
