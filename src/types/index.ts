export type ScreenState =
  | 'menu'
  | 'train-gender'
  | 'train-plural-nouns'
  | 'train-plural-adj'
  | 'train-plural-phrases'
  | 'rules-gender'
  | 'rules-plural';

export type PluralSubMode = 'nouns' | 'adjectives' | 'phrases';

export type RulesMode = 'short' | 'long';

export type GrammaticalGender = 'męski' | 'żeński' | 'nijaki';

export interface GenderWord {
  id: string;
  word: string;
  translation: string;
  gender: GrammaticalGender;
  ruleExplanation: string;
  detail: string;
}

export interface NounWord {
  id: string;
  singular: string;
  plural: string;
  correctEnding: '-y' | '-i' | '-e' | '-a';
  translation: string;
  ruleExplanation: string;
  detail: string;
  isException?: boolean;
}

export interface AdjectiveWord {
  id: string;
  singular: string;
  plural: string;
  correctEnding: '-e' | '-ie';
  translation: string;
  ruleExplanation: string;
  detail: string;
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
