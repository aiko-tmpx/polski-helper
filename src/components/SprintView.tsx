import React, { useState, useEffect, useCallback } from 'react';
import type { EndingType, PolishWord, UserStats, WordCategory } from '../types';
import { POLISH_WORDS } from '../data/words';
import { playSuccessSound, playErrorSound, triggerHaptic, speakPolish } from '../utils/audio';
import { recordWordResult } from '../utils/storage';
import { fireConfetti } from '../utils/confetti';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Filter, Sparkles } from 'lucide-react';

interface SprintViewProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  soundEnabled: boolean;
  filterWordIds?: string[];
  onClearFilter?: () => void;
}

const ENDING_OPTIONS: { ending: EndingType; keyNumber: string }[] = [
  { ending: '-y', keyNumber: '1' },
  { ending: '-i', keyNumber: '2' },
  { ending: '-e', keyNumber: '3' },
  { ending: '-ie', keyNumber: '4' },
  { ending: '-a', keyNumber: '5' },
];

export const SprintView: React.FC<SprintViewProps> = ({
  stats,
  setStats,
  soundEnabled,
  filterWordIds,
  onClearFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | 'all'>('all');

  // Filter pool of words
  const activePool = React.useMemo(() => {
    let pool = POLISH_WORDS;
    if (filterWordIds && filterWordIds.length > 0) {
      pool = pool.filter((w) => filterWordIds.includes(w.id));
      if (pool.length === 0) pool = POLISH_WORDS; // fallback
    } else if (selectedCategory !== 'all') {
      pool = pool.filter((w) => w.category === selectedCategory);
    }
    return pool;
  }, [filterWordIds, selectedCategory]);

  const getRandomWord = useCallback(
    (excludeId?: string): PolishWord => {
      const candidates = activePool.length > 1 
        ? activePool.filter((w) => w.id !== excludeId)
        : activePool;
      const index = Math.floor(Math.random() * candidates.length);
      return candidates[index] || activePool[0];
    },
    [activePool]
  );

  const [currentWord, setCurrentWord] = useState<PolishWord>(() => getRandomWord());
  const [selectedEnding, setSelectedEnding] = useState<EndingType | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showShake, setShowShake] = useState(false);

  // Sync current word if activePool changes (e.g. filter cleared or changed)
  useEffect(() => {
    if (!activePool.some((w) => w.id === currentWord.id)) {
      setCurrentWord(getRandomWord());
      setIsAnswered(false);
      setSelectedEnding(null);
    }
  }, [activePool, currentWord.id, getRandomWord]);

  const handleNextWord = useCallback(() => {
    setIsAnswered(false);
    setSelectedEnding(null);
    setShowShake(false);
    setCurrentWord(getRandomWord(currentWord.id));
  }, [currentWord.id, getRandomWord]);

  const handleSelectEnding = useCallback(
    (ending: EndingType) => {
      if (isAnswered) return;

      const correct = currentWord.correctEnding === ending;
      setSelectedEnding(ending);
      setIsAnswered(true);
      setIsCorrect(correct);

      // Update storage and stats
      const updated = recordWordResult(currentWord.id, currentWord.singular, correct, stats);
      setStats(updated);

      if (correct) {
        playSuccessSound(soundEnabled);
        triggerHaptic('success');
        if (updated.streak > 0 && updated.streak % 5 === 0) {
          fireConfetti();
        }
        // Auto-advance quickly on correct answers for fluid sprint rhythm
        const timer = setTimeout(() => {
          handleNextWord();
        }, 750);
        return () => clearTimeout(timer);
      } else {
        playErrorSound(soundEnabled);
        triggerHaptic('error');
        setShowShake(true);
      }
    },
    [isAnswered, currentWord, stats, setStats, soundEnabled, handleNextWord]
  );

  // Keyboard shortcut listener (1-5, Enter, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input, ignore
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (isAnswered) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextWord();
        }
        return;
      }

      switch (e.key) {
        case '1':
          handleSelectEnding('-y');
          break;
        case '2':
          handleSelectEnding('-i');
          break;
        case '3':
          handleSelectEnding('-e');
          break;
        case '4':
          handleSelectEnding('-ie');
          break;
        case '5':
          handleSelectEnding('-a');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleSelectEnding, handleNextWord]);

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakPolish(currentWord.singular);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 flex flex-col gap-4">
      {/* Category selector / Active filter indicator */}
      {filterWordIds && filterWordIds.length > 0 ? (
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-300">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Режим повторения ошибок ({filterWordIds.length} слов)</span>
          </div>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="text-xs font-semibold underline hover:text-amber-200"
            >
              Сбросить
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
            <Filter className="w-3.5 h-3.5" /> Раздел:
          </span>
          {[
            { id: 'all', label: 'Все слова' },
            { id: 'cafe_food', label: 'Кафе и еда' },
            { id: 'city_transport', label: 'Город' },
            { id: 'home_shopping', label: 'Дом и покупки' },
            { id: 'adjectives', label: 'Прилагательные' },
            { id: 'exceptions', label: 'Исключения' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as WordCategory | 'all');
                setIsAnswered(false);
                setSelectedEnding(null);
              }}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-700 text-white font-semibold shadow-sm'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Flashcard Card */}
      <div
        className={`relative bg-gradient-to-b from-slate-900 to-slate-900/90 border rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xl transition-all duration-300 ${
          showShake ? 'animate-shake' : ''
        } ${
          isAnswered
            ? isCorrect
              ? 'border-emerald-500/50 shadow-emerald-500/10'
              : 'border-rose-500/60 shadow-rose-500/10'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        {/* Gender / Type Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {currentWord.gender} род
          </span>
          {currentWord.ruleType === 'exception' && (
            <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Исключение
            </span>
          )}
        </div>

        {/* Word in Polish */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentWord.singular}
          </h2>
          <button
            onClick={handlePronounce}
            title="Прослушать произношение"
            className="p-2 rounded-full bg-slate-800/80 text-rose-400 hover:text-rose-300 hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Russian translation */}
        <p className="text-base sm:text-lg text-slate-400 font-medium mb-6">
          {currentWord.translation}
        </p>

        {/* Dynamic Plural Display upon answer */}
        {isAnswered && (
          <div
            className={`w-full py-3 px-4 rounded-2xl mb-2 flex items-center justify-center gap-2 text-lg sm:text-xl font-bold animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
            )}
            <span>
              {currentWord.singular} &rarr;{' '}
              <span className="underline decoration-2 underline-offset-4 font-black">
                {currentWord.plural}
              </span>
            </span>
          </div>
        )}

        {/* Hint when mistake made */}
        {isAnswered && !isCorrect && (
          <div className="w-full mt-3 p-3.5 rounded-2xl bg-slate-800/90 border border-rose-500/30 text-left animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 uppercase tracking-wide mb-1">
              <span>Правило для этого слова</span>
            </div>
            <p className="text-sm text-slate-200 leading-snug font-normal">
              {currentWord.ruleHint}
            </p>
            {currentWord.notes && (
              <p className="text-xs text-amber-300/90 mt-1 italic">
                {currentWord.notes}
              </p>
            )}
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleNextWord}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-md active:scale-95 transition-all"
              >
                <span>Понятно, дальше</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Endings Selection Buttons (5 Options) */}
      <div className="flex flex-col gap-2">
        <div className="text-center">
          <p className="text-xs text-slate-400 font-medium">
            Выберите окончание множественного числа:
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {ENDING_OPTIONS.map(({ ending, keyNumber }) => {
            const isThisEnding = selectedEnding === ending;
            const isRightEnding = currentWord.correctEnding === ending;

            let buttonStyle =
              'bg-slate-800/90 border-slate-700 text-slate-100 hover:border-slate-500 hover:bg-slate-750 active:scale-95';

            if (isAnswered) {
              if (isRightEnding) {
                buttonStyle =
                  'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 font-bold scale-[1.03] ring-2 ring-emerald-400/50';
              } else if (isThisEnding && !isCorrect) {
                buttonStyle =
                  'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/30 opacity-90';
              } else {
                buttonStyle = 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-40';
              }
            }

            return (
              <button
                key={ending}
                onClick={() => handleSelectEnding(ending)}
                disabled={isAnswered}
                className={`relative flex flex-col items-center justify-center py-4 sm:py-5 px-1 rounded-2xl border text-xl sm:text-2xl font-bold transition-all duration-200 select-none ${buttonStyle}`}
              >
                {/* Ending text */}
                <span className="tracking-tight">{ending}</span>

                {/* Keyboard hotkey hint badge */}
                <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 mt-1 opacity-75">
                  [{keyNumber}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Hotkey hint on desktop */}
        <p className="text-[11px] text-center text-slate-500 hidden sm:block mt-1">
          💡 Горячие клавиши на клавиатуре: цифры <kbd className="px-1 py-0.5 bg-slate-800 rounded">1</kbd>–<kbd className="px-1 py-0.5 bg-slate-800 rounded">5</kbd>, для перехода: <kbd className="px-1 py-0.5 bg-slate-800 rounded">Enter</kbd> или <kbd className="px-1 py-0.5 bg-slate-800 rounded">Пробел</kbd>
        </p>
      </div>

      {/* Manual Next Button (if answered and not advanced automatically) */}
      {isAnswered && (
        <div className="flex justify-center mt-1">
          <button
            onClick={handleNextWord}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 active:scale-95 transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Следующее слово</span>
          </button>
        </div>
      )}
    </div>
  );
};
