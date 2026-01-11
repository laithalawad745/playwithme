// app/data/snakesLaddersData.js

// 🎲 بيانات لعبة السلم والثعبان

// مواقع السلالم (من -> إلى)
export const LADDERS = [
  { from: 4, to: 14, color: '#10b981' },
  { from: 9, to: 31, color: '#3b82f6' },
  { from: 20, to: 38, color: '#8b5cf6' },
  { from: 28, to: 84, color: '#f59e0b' },
  { from: 40, to: 59, color: '#ec4899' },
  { from: 51, to: 67, color: '#14b8a6' },
  { from: 63, to: 81, color: '#6366f1' },
  { from: 71, to: 91, color: '#22c55e' }
];

// مواقع الثعابين (من -> إلى)
export const SNAKES = [
  { from: 17, to: 7, color: '#ef4444' },
  { from: 54, to: 34, color: '#f97316' },
  { from: 62, to: 19, color: '#dc2626' },
  { from: 64, to: 60, color: '#991b1b' },
  { from: 87, to: 36, color: '#b91c1c' },
  { from: 93, to: 73, color: '#7f1d1d' },
  { from: 95, to: 75, color: '#dc2626' },
  { from: 98, to: 79, color: '#ef4444' }
];

// الأسئلة حسب الفئات
export const QUESTIONS = {
  easy: [
    {
      id: 'easy_1',
      question: 'ما هي عاصمة فرنسا؟',
      answer: 'باريس',
      category: 'جغرافيا'
    },
    {
      id: 'easy_2',
      question: 'كم عدد أيام السنة؟',
      answer: '365 يوم',
      category: 'ثقافة عامة'
    },
    {
      id: 'easy_3',
      question: 'ما هو أكبر كوكب في المجموعة الشمسية؟',
      answer: 'المشتري',
      category: 'علوم'
    },
    {
      id: 'easy_4',
      question: 'من هو مؤسس شركة Apple؟',
      answer: 'ستيف جوبز',
      category: 'تكنولوجيا'
    },
    {
      id: 'easy_5',
      question: 'كم عدد قارات العالم؟',
      answer: '7 قارات',
      category: 'جغرافيا'
    },
    {
      id: 'easy_6',
      question: 'ما هي عاصمة مصر؟',
      answer: 'القاهرة',
      category: 'جغرافيا'
    },
    {
      id: 'easy_7',
      question: 'كم عدد لاعبي فريق كرة القدم؟',
      answer: '11 لاعب',
      category: 'رياضة'
    },
    {
      id: 'easy_8',
      question: 'ما هو لون السماء؟',
      answer: 'أزرق',
      category: 'ثقافة عامة'
    },
    {
      id: 'easy_9',
      question: 'كم عدد أشهر السنة؟',
      answer: '12 شهر',
      category: 'ثقافة عامة'
    },
    {
      id: 'easy_10',
      question: 'ما هي عاصمة السعودية؟',
      answer: 'الرياض',
      category: 'جغرافيا'
    }
  ],
  medium: [
    {
      id: 'medium_1',
      question: 'من هو مخترع الهاتف؟',
      answer: 'ألكسندر جراهام بيل',
      category: 'تاريخ'
    },
    {
      id: 'medium_2',
      question: 'ما هي أطول نهر في العالم؟',
      answer: 'نهر النيل',
      category: 'جغرافيا'
    },
    {
      id: 'medium_3',
      question: 'في أي عام وصل الإنسان إلى القمر؟',
      answer: '1969',
      category: 'تاريخ'
    },
    {
      id: 'medium_4',
      question: 'ما هو العنصر الكيميائي للذهب؟',
      answer: 'Au',
      category: 'علوم'
    },
    {
      id: 'medium_5',
      question: 'من كتب رواية الحرب والسلام؟',
      answer: 'ليو تولستوي',
      category: 'ثقافة عامة'
    },
    {
      id: 'medium_6',
      question: 'كم عدد عظام الإنسان البالغ؟',
      answer: '206 عظمة',
      category: 'علوم'
    },
    {
      id: 'medium_7',
      question: 'ما هي عاصمة اليابان؟',
      answer: 'طوكيو',
      category: 'جغرافيا'
    },
    {
      id: 'medium_8',
      question: 'من اخترع الكهرباء؟',
      answer: 'بنجامين فرانكلين',
      category: 'علوم'
    },
    {
      id: 'medium_9',
      question: 'ما هي أكبر دولة في العالم من حيث المساحة؟',
      answer: 'روسيا',
      category: 'جغرافيا'
    },
    {
      id: 'medium_10',
      question: 'في أي قارة تقع مصر؟',
      answer: 'أفريقيا',
      category: 'جغرافيا'
    }
  ],
  hard: [
    {
      id: 'hard_1',
      question: 'ما هو أعمق محيط في العالم؟',
      answer: 'المحيط الهادئ',
      category: 'جغرافيا'
    },
    {
      id: 'hard_2',
      question: 'من هو مؤلف نظرية النسبية؟',
      answer: 'ألبرت أينشتاين',
      category: 'علوم'
    },
    {
      id: 'hard_3',
      question: 'في أي عام سقط جدار برلين؟',
      answer: '1989',
      category: 'تاريخ'
    },
    {
      id: 'hard_4',
      question: 'ما هي أصغر دولة في العالم؟',
      answer: 'الفاتيكان',
      category: 'جغرافيا'
    },
    {
      id: 'hard_5',
      question: 'من رسم لوحة الموناليزا؟',
      answer: 'ليوناردو دافنشي',
      category: 'فن'
    },
    {
      id: 'hard_6',
      question: 'كم عدد الكروموسومات في الخلية البشرية؟',
      answer: '46 كروموسوم',
      category: 'علوم'
    },
    {
      id: 'hard_7',
      question: 'ما هي عاصمة أستراليا؟',
      answer: 'كانبرا',
      category: 'جغرافيا'
    },
    {
      id: 'hard_8',
      question: 'من هو أول رئيس للولايات المتحدة؟',
      answer: 'جورج واشنطن',
      category: 'تاريخ'
    },
    {
      id: 'hard_9',
      question: 'ما هي سرعة الضوء؟',
      answer: '300,000 كم/ثانية',
      category: 'علوم'
    },
    {
      id: 'hard_10',
      question: 'في أي عام بدأت الحرب العالمية الأولى؟',
      answer: '1914',
      category: 'تاريخ'
    }
  ]
};

// إعدادات اللعبة
export const GAME_CONFIG = {
  BOARD_SIZE: 100,
  BOARD_ROWS: 10,
  BOARD_COLS: 10,
  DICE_MIN: 1,
  DICE_MAX: 6,
  WIN_POSITION: 100,
  QUESTION_TIMEOUT: 30 // ثانية
};

// دالة للحصول على سؤال عشوائي
export const getRandomQuestion = (difficulty = 'easy') => {
  const questions = QUESTIONS[difficulty];
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

// دالة للتحقق من وجود سلم في المربع
export const getLadderAt = (position) => {
  return LADDERS.find(ladder => ladder.from === position);
};

// دالة للتحقق من وجود ثعبان في المربع
export const getSnakeAt = (position) => {
  return SNAKES.find(snake => snake.from === position);
};

// دالة لحساب موقع المربع على اللوحة (X, Y)
export const getPositionCoordinates = (position) => {
  const row = Math.floor((position - 1) / GAME_CONFIG.BOARD_COLS);
  const col = (position - 1) % GAME_CONFIG.BOARD_COLS;
  
  // الصفوف الزوجية تذهب من اليسار لليمين، الفردية من اليمين لليسار
  const isEvenRow = row % 2 === 0;
  const actualCol = isEvenRow ? col : (GAME_CONFIG.BOARD_COLS - 1 - col);
  
  return {
    row: GAME_CONFIG.BOARD_ROWS - 1 - row,
    col: actualCol
  };
};