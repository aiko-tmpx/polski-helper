import React, { useState, useCallback, useEffect } from 'react';
import type { PluralSubMode, NounWord, AdjectiveWord, PhraseItem } from '../types';
import {
  NOUNS_DATA,
  ADJECTIVES_DATA,
  PHRASES_DATA,
} from '../data/pluralWords';
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

interface PluralModuleProps {
  initialSubMode?: PluralSubMode;
  onBackToMenu: () => void;
  onOpenRules: () => void;
}

const SUBMODES: { id: PluralSubMode; label: string }[] = [
  { id: 'nouns', label: 'Существительные' },
  { id: 'adjectives', label: 'Прилагательные' },
  { id: 'phrases', label: 'Словосочетания' },
];

export const PluralModule: React.FC<PluralModuleProps> = ({
  initialSubMode = 'nouns',
  onBackToMenu,
  onOpenRules,
}) => {
  const [subMode, setSubMode] = useState<PluralSubMode>(initialSubMode);

  // --- Submode 1: Nouns state ---
  const getRandomNoun = useCallback((excludeId?: string): NounWord => {
    const pool = NOUNS_DATA.filter((n) => n.id !== excludeId);
    return pool[Math.floor(Math.random() * pool.length)] || NOUNS_DATA[0];
  }, []);
  const [currentNoun, setCurrentNoun] = useState<NounWord>(() => getRandomNoun());
  const [selectedNounEnding, setSelectedNounEnding] = useState<string | null>(null);
  const [isNounAnswered, setIsNounAnswered] = useState(false);
  const [isNounCorrect, setIsNounCorrect] = useState(false);

  // --- Submode 2: Adjectives state ---
  const getRandomAdj = useCallback((excludeId?: string): AdjectiveWord => {
    const pool = ADJECTIVES_DATA.filter((a) => a.id !== excludeId);
    return pool[Math.floor(Math.random() * pool.length)] || ADJECTIVES_DATA[0];
  }, []);
  const [currentAdj, setCurrentAdj] = useState<AdjectiveWord>(() => getRandomAdj());
  const [selectedAdjEnding, setSelectedAdjEnding] = useState<string | null>(null);
  const [isAdjAnswered, setIsAdjAnswered] = useState(false);
  const [isAdjCorrect, setIsAdjCorrect] = useState(false);

  // --- Submode 3: Phrases state ---
  const getRandomPhrase = useCallback((excludeId?: string): PhraseItem => {
    const pool = PHRASES_DATA.filter((p) => p.id !== excludeId);
    return pool[Math.floor(Math.random() * pool.length)] || PHRASES_DATA[0];
  }, []);
  const [currentPhrase, setCurrentPhrase] = useState<PhraseItem>(() => getRandomPhrase());
  const [phraseAdjPick, setPhraseAdjPick] = useState<'-e' | '-ie' | null>(null);
  const [phraseNounPick, setPhraseNounPick] = useState<string | null>(null);
  const [isPhraseAnswered, setIsPhraseAnswered] = useState(false);
  const [isPhraseCorrect, setIsPhraseCorrect] = useState(false);

  // Next handlers
  const handleNextNoun = useCallback(() => {
    setIsNounAnswered(false);
    setSelectedNounEnding(null);
    setCurrentNoun(getRandomNoun(currentNoun.id));
  }, [currentNoun.id, getRandomNoun]);

  const handleNextAdj = useCallback(() => {
    setIsAdjAnswered(false);
    setSelectedAdjEnding(null);
    setCurrentAdj(getRandomAdj(currentAdj.id));
  }, [currentAdj.id, getRandomAdj]);

  const handleNextPhrase = useCallback(() => {
    setIsPhraseAnswered(false);
    setPhraseAdjPick(null);
    setPhraseNounPick(null);
    setCurrentPhrase(getRandomPhrase(currentPhrase.id));
  }, [currentPhrase.id, getRandomPhrase]);

  // Answer handlers
  const handleSelectNounEnding = useCallback(
    (ending: '-y' | '-i' | '-e' | '-a') => {
      if (isNounAnswered) return;
      const correct = currentNoun.correctEnding === ending;
      setSelectedNounEnding(ending);
      setIsNounAnswered(true);
      setIsNounCorrect(correct);
    },
    [isNounAnswered, currentNoun]
  );

  const handleSelectAdjEnding = useCallback(
    (ending: '-e' | '-ie') => {
      if (isAdjAnswered) return;
      const correct = currentAdj.correctEnding === ending;
      setSelectedAdjEnding(ending);
      setIsAdjAnswered(true);
      setIsAdjCorrect(correct);
    },
    [isAdjAnswered, currentAdj]
  );

  const checkPhraseAnswer = useCallback(
    (adjEnding: '-e' | '-ie', nounEnding: string) => {
      const correct =
        currentPhrase.adjEnding === adjEnding && currentPhrase.nounEnding === nounEnding;
      setIsPhraseAnswered(true);
      setIsPhraseCorrect(correct);
    },
    [currentPhrase]
  );

  const handlePickPhraseAdj = (ending: '-e' | '-ie') => {
    if (isPhraseAnswered) return;
    setPhraseAdjPick(ending);
    if (phraseNounPick) {
      checkPhraseAnswer(ending, phraseNounPick);
    }
  };

  const handlePickPhraseNoun = (ending: '-y' | '-i' | '-e' | '-a') => {
    if (isPhraseAnswered) return;
    setPhraseNounPick(ending);
    if (phraseAdjPick) {
      checkPhraseAnswer(phraseAdjPick, ending);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (subMode === 'nouns') {
        if (isNounAnswered) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
            e.preventDefault();
            handleNextNoun();
          }
          return;
        }
        if (e.key === '1') handleSelectNounEnding('-y');
        if (e.key === '2') handleSelectNounEnding('-i');
        if (e.key === '3') handleSelectNounEnding('-e');
        if (e.key === '4') handleSelectNounEnding('-a');
      } else if (subMode === 'adjectives') {
        if (isAdjAnswered) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
            e.preventDefault();
            handleNextAdj();
          }
          return;
        }
        if (e.key === '1') handleSelectAdjEnding('-e');
        if (e.key === '2') handleSelectAdjEnding('-ie');
      } else if (subMode === 'phrases') {
        if (isPhraseAnswered) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
            e.preventDefault();
            handleNextPhrase();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    subMode,
    isNounAnswered,
    isAdjAnswered,
    isPhraseAnswered,
    handleNextNoun,
    handleNextAdj,
    handleNextPhrase,
    handleSelectNounEnding,
    handleSelectAdjEnding,
  ]);

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

      {/* Submode Switcher Tabs */}
      <div className="grid grid-cols-3 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
        {SUBMODES.map((item) => (
          <button
            key={item.id}
            onClick={() => setSubMode(item.id)}
            className={`py-1.5 px-2 rounded-md transition-all text-center ${
              subMode === item.id
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 1. NOUNS SUBMODE */}
      {/* ========================================================= */}
      {subMode === 'nouns' && (
        <div className="flex flex-col gap-5">
          <div
            className={`bg-white dark:bg-zinc-900/60 border rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center transition-colors ${
              isNounAnswered
                ? isNounCorrect
                  ? 'border-emerald-500/40 dark:border-emerald-500/30'
                  : 'border-rose-500/40 dark:border-rose-500/30'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <span className="text-[11px] uppercase tracking-wider font-medium text-zinc-400 dark:text-zinc-500 mb-2">
              Окончание множественного числа
            </span>

            {/* Word + Audio */}
            <div className="flex items-center justify-center gap-2.5 mb-1.5">
              <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {currentNoun.singular}
              </h1>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakPolish(currentNoun.singular);
                }}
                title="Прослушать произношение"
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Volume2 className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* Translation */}
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-6">
              {currentNoun.translation}
            </p>

            {/* Feedback State */}
            {isNounAnswered && (
              <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    isNounCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {isNounCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.75} />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" strokeWidth={1.75} />
                  )}
                  <span>
                    {currentNoun.singular} →{' '}
                    <span className="font-semibold">{currentNoun.plural}</span>
                  </span>
                </div>

                {!isNounCorrect && (
                  <div className="w-full text-left p-3.5 rounded-r-lg border-l-2 border-rose-500/70 bg-rose-500/5 dark:bg-rose-500/10 space-y-1.5 mt-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                      <Info className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                      <span>Правило</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                      {currentNoun.detail}
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
                    onClick={handleNextNoun}
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

          {/* 4 Noun buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { ending: '-y' as const, label: 'твердые' },
              { ending: '-i' as const, label: 'после k, g' },
              { ending: '-e' as const, label: 'мягк / шип' },
              { ending: '-a' as const, label: 'ср. род' },
            ].map(({ ending, label }, index) => {
              const isSelected = selectedNounEnding === ending;
              const isRight = currentNoun.correctEnding === ending;

              let btnState =
                'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-100';

              if (isNounAnswered) {
                if (isRight) {
                  btnState =
                    'border-emerald-500/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200';
                } else if (isSelected && !isNounCorrect) {
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
                  onClick={() => handleSelectNounEnding(ending)}
                  disabled={isNounAnswered}
                  className={`relative flex flex-col items-center justify-center py-4 px-1 rounded-xl border transition-all text-center focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 active:scale-[0.98] ${btnState}`}
                >
                  <kbd className="absolute top-2 right-2 px-1 py-0.5 text-[9px] font-mono rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 leading-none">
                    {index + 1}
                  </kbd>
                  <span className="text-lg sm:text-xl font-semibold">{ending}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5 hidden sm:inline">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ADJECTIVES SUBMODE */}
      {/* ========================================================= */}
      {subMode === 'adjectives' && (
        <div className="flex flex-col gap-5">
          <div
            className={`bg-white dark:bg-zinc-900/60 border rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center transition-colors ${
              isAdjAnswered
                ? isAdjCorrect
                  ? 'border-emerald-500/40 dark:border-emerald-500/30'
                  : 'border-rose-500/40 dark:border-rose-500/30'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <span className="text-[11px] uppercase tracking-wider font-medium text-zinc-400 dark:text-zinc-500 mb-2">
              Окончание прилагательного (мн. число)
            </span>

            {/* Word + Audio */}
            <div className="flex items-center justify-center gap-2.5 mb-1.5">
              <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {currentAdj.singular}
              </h1>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakPolish(currentAdj.singular);
                }}
                title="Прослушать произношение"
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Volume2 className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* Translation */}
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-6">
              {currentAdj.translation}
            </p>

            {/* Feedback State */}
            {isAdjAnswered && (
              <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    isAdjCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {isAdjCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.75} />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" strokeWidth={1.75} />
                  )}
                  <span>
                    {currentAdj.singular} →{' '}
                    <span className="font-semibold">{currentAdj.plural}</span>
                  </span>
                </div>

                {!isAdjCorrect && (
                  <div className="w-full text-left p-3.5 rounded-r-lg border-l-2 border-rose-500/70 bg-rose-500/5 dark:bg-rose-500/10 space-y-1.5 mt-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                      <Info className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                      <span>Правило</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                      {currentAdj.detail}
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
                    onClick={handleNextAdj}
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

          {/* 2 Adjective buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { ending: '-e' as const, label: 'основное окончание (дефолт)' },
              { ending: '-ie' as const, label: 'после k и g' },
            ].map(({ ending, label }, index) => {
              const isSelected = selectedAdjEnding === ending;
              const isRight = currentAdj.correctEnding === ending;

              let btnState =
                'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-100';

              if (isAdjAnswered) {
                if (isRight) {
                  btnState =
                    'border-emerald-500/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200';
                } else if (isSelected && !isAdjCorrect) {
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
                  onClick={() => handleSelectAdjEnding(ending)}
                  disabled={isAdjAnswered}
                  className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all text-center focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 active:scale-[0.98] ${btnState}`}
                >
                  <kbd className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-mono rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-855 text-zinc-500 dark:text-zinc-400 leading-none">
                    {index + 1}
                  </kbd>
                  <span className="text-xl font-semibold">{ending}</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PHRASES (TOGETHER) SUBMODE */}
      {/* ========================================================= */}
      {subMode === 'phrases' && (
        <div className="flex flex-col gap-5">
          <div
            className={`bg-white dark:bg-zinc-900/60 border rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center transition-colors ${
              isPhraseAnswered
                ? isPhraseCorrect
                  ? 'border-emerald-500/40 dark:border-emerald-500/30'
                  : 'border-rose-500/40 dark:border-rose-500/30'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <span className="text-[11px] uppercase tracking-wider font-medium text-zinc-400 dark:text-zinc-500 mb-2">
              Словосочетание (прилагательное + существительное)
            </span>

            {/* Word + Audio */}
            <div className="flex items-center justify-center gap-2.5 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {currentPhrase.adjSingular} {currentPhrase.nounSingular}
              </h1>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakPolish(
                    isPhraseAnswered
                      ? currentPhrase.fullPlural
                      : `${currentPhrase.adjSingular} ${currentPhrase.nounSingular}`
                  );
                }}
                title="Прослушать произношение"
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Volume2 className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* Translation */}
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-6">
              {currentPhrase.translation}
            </p>

            {/* Feedback State */}
            {isPhraseAnswered && (
              <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    isPhraseCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {isPhraseCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.75} />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" strokeWidth={1.75} />
                  )}
                  <span>{currentPhrase.fullPlural}</span>
                </div>

                {!isPhraseCorrect && (
                  <div className="w-full text-left p-3.5 rounded-r-lg border-l-2 border-rose-500/70 bg-rose-500/5 dark:bg-rose-500/10 space-y-1.5 mt-1 text-xs sm:text-sm">
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">Прилагательное: </span>
                      <span className="text-zinc-700 dark:text-zinc-300">{currentPhrase.adjExplanation}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">Существительное: </span>
                      <span className="text-zinc-700 dark:text-zinc-300">{currentPhrase.nounExplanation}</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-col items-center gap-1">
                  <button
                    onClick={handleNextPhrase}
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

          {/* Dual Pickers */}
          <div className="space-y-3">
            {/* Pick 1: Adjective */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5">
              <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
                <span>1. Прилагательное ({currentPhrase.adjSingular}):</span>
                {phraseAdjPick && (
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{phraseAdjPick}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['-e', '-ie'] as const).map((ending) => {
                  const isPicked = phraseAdjPick === ending;
                  let style =
                    'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800';

                  if (isPicked) {
                    style =
                      'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold';
                  }

                  if (isPhraseAnswered) {
                    if (currentPhrase.adjEnding === ending) {
                      style =
                        'border-emerald-500/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-semibold';
                    } else if (isPicked) {
                      style =
                        'border-rose-500/60 bg-rose-500/10 text-rose-950 dark:text-rose-200 font-semibold';
                    } else {
                      style = 'opacity-40 border-zinc-200 dark:border-zinc-800 text-zinc-400';
                    }
                  }

                  return (
                    <button
                      key={ending}
                      onClick={() => handlePickPhraseAdj(ending)}
                      disabled={isPhraseAnswered}
                      className={`py-2.5 rounded-lg text-base font-medium border transition-all active:scale-[0.98] ${style}`}
                    >
                      {ending}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pick 2: Noun */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5">
              <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
                <span>2. Существительное ({currentPhrase.nounSingular}):</span>
                {phraseNounPick && (
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{phraseNounPick}</span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['-y', '-i', '-e', '-a'] as const).map((ending) => {
                  const isPicked = phraseNounPick === ending;
                  let style =
                    'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800';

                  if (isPicked) {
                    style =
                      'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold';
                  }

                  if (isPhraseAnswered) {
                    if (currentPhrase.nounEnding === ending) {
                      style =
                        'border-emerald-500/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-semibold';
                    } else if (isPicked) {
                      style =
                        'border-rose-500/60 bg-rose-500/10 text-rose-950 dark:text-rose-200 font-semibold';
                    } else {
                      style = 'opacity-40 border-zinc-200 dark:border-zinc-800 text-zinc-400';
                    }
                  }

                  return (
                    <button
                      key={ending}
                      onClick={() => handlePickPhraseNoun(ending)}
                      disabled={isPhraseAnswered}
                      className={`py-2.5 rounded-lg text-base font-medium border transition-all active:scale-[0.98] ${style}`}
                    >
                      {ending}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
