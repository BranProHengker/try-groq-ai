require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!TELEGRAM_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN belum diset di file .env');
  process.exit(1);
}
if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY belum diset di file .env');
  process.exit(1);
}

const OWNER_USERNAME = 'branzcreed';

const MAX_HISTORY_LENGTH = 20;

const AI_MODEL = 'llama-3.3-70b-versatile';
const AI_TEMPERATURE = 0.7;
const AI_MAX_TOKENS = 2048;

module.exports = {
  TELEGRAM_TOKEN,
  GROQ_API_KEY,
  OWNER_USERNAME,
  MAX_HISTORY_LENGTH,
  AI_MODEL,
  AI_TEMPERATURE,
  AI_MAX_TOKENS,
};
