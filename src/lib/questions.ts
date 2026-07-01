export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number;
  emoji: string;
  points: number;
}

export const allQuestions: Question[] = [
  // ===== COUPLES & LOVE =====
  {
    id: 1, category: "love", emoji: "💕",
    question: "What is the most romantic thing a partner can do on a special anniversary?",
    options: ["Forget the date", "Plan a surprise dinner", "Send a text message", "Buy random flowers"],
    correct: 1, points: 10,
  },
  {
    id: 2, category: "love", emoji: "💌",
    question: "Which love language involves giving thoughtful gifts?",
    options: ["Words of Affirmation", "Quality Time", "Receiving Gifts", "Acts of Service"],
    correct: 2, points: 10,
  },
  {
    id: 3, category: "love", emoji: "🌹",
    question: "What does a red rose traditionally symbolize?",
    options: ["Friendship", "Deep romantic love", "Celebration", "Apology"],
    correct: 1, points: 10,
  },
  {
    id: 4, category: "love", emoji: "💑",
    question: "What is the key ingredient in a healthy relationship?",
    options: ["Money", "Trust and communication", "Fancy dates", "Social media posts"],
    correct: 1, points: 10,
  },
  {
    id: 5, category: "love", emoji: "🥂",
    question: "Which city is often called the 'City of Love'?",
    options: ["Rome", "Venice", "Paris", "Barcelona"],
    correct: 2, points: 10,
  },
  {
    id: 6, category: "love", emoji: "💍",
    question: "On which finger is an engagement ring traditionally worn?",
    options: ["Right index finger", "Left ring finger", "Right ring finger", "Left pinky finger"],
    correct: 1, points: 10,
  },
  {
    id: 7, category: "love", emoji: "🎵",
    question: "What makes a perfect romantic date night?",
    options: ["Watching TV separately", "A candlelit dinner with music", "Scrolling phones together", "Arguing about plans"],
    correct: 1, points: 10,
  },
  {
    id: 8, category: "love", emoji: "😍",
    question: "What is 'butterflies in your stomach' a sign of?",
    options: ["Bad food", "Nervousness or excitement around a crush", "Exercise", "Being cold"],
    correct: 1, points: 10,
  },
  // ===== ORTHODOX FAITH =====
  {
    id: 9, category: "faith", emoji: "✝️",
    question: "What is the Ethiopian Orthodox Church also known as?",
    options: ["Coptic Church", "Tewahedo Church", "Greek Orthodox", "Roman Catholic"],
    correct: 1, points: 15,
  },
  {
    id: 10, category: "faith", emoji: "📖",
    question: "What does 'Tewahedo' mean in Ge'ez?",
    options: ["Prayer", "Made One (Unity)", "Holy Light", "Blessed"],
    correct: 1, points: 15,
  },
  {
    id: 11, category: "faith", emoji: "🕯️",
    question: "What is the Ethiopian Orthodox fasting season called?",
    options: ["Ramadan", "Lent (Hudade Tsom)", "Advent", "Passover"],
    correct: 1, points: 15,
  },
  {
    id: 12, category: "faith", emoji: "⛪",
    question: "What is the most important celebration in Ethiopian Orthodox Christianity?",
    options: ["Meskel", "Timkat (Epiphany)", "Easter (Fasika)", "Christmas (Genna)"],
    correct: 2, points: 15,
  },
  {
    id: 13, category: "faith", emoji: "🌟",
    question: "What does 'Timkat' celebrate?",
    options: ["Birth of Jesus", "The Baptism of Jesus", "The Resurrection", "Finding the True Cross"],
    correct: 1, points: 15,
  },
  {
    id: 14, category: "faith", emoji: "🔥",
    question: "What does 'Meskel' celebrate?",
    options: ["Epiphany", "The finding of the True Cross", "Christmas", "Palm Sunday"],
    correct: 1, points: 15,
  },
  {
    id: 15, category: "faith", emoji: "🎼",
    question: "Who is credited with creating the Ethiopian Orthodox liturgical music system?",
    options: ["King Solomon", "Yared the Saint", "Lalibela", "Ezra"],
    correct: 1, points: 15,
  },
  {
    id: 16, category: "faith", emoji: "👑",
    question: "Which Ethiopian emperor is especially revered in the Orthodox Church?",
    options: ["Menelik I", "Lalibela", "Haile Selassie", "All of them"],
    correct: 3, points: 15,
  },
  // ===== ETHIOPIA CULTURE & HISTORY =====
  {
    id: 17, category: "culture", emoji: "🇪🇹",
    question: "What is the capital city of Ethiopia?",
    options: ["Nairobi", "Addis Ababa", "Asmara", "Mekelle"],
    correct: 1, points: 10,
  },
  {
    id: 18, category: "culture", emoji: "☕",
    question: "Ethiopia is famous for being the birthplace of which drink?",
    options: ["Tea", "Coffee", "Cocoa", "Wine"],
    correct: 1, points: 10,
  },
  {
    id: 19, category: "culture", emoji: "🍞",
    question: "What is the traditional Ethiopian flatbread called?",
    options: ["Chapati", "Injera", "Pita", "Naan"],
    correct: 1, points: 10,
  },
  {
    id: 20, category: "culture", emoji: "🏃",
    question: "Ethiopia is world-famous for producing elite athletes in which sport?",
    options: ["Football", "Basketball", "Long-distance running", "Swimming"],
    correct: 2, points: 10,
  },
  {
    id: 21, category: "culture", emoji: "🏔️",
    question: "What is the highest mountain in Ethiopia?",
    options: ["Mount Kenya", "Ras Dashen", "Mount Kilimanjaro", "Mount Elgon"],
    correct: 1, points: 10,
  },
  {
    id: 22, category: "culture", emoji: "🦁",
    question: "What animal appears on the Ethiopian flag?",
    options: ["Eagle", "Lion of Judah", "Elephant", "Horse"],
    correct: 1, points: 10,
  },
  {
    id: 23, category: "culture", emoji: "📅",
    question: "How many months are in the Ethiopian calendar?",
    options: ["12", "13", "14", "11"],
    correct: 1, points: 10,
  },
  {
    id: 24, category: "culture", emoji: "🎶",
    question: "What is 'Eskista'?",
    options: ["Ethiopian food", "Traditional Ethiopian dance", "A religious song", "A city name"],
    correct: 1, points: 10,
  },
  // ===== FUN & TRIVIA =====
  {
    id: 25, category: "fun", emoji: "🎯",
    question: "How many colors are in a rainbow?",
    options: ["5", "6", "7", "8"],
    correct: 2, points: 10,
  },
  {
    id: 26, category: "fun", emoji: "🌍",
    question: "Which is the largest continent in the world?",
    options: ["Africa", "Asia", "Europe", "North America"],
    correct: 1, points: 10,
  },
  {
    id: 27, category: "fun", emoji: "🌙",
    question: "What causes a lunar eclipse?",
    options: ["The moon covering the sun", "The Earth blocking sunlight from reaching the moon", "Clouds covering the moon", "The moon moving away from Earth"],
    correct: 1, points: 10,
  },
  {
    id: 28, category: "fun", emoji: "🐘",
    question: "Which animal has the longest memory?",
    options: ["Dolphin", "Elephant", "Chimpanzee", "Crow"],
    correct: 1, points: 10,
  },
  {
    id: 29, category: "fun", emoji: "🎸",
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correct: 2, points: 10,
  },
  {
    id: 30, category: "fun", emoji: "🌊",
    question: "What percentage of the Earth's surface is covered by water?",
    options: ["50%", "60%", "71%", "80%"],
    correct: 2, points: 10,
  },
  // ===== RELATIONSHIP WISDOM =====
  {
    id: 31, category: "wisdom", emoji: "🧠",
    question: "According to relationship experts, what resolves most conflicts in a couple?",
    options: ["Winning the argument", "Active listening and empathy", "Silence", "Giving the silent treatment"],
    correct: 1, points: 15,
  },
  {
    id: 32, category: "wisdom", emoji: "🌺",
    question: "What does it mean to 'love someone unconditionally'?",
    options: ["Love them only when they are perfect", "Love them regardless of flaws or mistakes", "Love them when they give gifts", "Love them only on good days"],
    correct: 1, points: 15,
  },
  {
    id: 33, category: "wisdom", emoji: "🙏",
    question: "Why is prayer important in an Orthodox Christian relationship?",
    options: ["It is not important", "It unites the couple spiritually and with God", "Only for fasting", "Just for church visits"],
    correct: 1, points: 15,
  },
  {
    id: 34, category: "wisdom", emoji: "⚖️",
    question: "What is the foundation of a strong marriage in the Orthodox Christian tradition?",
    options: ["Wealth", "Love, faith, and mutual respect", "Family approval only", "Physical attraction"],
    correct: 1, points: 15,
  },
  {
    id: 35, category: "wisdom", emoji: "🌻",
    question: "How can a couple keep their relationship exciting over time?",
    options: ["Stop trying after a while", "Continuously dating each other and trying new things", "Never communicating feelings", "Working constantly without breaks"],
    correct: 1, points: 15,
  },
  // ===== SCIENCE & NATURE =====
  {
    id: 36, category: "science", emoji: "🔬",
    question: "What gas do plants absorb during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    correct: 2, points: 10,
  },
  {
    id: 37, category: "science", emoji: "⚡",
    question: "What is the speed of light approximately?",
    options: ["300 km/s", "3,000 km/s", "300,000 km/s", "3,000,000 km/s"],
    correct: 2, points: 10,
  },
  {
    id: 38, category: "science", emoji: "🧬",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"],
    correct: 2, points: 10,
  },
  {
    id: 39, category: "science", emoji: "🌿",
    question: "What do you call an animal that eats both plants and meat?",
    options: ["Herbivore", "Carnivore", "Omnivore", "Insectivore"],
    correct: 2, points: 10,
  },
  {
    id: 40, category: "science", emoji: "🌡️",
    question: "At what temperature does water boil at sea level?",
    options: ["90°C", "95°C", "100°C", "110°C"],
    correct: 2, points: 10,
  },
  // ===== FAMOUS COUPLES & STORIES =====
  {
    id: 41, category: "stories", emoji: "📚",
    question: "Which famous pair is known as 'Romeo and ___'?",
    options: ["Juliet", "Rosalind", "Helena", "Maria"],
    correct: 0, points: 10,
  },
  {
    id: 42, category: "stories", emoji: "🦋",
    question: "In the Bible, who asked for the hand of Rachel and worked 14 years for her?",
    options: ["Abraham", "Isaac", "Jacob", "David"],
    correct: 2, points: 15,
  },
  {
    id: 43, category: "stories", emoji: "⭐",
    question: "Which queen from Ethiopia visited King Solomon according to the Bible?",
    options: ["Queen Nefertiti", "Queen of Sheba", "Queen Esther", "Queen Cleopatra"],
    correct: 1, points: 15,
  },
  {
    id: 44, category: "stories", emoji: "🏰",
    question: "What is the name of Ethiopia's famous rock-hewn churches built by King Lalibela?",
    options: ["Axum Churches", "Lalibela Churches", "Gondar Castles", "Blue Nile Temples"],
    correct: 1, points: 15,
  },
  // ===== FOOD & LIFE =====
  {
    id: 45, category: "lifestyle", emoji: "🍽️",
    question: "What is 'Shiro' in Ethiopian cuisine?",
    options: ["A meat dish", "A chickpea/bean powder stew", "A type of bread", "A dessert"],
    correct: 1, points: 10,
  },
  {
    id: 46, category: "lifestyle", emoji: "🎉",
    question: "What is a traditional Ethiopian coffee ceremony called?",
    options: ["Jebena Buna", "Chai Party", "Coffee Kaffe", "Buna Qala"],
    correct: 0, points: 10,
  },
  {
    id: 47, category: "lifestyle", emoji: "💃",
    question: "What color is most commonly associated with joy and celebration in Ethiopia?",
    options: ["Blue", "Green", "Red and Gold", "White"],
    correct: 2, points: 10,
  },
  {
    id: 48, category: "lifestyle", emoji: "🌈",
    question: "What is the Ethiopian New Year called?",
    options: ["Genna", "Enkutatash", "Timkat", "Meskel"],
    correct: 1, points: 10,
  },
  {
    id: 49, category: "lifestyle", emoji: "🤝",
    question: "How do close friends typically greet each other in Ethiopia?",
    options: ["Handshake only", "Three cheek-to-cheek kisses", "Bow deeply", "High five"],
    correct: 1, points: 10,
  },
  {
    id: 50, category: "lifestyle", emoji: "🏡",
    question: "What is the traditional Ethiopian round house called?",
    options: ["Injera house", "Tukul", "Habesha hut", "Round mud house"],
    correct: 1, points: 10,
  },
];

export const categories = [
  { id: "mixed", label: "Mix of Everything 🎲", emoji: "🎲" },
  { id: "love", label: "Love & Romance 💕", emoji: "💕" },
  { id: "faith", label: "Orthodox Faith ✝️", emoji: "✝️" },
  { id: "culture", label: "Ethiopian Culture 🇪🇹", emoji: "🇪🇹" },
  { id: "fun", label: "Fun Trivia 🎯", emoji: "🎯" },
  { id: "wisdom", label: "Relationship Wisdom 🧠", emoji: "🧠" },
];

export function getQuestionsForGame(category: string, count: number = 10): Question[] {
  let pool: Question[];
  if (category === "mixed") {
    pool = allQuestions;
  } else {
    pool = allQuestions.filter((q) => q.category === category);
    if (pool.length < count) pool = allQuestions;
  }
  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
