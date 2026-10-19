import React, { useState, useCallback, useEffect } from 'react';
import type { EndingType, PolishPhrase, UserStats } from '../types';
import { POLISH_PHRASES } from '../data/words';
import { playSuccessSound, playErrorSound, triggerHaptic, speakPolish } from '../utils/audio';
import { recordWordResult } from '../utils/storage';
import { fireConfetti } from '../utils/confetti';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface PhrasesViewProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  soundEnabled: boolean;
}

const ADJ_OPTIONS: ('-e' | '-ie')[] = ['-e', '-ie'];
const NOUN_OPTIONS: EndingType[] = ['-y', '-i', '-e', '-a'];

export const PhrasesView: React.FC<PhrasesViewProps> = ({ stats, setStats, soundEnabled }) => {
  const getRandomPhrase = useCallback((excludeId?: string): PolishPhrase => {
    const candidates = POLISH_PHRASES.length > 1
      ? POLISH_PHRASES.filter((p) => p.id !== excludeId)
      : POLISH_PHRASES;
    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index] || POLISH_PHRASES[0];
  }, []);

  const [currentPhrase, setCurrentPhrase] = useState<PolishPhrase>(() => getRandomPhrase());
  const [selectedAdjEnding, setSelectedAdjEnding] = useState<'-e' | '-ie' | null>(null);
  const [selectedNounEnding, setSelectedNounEnding] = useState<EndingType | null>(null);

  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showShake, setShowShake] = useState(false);

  const handleNextPhrase = useCallback(() => {
    setIsAnswered(false);
    setSelectedAdjEnding(null);
    setSelectedNounEnding(null);
    setShowShake(false);
    setCurrentPhrase(getRandomPhrase(currentPhrase.id));
  }, [currentPhrase.id, getRandomPhrase]);

  const verifyAnswer = useCallback(
    (adjEnding: '-e' | '-ie', nounEnding: EndingType) => {
      const adjCorrect = currentPhrase.adjectiveEnding === adjEnding;
      const nounCorrect = currentPhrase.nounEnding === nounEnding;
      const bothCorrect = adjCorrect && nounCorrect;

      setIsAnswered(true);
      setIsCorrect(bothCorrect);

      const updated = recordWordResult(
        currentPhrase.id,
        `${currentPhrase.adjectiveSingular} ${currentPhrase.nounSingular}`,
        bothCorrect,
        stats
      );
      setStats(updated);

      if (bothCorrect) {
        playSuccessSound(soundEnabled);
        triggerHaptic('success');
        if (updated.streak > 0 && updated.streak % 5 === 0) {
          fireConfetti();
        }
        const timer = setTimeout(() => {
          handleNextPhrase();
        }, 1100);
        return () => clearTimeout(timer);
      } else {
        playErrorSound(soundEnabled);
        triggerHaptic('error');
        setShowShake(true);
      }
    },
    [currentPhrase, stats, setStats, soundEnabled, handleNextPhrase]
  );

  const handleSelectAdj = (ending: '-e' | '-ie') => {
    if (isAnswered) return;
    triggerHaptic('click');
    setSelectedAdjEnding(ending);
    if (selectedNounEnding) {
      verifyAnswer(ending, selectedNounEnding);
    }
  };

  const handleSelectNoun = (ending: EndingType) => {
    if (isAnswered) return;
    triggerHaptic('click');
    setSelectedNounEnding(ending);
    if (selectedAdjEnding) {
      verifyAnswer(selectedAdjEnding, ending);
    }
  };

  // Keyboard support: Enter / Space to go next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight')) {
        e.preventDefault();
        handleNextPhrase();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleNextPhrase]);

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakPolish(
      isAnswered
        ? currentPhrase.fullPlural
        : `${currentPhrase.adjectiveSingular} ${currentPhrase.nounSingular}`
    );
  };

  const isAdjRight = isAnswered && selectedAdjEnding === currentPhrase.adjectiveEnding;
  const isNounRight = isAnswered && selectedNounEnding === currentPhrase.nounEnding;

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 flex flex-col gap-4">
      {/* Description header */}
      <div className="text-center">
        <h2 className="text-sm sm:text-base font-semibold text-slate-300">
          Режим словосочетаний: Прилагательное + Существительное
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Подберите правильные окончания для обоих слов во мн. числе
        </p>
      </div>

      {/* Main Flashcard */}
      <div
        className={`relative bg-gradient-to-b from-slate-900 to-slate-900/90 border rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-center text-center shadow-xl transition-all duration-300 ${
          showShake ? 'animate-shake' : ''
        } ${
          isAnswered
            ? isCorrect
              ? 'border-emerald-500/50 shadow-emerald-500/10'
              : 'border-rose-500/60 shadow-rose-500/10'
            : 'border-slate-800'
        }`}
      >
        {/* Singular phrase */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Ед. число
          </span>
          {currentPhrase.isException && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Исключение
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 my-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currentPhrase.adjectiveSingular} {currentPhrase.nounSingular}
          </h3>
          <button
            onClick={handlePronounce}
            title="Прослушать произношение"
            className="p-2 rounded-full bg-slate-800 text-rose-400 hover:text-rose-300 active:scale-95 transition-all"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm sm:text-base text-slate-400 font-medium mb-4">
          {currentPhrase.translation}
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
              {currentPhrase.adjectiveSingular} {currentPhrase.nounSingular} &rarr;{' '}
              <span className="underline decoration-2 underline-offset-4 font-black">
                {currentPhrase.fullPlural}
              </span>
            </span>
          </div>
        )}

        {/* Granular Rules Explanation on Mistake */}
        {isAnswered && !isCorrect && (
          <div className="w-full mt-3 p-3.5 rounded-2xl bg-slate-800/90 border border-rose-500/30 text-left animate-fadeIn space-y-2">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide block">
              Разбор правила:
            </span>

            {/* Adjective Rule */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs">
              <span className="font-semibold text-slate-200">
                1. Прилагательное ({currentPhrase.adjectivePlural}):
              </span>
              <p className="text-slate-300 mt-0.5">{currentPhrase.adjectiveRuleHint}</p>
            </div>

            {/* Noun Rule */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs">
              <span className="font-semibold text-slate-200">
                2. Существительное ({currentPhrase.nounPlural}):
              </span>
              <p className="text-slate-300 mt-0.5">{currentPhrase.nounRuleHint}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextPhrase}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-md active:scale-95 transition-all"
              >
                <span>Дальше</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Ending Selectors */}
      <div className="flex flex-col gap-3">
        {/* Row 1: Adjective Endings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-2">
            <span>
              1. Окончание для <strong className="text-rose-400">{currentPhrase.adjectiveStem}...</strong> (прил.):
            </span>
            {selectedAdjEnding && (
              <span className="text-emerald-400 font-bold">Выбрано: {selectedAdjEnding}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ADJ_OPTIONS.map((ending) => {
              const isSelected = selectedAdjEnding === ending;
              let style = 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-750';

              if (isSelected) {
                style = 'bg-rose-500 text-white border-rose-400 ring-2 ring-rose-400/40 font-bold';
              }
              if (isAnswered) {
                if (currentPhrase.adjectiveEnding === ending) {
                  style =
                    'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/50 font-bold';
                } else if (isSelected && !isAdjRight) {
                  style = 'bg-rose-600 text-white border-rose-400 opacity-90';
                } else {
                  style = 'bg-slate-900/60 text-slate-600 border-slate-800 opacity-40';
                }
              }

              return (
                <button
                  key={ending}
                  onClick={() => handleSelectAdj(ending)}
                  disabled={isAnswered}
                  className={`py-3 px-2 rounded-xl border text-lg font-bold transition-all active:scale-95 ${style}`}
                >
                  {ending}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Noun Endings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-2">
            <span>
              2. Окончание для <strong className="text-sky-400">{currentPhrase.nounStem}...</strong> (сущ.):
            </span>
            {selectedNounEnding && (
              <span className="text-emerald-400 font-bold">Выбрано: {selectedNounEnding}</span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {NOUN_OPTIONS.map((ending) => {
              const isSelected = selectedNounEnding === ending;
              let style = 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-750';

              if (isSelected) {
                style = 'bg-sky-500 text-white border-sky-400 ring-2 ring-sky-400/40 font-bold';
              }
              if (isAnswered) {
                if (currentPhrase.nounEnding === ending) {
                  style =
                    'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/50 font-bold';
                } else if (isSelected && !isNounRight) {
                  style = 'bg-rose-600 text-white border-rose-400 opacity-90';
                } else {
                  style = 'bg-slate-900/60 text-slate-600 border-slate-800 opacity-40';
                }
              }

              return (
                <button
                  key={ending}
                  onClick={() => handleSelectNoun(ending)}
                  disabled={isAnswered}
                  className={`py-3 px-2 rounded-xl border text-lg font-bold transition-all active:scale-95 ${style}`}
                >
                  {ending}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Manual Next Button */}
      {isAnswered && (
        <div className="flex justify-center mt-2">
          <button
            onClick={handleNextPhrase}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 active:scale-95 transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Следующее словосочетание</span>
          </button>
        </div>
      )}
    </div>
  );
};
