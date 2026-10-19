export type AppTab = 'gender' | 'plural';

export type PluralSubMode = 'nouns' | 'adjectives' | 'phrases';

export type GrammaticalGender = 'męski' | 'żeński' | 'nijaki';

export interface GenderWord {
  id: string;
  word: string;
  translation: string;
  gender: GrammaticalGender;
  ruleExplanation: string;
}

export interface NounWord {
  id: string;
  singular: string;
  plural: string;
  correctEnding: '-y' | '-i' | '-e' | '-a';
  translation: string;
  ruleExplanation: string;
  isException?: boolean;
}

export interface AdjectiveWord {
  id: string;
  singular: string; // e.g. "nowy / nowa"
  plural: string;   // e.g. "nowe"
  correctEnding: '-e' | '-ie';
  translation: string;
  ruleExplanation: string;
}

export interface PhraseItem {
  id: string;
  adjSingular: string;
  adjEnding: '-e' | '-ie';
  adjExplanation: string;

  nounSingular: string;
  nounEnding: '-y' | '-i' | '-e' | '-a';
  nounExplanation: string;

  translation: string;
  fullPlural: string;
  isException?: boolean;
}

export interface AppStats {
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
}
