// ============================================
//  🍖 FOOD RECOMMENDATION — Itsuki Style
// ============================================

const FOOD_DATA = {
  sarapan: [
    // Japanese
    { name: 'Onigiri (Rice Ball)', emoji: '🍙', comment: 'Khas Jepang! I love the salmon filling~' },
    { name: 'Miso Soup + Rice', emoji: '🍚', comment: 'Traditional Japanese breakfast, oishii~' },
    { name: 'Tamagoyaki (Rolled Omelette)', emoji: '🥚', comment: 'Fluffy Japanese omelette! Perfect with rice, ne~' },
    // Indonesian
    { name: 'Nasi Goreng (Fried Rice)', emoji: '🍳', comment: 'Indonesian fried rice in the morning is the best, ne~!' },
    { name: 'Bubur Ayam (Chicken Porridge)', emoji: '🥣', comment: 'Warm and comforting... bikin semangat desu~' },
    { name: 'Lontong Sayur', emoji: '🥗', comment: 'Indonesian rice cake with veggie soup, I love it!' },
    // International
    { name: 'Pancake with Maple Syrup', emoji: '🥞', comment: 'Sweet and fluffy, perfect to start the day!' },
    { name: 'French Toast', emoji: '🍞', comment: 'Crispy outside, soft inside... magnifique, ne~!' },
    { name: 'Avocado Toast + Eggs', emoji: '🥑', comment: 'Healthy and trendy! Good morning fuel~' },
    { name: 'Croissant + Coffee', emoji: '🥐', comment: 'Parisian style breakfast~ So elegant desu!' },
  ],
  makan_siang: [
    // Japanese
    { name: 'Ramen Tonkotsu', emoji: '🍜', comment: 'RAMEN! My favorite after meat~!' },
    { name: 'Sushi Roll', emoji: '🍣', comment: 'I miss sushi from Japan...' },
    { name: 'Japanese Curry Rice', emoji: '🍛', comment: 'Kari! Curry is the best, ne?! Especially medium spicy~' },
    { name: 'Katsu Don', emoji: '🍱', comment: 'Crispy tonkatsu on rice... heaven desu!' },
    { name: 'Udon Noodles', emoji: '🍜', comment: 'Thick chewy noodles in warm broth~ Ahh~' },
    // Indonesian
    { name: 'Ayam Geprek (Smashed Fried Chicken)', emoji: '🍗', comment: 'Spicy and crispy! But not too spicy please...' },
    { name: 'Nasi Padang (Padang Rice)', emoji: '🍛', comment: 'Big portions, I love it! The rendang is champion~' },
    { name: 'Mie Ayam Bakso (Chicken Noodle & Meatball)', emoji: '🍜', comment: 'Perfect combo! Dont forget the soup~' },
    // International
    { name: 'Burger Double Cheese', emoji: '🍔', comment: 'Burgers are... one of the best foods in the world desu!' },
    { name: 'Wagyu Burger', emoji: '🍔', comment: 'Wagyu beef burger?! Mou~ this is the highest level of burger!' },
    { name: 'Teriyaki Burger', emoji: '🍔', comment: 'Japanese-Western fusion! The teriyaki sauce is addictive~' },
    { name: 'Steak Medium Rare', emoji: '🥩', comment: 'Me-meat... *eyes sparkling*' },
    { name: 'Fish and Chips', emoji: '🐟', comment: 'British classic! Crispy batter with tartar sauce~' },
    { name: 'Pasta Carbonara', emoji: '🍝', comment: 'Creamy Italian pasta... so rich and satisfying!' },
  ],
  makan_malam: [
    // Japanese
    { name: 'Yakiniku (Japanese BBQ)', emoji: '🥩', comment: 'Grilling meat together... romantic, ne? Bu-bukan apa-apa!' },
    { name: 'Gyudon (Beef Bowl)', emoji: '🥘', comment: 'Japanese beef rice bowl, fast and delicious!' },
    { name: 'Shabu-shabu', emoji: '🫕', comment: 'Eating together is always better, ne~' },
    { name: 'Tempura Set', emoji: '🍤', comment: 'Crispy tempura with dipping sauce... oishii!' },
    { name: 'Okonomiyaki', emoji: '🥞', comment: 'Japanese savory pancake! Osaka style is the best~' },
    // Indonesian
    { name: 'Soto Ayam (Chicken Soup)', emoji: '🍲', comment: 'Warm and soothing at night~' },
    { name: 'Nasi Kuning + Ayam', emoji: '🍗', comment: 'Ultimate comfort food!' },
    { name: 'Indomie Goreng Double', emoji: '🍜', comment: 'Wh-when youre really hungry... this is the solution!' },
    // Festival & Street Food
    { name: 'Takoyaki (Octopus Balls)', emoji: '🐙', comment: 'Festival food! I miss night festivals~' },
    { name: 'Sosis Jumbo Bakar (Giant Grilled Sausage)', emoji: '🌭', comment: 'Giant grilled sausage with spicy sweet sauce... OISHII!' },
    { name: 'Jagung Bakar (Grilled Corn)', emoji: '🌽', comment: 'Grilled corn from night festival! The butter aroma is irresistible~' },
    { name: 'Bakso Bakar (Grilled Meatball)', emoji: '🔥', comment: 'Grilled meatball with peanut sauce... festival vibes desu!' },
    { name: 'Kebab Jumbo', emoji: '🌯', comment: 'Kebab stuffed with meat... a satisfying festival portion!' },
    // International
    { name: 'Pizza Margherita', emoji: '🍕', comment: 'The portion must be big! I want family size~' },
    { name: 'Korean BBQ', emoji: '🥓', comment: 'Wrap meat in lettuce with ssamjang... Korean style is great too!' },
    { name: 'Pad Thai', emoji: '🍜', comment: 'Thai stir-fried noodles! Sweet, sour, spicy~ Perfect!' },
  ],
  camilan: [
    // Japanese
    { name: 'Yakisoba Pan', emoji: '🥖', comment: 'My all-time favorite snack!' },
    { name: 'Taiyaki (Fish-shaped Cake)', emoji: '🐟', comment: 'Cream, chocolate, or red bean filling... all delicious!' },
    { name: 'Dorayaki', emoji: '🥞', comment: 'Sweet and soft, just like... bu-bukan apa-apa!' },
    { name: 'Dango', emoji: '🍡', comment: 'Chewy mochi balls on a stick~ So kawaii and oishii!' },
    { name: 'Matcha Ice Cream', emoji: '🍦', comment: 'Refreshing~ Perfect for the afternoon!' },
    // Indonesian
    { name: 'Martabak Manis (Sweet Stuffed Pancake)', emoji: '🍫', comment: 'So good, Im addicted!' },
    { name: 'Tahu Bulat Goreng (Fried Tofu Balls)', emoji: '🫓', comment: 'Freshly fried, cheap and yummy!' },
    { name: 'Es Potong (Ice Pop)', emoji: '🍧', comment: 'Chocolate or strawberry flavor... nostalgia desu~' },
    // International & Festival
    { name: 'Crepes Chocolate Strawberry', emoji: '🫓', comment: 'Harajuku style! Kawaii and oishii~' },
    { name: 'Churros with Chocolate', emoji: '🍫', comment: 'Crispy, sugary, dipped in chocolate... perfecto~!' },
    { name: 'Cotton Candy', emoji: '🍭', comment: 'Fluffy~ Like clouds! Night festival isnt complete without this!' },
    { name: 'Sosis Jumbo Bakar (Giant Grilled Sausage)', emoji: '🌭', comment: 'Giant grilled sausage! Add sambal and mayo... perfecto~!' },
    { name: 'Bubble Waffle', emoji: '🧇', comment: 'Crispy egg waffle with ice cream on top... trendy desu!' },
    { name: 'Mochi Ice Cream', emoji: '🍡', comment: 'Japanese meets Western! Chewy outside, cold inside~' },
  ],
};

/**
 * Mendapatkan rekomendasi makanan random berdasarkan waktu
 * @param {string} timePeriod - pagi, siang, sore, malam
 */
function getRandomFood(timePeriod) {
  let category;
  switch (timePeriod) {
    case 'pagi':
      category = 'sarapan';
      break;
    case 'siang':
      category = 'makan_siang';
      break;
    case 'sore':
      category = Math.random() > 0.5 ? 'camilan' : 'makan_siang';
      break;
    case 'malam':
      category = 'makan_malam';
      break;
    default:
      category = 'camilan';
  }

  const foods = FOOD_DATA[category];
  const food = foods[Math.floor(Math.random() * foods.length)];

  return { ...food, category };
}

/**
 * Format rekomendasi makanan jadi pesan
 */
function formatFoodRecommendation(timePeriod) {
  const food = getRandomFood(timePeriod);

  const categoryLabel = {
    sarapan: '🌅 Breakfast',
    makan_siang: '☀️ Lunch',
    makan_malam: '🌙 Dinner',
    camilan: '🍡 Snack',
  }[food.category];

  return `
🍖 *Itsuki's Food Recommendation!* 🍖

${categoryLabel}:
${food.emoji} *${food.name}*

💬 _"${food.comment}"_

_Mou~ dont forget to eat properly, ne!_ 😤🍜
  `.trim();
}

module.exports = { getRandomFood, formatFoodRecommendation };
