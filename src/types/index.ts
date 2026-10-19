export type EndingType = '-y' | '-i' | '-e' | '-ie' | '-a';

export type WordCategory = 
  | 'cafe_food'     // Кафе и еда
  | 'city_transport'// Город и транспорт
  | 'home_shopping' // Дом и покупки
  | 'adjectives'    // Прилагательные
  | 'exceptions';   // Исключения

export type GrammarRuleType = 
  | 'adj_default'      // Прилагательное дефолт: -e
  | 'adj_kg'           // Прилагательное на k/g: -ie
  | 'noun_neuter'      // Существительное ср. род: -a
  | 'noun_soft'        // Существительное шипящие/мягкие: -e
  | 'noun_kg'          // Существительное на k/g: -i
  | 'noun_hard'        // Существительное твердые: -y
  | 'exception';       // Исключение

export interface PolishWord {
  id: string;
  singular: string;
  plural: string;
  stem: string;
  correctEnding: EndingType;
  ruleType: GrammarRuleType;
  category: WordCategory;
  translation: string;
  gender: 'жен.' | 'ср.' | 'муж.' | 'прил.' | 'искл.';
  ruleHint: string;
  notes?: string;
}

export interface PolishPhrase {
  id: string;
  adjectiveSingular: string;
  adjectivePlural: string;
  adjectiveEnding: '-e' | '-ie';
  adjectiveStem: string;
  adjectiveRuleHint: string;

  nounSingular: string;
  nounPlural: string;
  nounEnding: EndingType;
  nounStem: string;
  nounRuleHint: string;

  translation: string;
  fullPlural: string;
  category: WordCategory;
  isException?: boolean;
}

export interface UserStats {
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  mistakeHistory: Record<string, {
    wordId: string;
    mistakeCount: number;
    lastSeen: number;
    wordText: string;
  }>;
}

export type ActiveTab = 'sprint' | 'phrases' | 'words' | 'rules' | 'mistakes';
