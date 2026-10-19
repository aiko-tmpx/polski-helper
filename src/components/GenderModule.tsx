import React, { useState, useCallback, useEffect } from 'react';
import type { AppStats, GenderWord, GrammaticalGender } from '../types';
import { GENDER_WORDS, GENDER_RULES_SUMMARY } from '../data/genderWords';
import { playSuccessSound, playErrorSound, triggerHaptic, speakPolish } from '../utils/audio';
import { recordAnswer } from '../utils/storage';
import { Volume2, CheckCircle2, XCircle, ArrowRight, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface GenderModuleProps {
  stats: AppStats;
  setStats: React.Dispatch<React.SetStateAction<AppStats>>;
  soundEnabled: boolean;
}

const GENDER_OPTIONS: { id: GrammaticalGender; label: string; subLabel: string; hotkey: string }[] = [
  { id: 'męski', label: 'Мужской', subLabel: 'Męski', hotkey: '1' },
  { id: 'żeński', label: 'Женский', subLabel: 'Żeński', hotkey: '2' },
  { id: 'nijaki', label: 'Средний', subLabel: 'Nijaki', hotkey: '3' },
];

export const GenderModule: React.FC<GenderModuleProps> = ({ stats, setStats, soundEnabled }) => {
  const getRandomWord = useCallback((excludeId?: string): GenderWord => {
    const pool = GENDER_WORDS.filter((w) => w.id !== excludeId);
    return pool[Math.floor(Math.random() * pool.length)] || GENDER_WORDS[0];
  }, []);

  const [currentWord, setCurrentWord] = useState<GenderWord>(() => getRandomWord());
  const [selectedGender, setSelectedGender] = useState<GrammaticalGender | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);

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

  // Keyboard navigation: 1, 2, 3 for choices; Enter / Space for Next
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
    <div className="w-full max-w-lg mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Title & Dictionary toggle */}
      <div className="flex items-center justify-between border-b border-dark-700/60 pb-2.5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Определение рода
          </h2>
          <p className="text-xs text-dark-400">
            Męski, Żeński или Nijaki?
          </p>
        </div>

        <button
          onClick={() => setShowDictionary((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 text-dark-200 border border-dark-700 hover:bg-dark-700 text-xs font-medium transition-all"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Словарь и правила</span>
          {showDictionary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible Dictionary and Rules for THIS Task */}
      {showDictionary && (
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-4 text-xs space-y-4 animate-fadeIn">
          <div>
            <h3 className="font-bold text-white mb-2">Правила рода в польском языке:</h3>
            <div className="space-y-2">
              {GENDER_RULES_SUMMARY.map((r) => (
                <div key={r.gender} className="p-2.5 rounded-xl bg-dark-850 border border-dark-800">
                  <div className="font-semibold text-white">{r.gender}</div>
                  <div className="text-dark-300 mt-0.5">{r.rule}</div>
                  <div className="text-dark-400 font-mono text-[11px] mt-1">Примеры: {r.examples}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Слова этого модуля ({GENDER_WORDS.length}):</h3>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {GENDER_WORDS.map((w) => (
                <div key={w.id} className="p-2 rounded-lg bg-dark-850 border border-dark-800 text-[11px]">
                  <span className="font-bold text-white">{w.word}</span>{' '}
                  <span className="text-dark-400">({w.translation})</span>
                  <div className="text-dark-400 text-[10px] uppercase font-mono mt-0.5">{w.gender}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Flashcard */}
      <div
        onClick={() => {
          if (isAnswered) handleNextWord();
        }}
        className={`relative bg-dark-900 border rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all ${
          isAnswered
            ? isCorrect
              ? 'border-emerald-500/60 bg-dark-850'
              : 'border-rose-500/60 bg-dark-850'
            : 'border-dark-700'
        } ${isAnswered ? 'cursor-pointer' : ''}`}
      >
        {/* Polish word */}
        <div className="flex items-center justify-center gap-3 mb-1">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {currentWord.word}
          </h1>
          <button
            onClick={handlePronounce}
            title="Прослушать произношение"
            className="p-1.5 rounded-lg bg-dark-800 text-dark-300 hover:text-white active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Translation */}
        <p className="text-sm sm:text-base text-dark-300 font-medium mb-6">
          {currentWord.translation}
        </p>

        {/* Result state */}
        {isAnswered && (
          <div className="w-full flex flex-col items-center gap-2 animate-fadeIn">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold ${
                isCorrect
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>
                {currentWord.word} &rarr;{' '}
                <span className="uppercase tracking-wider">
                  {currentWord.gender === 'męski'
                    ? 'Мужской (Męski)'
                    : currentWord.gender === 'żeński'
                    ? 'Женский (Żeński)'
                    : 'Средний (Nijaki)'}
                </span>
              </span>
            </div>

            {/* Explanation on mistake */}
            {!isCorrect && (
              <p className="text-xs text-dark-300 bg-dark-800 p-2.5 rounded-xl border border-dark-700 text-left w-full mt-1">
                {currentWord.ruleExplanation}
              </p>
            )}

            {/* Tap/Click to continue indicator */}
            <div className="mt-3 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextWord();
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-dark-200 active:scale-95 transition-all shadow-md"
              >
                <span>Дальше</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-dark-500 mt-1">
              Нажмите «Дальше», кликните по карточке или нажмите Пробел
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-3 gap-2.5">
        {GENDER_OPTIONS.map(({ id, label, subLabel, hotkey }) => {
          const isSelected = selectedGender === id;
          const isRight = currentWord.gender === id;

          let btnClass =
            'bg-dark-900 border-dark-700 text-dark-100 hover:bg-dark-800 hover:border-dark-600 active:scale-95';

          if (isAnswered) {
            if (isRight) {
              btnClass =
                'bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-500/40';
            } else if (isSelected && !isCorrect) {
              btnClass = 'bg-rose-600 border-rose-400 text-white font-bold';
            } else {
              btnClass = 'bg-dark-950 border-dark-800 text-dark-500 opacity-40';
            }
          }

          return (
            <button
              key={id}
              onClick={() => handleSelectGender(id)}
              disabled={isAnswered}
              className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl border transition-all ${btnClass}`}
            >
              <span className="text-sm sm:text-base font-bold">{label}</span>
              <span className="text-[11px] text-dark-400 font-mono mt-0.5">{subLabel}</span>
              <span className="text-[10px] text-dark-500 font-mono mt-1 hidden sm:inline">[{hotkey}]</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
