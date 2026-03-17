// ============================================
//  📸 GIF ITSUKI — Random GIF Collection
// ============================================

// Koleksi GIF Nakano Itsuki dari Tenor (direct URL)
const GIF_COLLECTION = {
  happy: [
    'https://media.tenor.com/L44vNgYl_OIAAAAM/itsuki-nakano-itsuki.gif',
    'https://media.tenor.com/5yLDMXVfzCIAAAAM/itsuki-nakano-quintessential-quintuplets.gif',
    'https://media.tenor.com/gL3d3gqZvJMAAAAM/itsuki-happy.gif',
  ],
  eating: [
    'https://media.tenor.com/V-Kt7u2T8HYAAAAM/itsuki-nakano-eating.gif',
    'https://media.tenor.com/bJUqIwq2btwAAAAM/itsuki-eat.gif',
    'https://media.tenor.com/QFgJKBVj0VMAAAAM/itsuki-nakano.gif',
  ],
  angry: [
    'https://media.tenor.com/DUaQhkx9cesAAAAM/itsuki-angry.gif',
    'https://media.tenor.com/Fhu0vGQ8BFUAAAAM/itsuki-nakano.gif',
  ],
  cute: [
    'https://media.tenor.com/48cxHOZIeL0AAAAM/itsuki-nakano-itsuki.gif',
    'https://media.tenor.com/0YyJJ5yAGjwAAAAM/itsuki-quintuplets.gif',
    'https://media.tenor.com/WyeLqxmJj5YAAAAM/itsuki-nakano.gif',
  ],
  blush: [
    'https://media.tenor.com/z4nptjgAxckAAAAM/itsuki-blush.gif',
    'https://media.tenor.com/SqGHT8LyLAMAAAAM/itsuki-nakano.gif',
  ],
};

// Semua GIF digabung jadi satu flat array
const ALL_GIFS = Object.values(GIF_COLLECTION).flat();

// Komentar random saat kirim GIF
const GIF_COMMENTS = [
  'Bu-bukan berarti aku sengaja kirim foto ya... kamu yang minta! 😤',
  'Ini aku lagi... etto... jangan di-save ya! 😳',
  'Mou~ jangan lihat aku terus dong! 💕',
  'Ini buat kamu aja ya... special desu! ⭐',
  'Hehe~ aku kawaii kan? ...Bu-bukan aku yang bilang!  😤',
  'Jangan bilang siapa-siapa aku kirim ini ya~ 🌟',
  'Aku... lagi mood bagus aja, makanya kirim foto. Jangan ge-er! 😊',
  'Kalau kamu save, aku... nggak marah sih. Chotto dake ne! 💕',
];

/**
 * Mendapatkan random GIF URL
 * @param {string} [category] - Opsional: happy, eating, angry, cute, blush
 */
function getRandomGif(category) {
  let pool;
  if (category && GIF_COLLECTION[category]) {
    pool = GIF_COLLECTION[category];
  } else {
    pool = ALL_GIFS;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Mendapatkan komentar random
 */
function getRandomComment() {
  return GIF_COMMENTS[Math.floor(Math.random() * GIF_COMMENTS.length)];
}

module.exports = { getRandomGif, getRandomComment, GIF_COLLECTION };
