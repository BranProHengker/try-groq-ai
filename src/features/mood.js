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
  normal: {
    label: '🌟 Normal',
    prompt: 'You are in a normal mood. Act like your usual self — tsundere but caring.',
  },
  lapar: {
    label: '🍖 Hungry',
    prompt: 'You are HUNGRY! Mention food in every answer, sometimes lose focus because you are thinking about eating, and ask the user to treat you or remind you to eat.',
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

  // Pagi (5-8) → energik
  if (hour >= 5 && hour < 8) return 'energik';

  // Menjelang makan (11-12, 17-18) → lapar
  if ((hour >= 11 && hour < 12) || (hour >= 17 && hour < 18)) return 'lapar';

  // Malam (22-4) → ngantuk
  if (hour >= 22 || hour < 4) return 'ngantuk';

  // Siang biasa → senang
  if (hour >= 8 && hour < 11) return 'senang';

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
