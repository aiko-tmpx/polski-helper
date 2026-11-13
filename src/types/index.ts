export type ScreenState =
  | 'menu'
  | 'auth'
  | 'train-gender'
  | 'train-plural-nouns'
  | 'train-plural-adj'
  | 'train-plural-phrases'
  | 'train-virile-nouns'
  | 'rules-gender'
  | 'rules-plural'
  | 'rules-virile';

export type PluralSubMode = 'nouns' | 'adjectives' | 'phrases';

export type RulesMode = 'short' | 'long';

export type GrammaticalGender = 'męski' | 'żeński' | 'nijaki';

export interface UserWord {
  id: string;
  user_id: string;
  word: string;
  translation: string;
  notes?: string | null;
  interval_days: number;
  repetition_count: number;
  ease_factor: number;
  next_review_at: string;
  created_at: string;
}

export interface VirileNounWord {
  id: string;
  singular: string;
  plural: string;
  correctEnding: '-i' | '-y' | '-e' | '-owie';
  translation: string;
  ruleExplanation: string;
  detail: string;
  alternation?: string;
  isException?: boolean;
}

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
