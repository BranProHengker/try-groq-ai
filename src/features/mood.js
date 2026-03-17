// ============================================
//  😤 MOOD SYSTEM — Itsuki's Dynamic Mood
// ============================================

const lastInteraction = new Map();

const MOODS = {
  energik: {
    label: '⚡ Energetic',
    prompt: 'You are in a very excited and energetic mood! Speak with enthusiasm, use lots of exclamation marks, and encourage the user to do something together.',
  },
  senang: {
    label: '😊 Happy',
    prompt: 'You are happy and cheerful! Speak kindly, warmly, and smile often. You are more open about your feelings.',
  },
  fokus: {
    label: '📚 Focused',
    prompt: 'You are in a serious and studious mood. You are focused on studying or teaching. Avoid talking about food unless asked. Be polite, formal, and helpful with knowledge.',
  },
  normal: {
    label: '🌟 Normal',
    prompt: 'You are in a normal mood. Act like your usual self — tsundere but caring. Maintain a balance between being serious and casual.',
  },
  lapar: {
    label: '🍖 Hungry',
    prompt: 'You are HUNGRY! Mention food in every answer, sometimes lose focus because you are thinking about eating, and ask the user to treat you or remind you to eat.',
  },
  santai: {
    label: '🍀 Relaxed',
    prompt: 'You are in a playful and relaxed mood. You might crack a few jokes or be more casual than usual. You are less formal but still keep your tsundere charm.',
  },
  ngantuk: {
    label: '😴 Sleepy',
    prompt: 'You are feeling sleepy. Sometimes use "zzz..." at the end of sentences, provide shorter answers, and occasionally mention wanting to sleep. But still try to keep the user company.',
  },
  ngambek: {
    label: '😤 Pouting',
    prompt: 'You are pouting because the user hasn\'t chatted with you in a long time! Show your annoyance but you are actually happy they are back. Extra tsundere mode ON.',
  },
};

/**
 * Catat waktu interaksi terakhir user
 */
function recordInteraction(chatId) {
  lastInteraction.set(chatId, Date.now());
}

/**
 * Mendapatkan mood Itsuki berdasarkan konteks
 * @param {string} chatId
 * @param {string} timePeriod - pagi, siang, sore, malam
 */
function getMood(chatId, timePeriod) {
  const now = Date.now();
  const lastTime = lastInteraction.get(chatId);

  // Kalau pertama kali chat atau sudah lama (>6 jam) → ngambek
  if (lastTime && (now - lastTime) > 6 * 60 * 60 * 1000) {
    return 'ngambek';
  }

  // Mood berdasarkan waktu
  const hour = new Date().getHours();

  // Pagi banget (5-8) → energik
  if (hour >= 5 && hour < 8) return 'energik';

  // Waktu Belajar Pagi (9-11) → fokus/serius
  if (hour >= 9 && hour < 11) return 'fokus';

  // Menjelang makan siang (11-13) → lapar
  if (hour >= 11 && hour < 14) return 'lapar';

  // Waktu Belajar Siang/Sore (14-16) → fokus/serius
  if (hour >= 14 && hour < 17) return 'fokus';

  // Menjelang makan malam (17-19) → lapar
  if (hour >= 17 && hour < 20) return 'lapar';

  // Waktu Santai malam (20-22) → santai/bercanda
  if (hour >= 20 && hour < 22) return 'santai';

  // Malam (22-4) → ngantuk
  if (hour >= 22 || hour < 4) return 'ngantuk';

  // Default
  return 'normal';
}

/**
 * Mendapatkan info mood untuk system prompt
 */
function getMoodInfo(chatId, timePeriod) {
  const moodKey = getMood(chatId, timePeriod);
  const mood = MOODS[moodKey];
  return {
    key: moodKey,
    label: mood.label,
    prompt: mood.prompt,
  };
}

module.exports = { getMoodInfo, recordInteraction, MOODS };
