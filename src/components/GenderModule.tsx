import React, { useState, useCallback, useEffect } from 'react';
import type { AppStats, GenderWord, GrammaticalGender } from '../types';
import { GENDER_WORDS } from '../data/genderWords';
import { playSuccessSound, playErrorSound, triggerHaptic, speakPolish } from '../utils/audio';
import { recordAnswer } from '../utils/storage';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  Flame,
  Info,
} from 'lucide-react';

interface GenderModuleProps {
  stats: AppStats;
  setStats: React.Dispatch<React.SetStateAction<AppStats>>;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onOpenRules: () => void;
}

const GENDER_OPTIONS: {
  id: GrammaticalGender;
  icon: string;
  label: string;
  subLabel: string;
  pronoun: string;
  hotkey: string;
  colorBorder: string;
}[] = [
  {
    id: 'męski',
    icon: '🟦',
    label: 'Мужской',
    subLabel: 'Męski',
    pronoun: 'ten',
    hotkey: '1',
    colorBorder: 'border-sky-500/40 hover:border-sky-400',
  },
  {
    id: 'żeński',
    icon: '🟪',
    label: 'Женский',
    subLabel: 'Żeński',
    pronoun: 'ta',
    hotkey: '2',
    colorBorder: 'border-rose-500/40 hover:border-rose-400',
  },
  {
    id: 'nijaki',
    icon: '🟨',
    label: 'Средний',
    subLabel: 'Nijaki',
    pronoun: 'to',
    hotkey: '3',
    colorBorder: 'border-amber-500/40 hover:border-amber-400',
  },
];

export const GenderModule: React.FC<GenderModuleProps> = ({
  stats,
  setStats,
  soundEnabled,
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

      const updated = recordAnswer(correct, stats);
      setStats(updated);

      if (correct) {
        playSuccessSound(soundEnabled);
        triggerHaptic('success');
      } else {
        playErrorSound(soundEnabled);
        triggerHaptic('error');
      }
    },
    [isAnswered, currentWord, stats, setStats, soundEnabled]
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

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col gap-5 animate-fadeIn">
      {/* Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-dark-700/80">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-850 border border-dark-700 text-dark-200 hover:text-white hover:bg-dark-800 text-sm font-semibold active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>В меню</span>
        </button>

        {/* Streak */}
        <div className="flex items-center gap-1.5 bg-dark-850 border border-dark-700/80 rounded-full px-3 py-1 text-xs font-bold text-amber-400">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{stats.streak}</span>
        </div>

        {/* Rules button */}
        <button
          onClick={onOpenRules}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 border border-dark-700 text-dark-200 hover:text-white hover:bg-dark-800 text-sm font-semibold active:scale-95 transition-all"
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>Правило</span>
        </button>
      </div>

      {/* Main Flashcard */}
      <div
        className={`relative bg-dark-850 border rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center transition-all ${
          isAnswered
            ? isCorrect
              ? 'border-emerald-500/50 shadow-sm'
              : 'border-rose-500/50 shadow-sm'
            : 'border-dark-700'
        }`}
      >
        <span className="text-xs uppercase tracking-wider font-extrabold text-dark-400 mb-2">
          Определите род слова:
        </span>

        {/* Polish word - BIG font */}
        <div className="flex items-center justify-center gap-3.5 mb-2">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {currentWord.word}
          </h1>
          <button
            onClick={handlePronounce}
            title="Прослушать произношение"
            className="p-2 rounded-xl bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-750 active:scale-95 transition-all"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Translation - BIG font */}
        <p className="text-lg sm:text-xl text-dark-300 font-medium mb-6">
          {currentWord.translation}
        </p>

        {/* Result state */}
        {isAnswered && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            <div
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-base font-bold ${
                isCorrect
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400" />
              )}
              <span>
                {currentWord.word} &rarr;{' '}
                <span className="underline decoration-2">
                  {currentWord.gender === 'męski'
                    ? 'Мужской род (ten / męski)'
                    : currentWord.gender === 'żeński'
                    ? 'Женский род (ta / żeński)'
                    : 'Средний род (to / nijaki)'}
                </span>
              </span>
            </div>

            {/* Detailed Explanation on mistake */}
            {!isCorrect && (
              <div className="w-full text-left p-4 rounded-2xl bg-dark-800 border border-dark-700 space-y-2 mt-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-white">
                  <Info className="w-4 h-4 text-rose-400" />
                  <span>Почему этот род?</span>
                </div>
                <p className="text-sm sm:text-base text-dark-200 leading-relaxed font-normal">
                  {currentWord.detail}
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRules();
                    }}
                    className="text-xs text-white underline font-semibold hover:text-dark-200"
                  >
                    Посмотреть полное правило &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Next Word Button */}
            <div className="mt-3 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextWord();
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-black text-sm hover:bg-dark-200 active:scale-95 transition-all shadow-md"
              >
                <span>Следующее слово</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-dark-400 mt-0.5">
              или нажмите клавишу Пробел / Enter
            </p>
          </div>
        )}
      </div>

      {/* 3 Answer Buttons - with Icons and Colors */}
      <div className="grid grid-cols-3 gap-3">
        {GENDER_OPTIONS.map(({ id, icon, label, subLabel, pronoun, hotkey, colorBorder }) => {
          const isSelected = selectedGender === id;
          const isRight = currentWord.gender === id;

          let btnClass = `bg-dark-850 border ${colorBorder} text-dark-100 hover:bg-dark-800 active:scale-95`;

          if (isAnswered) {
            if (isRight) {
              btnClass =
                'bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-500/30';
            } else if (isSelected && !isCorrect) {
              btnClass = 'bg-rose-600 border-rose-400 text-white font-bold';
            } else {
              btnClass = 'bg-dark-900 border-dark-800 text-dark-500 opacity-30';
            }
          }

          return (
            <button
              key={id}
              onClick={() => handleSelectGender(id)}
              disabled={isAnswered}
              className={`flex flex-col items-center justify-center py-5 px-2 rounded-2xl transition-all ${btnClass}`}
            >
              <span className="text-lg mb-1">{icon}</span>
              <span className="text-base sm:text-lg font-black">{label}</span>
              <span className="text-xs text-dark-300 font-mono mt-0.5">[{pronoun}] {subLabel}</span>
              <span className="text-[11px] text-dark-500 font-mono mt-1 hidden sm:inline">[{hotkey}]</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
