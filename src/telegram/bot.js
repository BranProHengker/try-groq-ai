const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_TOKEN } = require('../core/config');
const { registerCommands, registerMessageHandler } = require('./commands');

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Register handlers
registerCommands(bot);
registerMessageHandler(bot);

// Error handling
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.code, error.message);
});

console.log('');
console.log('⭐ ═══════════════════════════════════════');
console.log('   Eatsuki Bot berhasil dimulai!');
console.log('   Nakano Itsuki 🌟 Powered by avttr-studio ');
console.log('⭐ ═══════════════════════════════════════');
console.log('');
console.log('📡 Menunggu pesan dari Bran-kun...');
console.log('   Tekan Ctrl+C untuk berhenti');
console.log('');
