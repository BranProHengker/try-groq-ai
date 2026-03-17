// ============================================
//  📸 GIF ITSUKI — Random GIF Collection
// ============================================

// Verified working direct links for Itsuki Nakano
const GIF_COLLECTION = {
  happy: [
    'https://media1.tenor.com/m/_4-_lF8oRmUAAAAC/itsuki-nakano-the-quintessential-quintuplets.gif',
    'https://media1.tenor.com/m/0cj0Cd-yf9kAAAAd/nakano-itsuki.gif',
  ],
  eating: [
    'https://media1.tenor.com/m/41n0UYCQagIAAAAd/itsuki-quintess.gif',
    'https://media1.tenor.com/m/8gTsMIC6YLoAAAAC/hanayome-itsuki.gif',
  ],
  angry: [
    'https://media1.tenor.com/m/Bl8UU1w9PuMAAAAd/itsuki-skillbudy.gif',
    'https://media1.tenor.com/m/P65_8Ij_OM8AAAAd/pouting-face-the-quintessential-quintuplets.gif',
  ],
  cute: [
    'https://media1.tenor.com/m/ABkcBqwf1ZgAAAAC/the-quintessential-quintuplets-nanako.gif',
    'https://media1.tenor.com/m/sE6vBI7hUwwAAAAd/itsuki-nakano-the-quintessential-quintuplets.gif',
  ],
  blush: [
    'https://media1.tenor.com/m/E2zznNCeGtEAAAAd/itsuki-nakano-gotoubun-no-hanayome.gif',
    'https://media1.tenor.com/m/6snLTGl10Q0AAAAC/shake-the-quintessential-quintuplets.gif',
  ],
};

// All GIFs combined into one flat array
const ALL_GIFS = Object.values(GIF_COLLECTION).flat();

// Random comments when sending a GIF
const GIF_COMMENTS = [
  'I-it\'s not like I intentionally sent this photo... you asked for it! 😤',
  'This is me... etto... don\'t save it, okay! 😳',
  'Mou~ stop staring at me! 💕',
  'This is just for you... special desu! ⭐',
  'Hehe~ am I cute? ...N-not that I said it! 😤',
  'Don\'t tell anyone I sent this, okay~ 🌟',
  'I\'m... just in a good mood, that\'s why I sent a photo. Don\'t get the wrong idea! 😊',
  'If you save it, I... won\'t be mad. Just a little bit ne! 💕',
];

/**
 * Get random GIF URL
 * @param {string} [category] - Optional: happy, eating, angry, cute, blush
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
 * Get random comment
 */
function getRandomComment() {
  return GIF_COMMENTS[Math.floor(Math.random() * GIF_COMMENTS.length)];
}

module.exports = { getRandomGif, getRandomComment, GIF_COLLECTION };
