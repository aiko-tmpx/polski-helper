import React, { useState, useCallback, useEffect } from 'react';
import type { GenderWord, GrammaticalGender } from '../types';
import { GENDER_WORDS } from '../data/genderWords';
import { speakPolish } from '../utils/audio';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  Info,
} from 'lucide-react';

interface GenderModuleProps {
  onBackToMenu: () => void;
  onOpenRules: () => void;
}

interface GenderOptionConfig {
  id: GrammaticalGender;
  label: string;
  pronoun: string;
  hotkey: string;
  mnemonicColor: string;
}

const GENDER_OPTIONS: GenderOptionConfig[] = [
  {
    id: 'męski',
    label: 'Мужской',
    pronoun: 'ten',
    hotkey: '1',
    mnemonicColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'żeński',
    label: 'Женский',
    pronoun: 'ta',
    hotkey: '2',
    mnemonicColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'nijaki',
    label: 'Средний',
    pronoun: 'to',
    hotkey: '3',
    mnemonicColor: 'text-amber-600 dark:text-amber-400',
  },
];

export const GenderModule: React.FC<GenderModuleProps> = ({
  onBackToMenu,
  onOpenRules,
}) => {
  const getRandomWord = useCallback((excludeId?: string): GenderWord => {
    const pool = GENDER_WORDS.filter((w) => w.id !== excludeId);
    return pool[Math.floor(Math.random() * pool.length)] || GENDER_WORDS[0];
  }, []);

  const [currentWord, setCurrentWord] = useState<GenderWord>(() => getRandomWord());
  const [selectedGender, setSelectedGender] = useState<GrammaticalGender | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleNextWord = useCallback(() => {
    setIsAnswered(false);
    setSelectedGender(null);
    setCurrentWord(getRandomWord(currentWord.id));
  }, [currentWord.id, getRandomWord]);

  const handleSelectGender = useCallback(
    (gender: GrammaticalGender) => {
      if (isAnswered) return;
      const correct = currentWord.gender === gender;
      setSelectedGender(gender);
      setIsAnswered(true);
      setIsCorrect(correct);
    },
    [isAnswered, currentWord]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextWord();
        }
        return;
      }

      if (e.key === '1') handleSelectGender('męski');
      if (e.key === '2') handleSelectGender('żeński');
      if (e.key === '3') handleSelectGender('nijaki');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleSelectGender, handleNextWord]);

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakPolish(currentWord.word);
  };

  const getGenderLabel = (g: GrammaticalGender) => {
    if (g === 'męski') return 'Мужской род (ten)';
    if (g === 'żeński') return 'Женский род (ta)';
    return 'Средний род (to)';
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col gap-6 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>В меню</span>
        </button>

        <button
          onClick={onOpenRules}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} />
          <span>Правило</span>
        </button>
      </div>

      {/* Main Card */}
      <div
        className={`bg-white dark:bg-zinc-900/60 border rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center transition-colors ${
          isAnswered
            ? isCorrect
              ? 'border-emerald-500/40 dark:border-emerald-500/30'
              : 'border-rose-500/40 dark:border-rose-500/30'
            : 'border-zinc-200 dark:border-zinc-800'
        }`}
      >
        <span className="text-[11px] uppercase tracking-wider font-medium text-zinc-400 dark:text-zinc-500 mb-2">
          Определите род слова
        </span>

        {/* Word + Audio */}
        <div className="flex items-center justify-center gap-2.5 mb-1.5">
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {currentWord.word}
          </h1>
          <button
            onClick={handlePronounce}
            title="Прослушать произношение"
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Volume2 className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Translation */}
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-6">
          {currentWord.translation}
        </p>

        {/* Feedback State */}
        {isAnswered && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            {/* Status chip */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                isCorrect
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.75} />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" strokeWidth={1.75} />
              )}
              <span>
                {currentWord.word} → {getGenderLabel(currentWord.gender)}
              </span>
            </div>

            {/* Explanation on mistake */}
            {!isCorrect && (
              <div className="w-full text-left p-3.5 rounded-r-lg border-l-2 border-rose-500/70 bg-rose-500/5 dark:bg-rose-500/10 space-y-1.5 mt-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                  <Info className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                  <span>Правило</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                  {currentWord.detail}
                </p>
                <div className="pt-0.5">
                  <button
                    onClick={onOpenRules}
                    className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline transition-colors"
                  >
                    Посмотреть полное правило →
                  </button>
                </div>
              </div>
            )}

            {/* Next Word Button */}
            <div className="mt-3 flex flex-col items-center gap-1">
              <button
                onClick={handleNextWord}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-sm font-medium transition-colors shadow-xs active:scale-98"
              >
                <span>Дальше</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                Пробел или Enter
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-3 gap-2.5">
        {GENDER_OPTIONS.map(({ id, label, pronoun, hotkey, mnemonicColor }) => {
          const isSelected = selectedGender === id;
          const isRight = currentWord.gender === id;

          let btnState =
            'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-100';

          if (isAnswered) {
            if (isRight) {
              btnState =
                'border-emerald-500/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200';
            } else if (isSelected && !isCorrect) {
              btnState =
                'border-rose-500/60 bg-rose-500/10 text-rose-950 dark:text-rose-200';
            } else {
              btnState =
                'border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 opacity-40';
            }
          }

          return (
            <button
              key={id}
              onClick={() => handleSelectGender(id)}
              disabled={isAnswered}
              className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all text-center focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 active:scale-[0.98] ${btnState}`}
            >
              {/* Hotkey badge Linear-style */}
              <kbd className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-mono rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 leading-none">
                {hotkey}
              </kbd>

              <span className="text-sm sm:text-base font-semibold">{label}</span>
              <span className={`text-xs font-mono mt-0.5 ${mnemonicColor}`}>
                {pronoun}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
