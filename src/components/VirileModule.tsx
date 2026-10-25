import React, { useState, useCallback, useEffect } from 'react';
import type { VirileNounWord } from '../types';
import { VIRILE_NOUNS_DATA } from '../data/virileWords';
import { speakPolish, playSuccessSound, playErrorSound } from '../utils/audio';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  Info,
} from 'lucide-react';

interface VirileModuleProps {
  onBackToMenu: () => void;
  onOpenRules: () => void;
}

const ENDING_OPTIONS: ('-i' | '-y' | '-e' | '-owie')[] = ['-i', '-y', '-e', '-owie'];

export const VirileModule: React.FC<VirileModuleProps> = ({
  onBackToMenu,
  onOpenRules,
}) => {
  const getRandomWord = useCallback((excludeId?: string): VirileNounWord => {
    const pool = VIRILE_NOUNS_DATA.filter((w) => w.id !== excludeId);
    return pool[Math.floor(Math.random() * pool.length)] || VIRILE_NOUNS_DATA[0];
  }, []);

  const [currentWord, setCurrentWord] = useState<VirileNounWord>(() => getRandomWord());
  const [selectedEnding, setSelectedEnding] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleNextWord = useCallback(() => {
    setIsAnswered(false);
    setSelectedEnding(null);
    setCurrentWord(getRandomWord(currentWord.id));
  }, [currentWord.id, getRandomWord]);

  const handleSelectEnding = useCallback(
    (ending: '-i' | '-y' | '-e' | '-owie') => {
      if (isAnswered) return;
      const correct = currentWord.correctEnding === ending;
      setSelectedEnding(ending);
      setIsAnswered(true);
      setIsCorrect(correct);
      if (correct) {
        playSuccessSound();
      } else {
        playErrorSound();
      }
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

      if (e.key === '1') handleSelectEnding('-i');
      if (e.key === '2') handleSelectEnding('-y');
      if (e.key === '3') handleSelectEnding('-e');
      if (e.key === '4') handleSelectEnding('-owie');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleNextWord, handleSelectEnding]);

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

      {/* Main Flashcard */}
      <div className="flex flex-col gap-5">
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
            Множественное число (oni / ci)
          </span>

          {/* Word + Audio */}
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {currentWord.singular}
            </h1>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakPolish(currentWord.singular);
              }}
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
                  {currentWord.singular} →{' '}
                  <span className="font-semibold">{currentWord.plural}</span>
                </span>
                {currentWord.alternation && (
                  <span className="text-xs font-mono opacity-80 pl-1 border-l border-current">
                    {currentWord.alternation}
                  </span>
                )}
              </div>

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

        {/* 4 Ending buttons */}
        <div className="grid grid-cols-4 gap-2.5">
          {ENDING_OPTIONS.map((ending, index) => {
            const isSelected = selectedEnding === ending;
            const isRight = currentWord.correctEnding === ending;

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
                key={ending}
                onClick={() => handleSelectEnding(ending)}
                disabled={isAnswered}
                className={`relative flex flex-col items-center justify-center py-5 sm:py-6 px-2 rounded-xl border transition-all text-center focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 active:scale-[0.98] ${btnState}`}
              >
                <kbd className="absolute top-2.5 right-2.5 min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-mono font-medium rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-xs select-none">
                  {index + 1}
                </kbd>
                <span className="text-xl sm:text-2xl font-semibold tracking-tight">{ending}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
