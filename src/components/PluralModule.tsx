import React, { useState, useCallback, useEffect } from 'react';
import type { AppStats, PluralSubMode, NounWord, AdjectiveWord, PhraseItem } from '../types';
import {
  NOUNS_DATA,
  ADJECTIVES_DATA,
  PHRASES_DATA,
} from '../data/pluralWords';
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

interface PluralModuleProps {
  initialSubMode?: PluralSubMode;
  stats: AppStats;
  setStats: React.Dispatch<React.SetStateAction<AppStats>>;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onOpenRules: () => void;
}

export const PluralModule: React.FC<PluralModuleProps> = ({
  initialSubMode = 'nouns',
  stats,
  setStats,
  soundEnabled,
  onBackToMenu,
  onOpenRules,
}) => {
  const [subMode, setSubMode] = useState<PluralSubMode>(initialSubMode);

  // Sync initialSubMode if changed externally
  useEffect(() => {
    setSubMode(initialSubMode);
  }, [initialSubMode]);

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
    [isNounAnswered, currentNoun, stats, setStats, soundEnabled]
  );

  const handleSelectAdjEnding = useCallback(
    (ending: '-e' | '-ie') => {
      if (isAdjAnswered) return;
      const correct = currentAdj.correctEnding === ending;
      setSelectedAdjEnding(ending);
      setIsAdjAnswered(true);
      setIsAdjCorrect(correct);

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
    [isAdjAnswered, currentAdj, stats, setStats, soundEnabled]
  );

  const checkPhraseAnswer = useCallback(
    (adjEnding: '-e' | '-ie', nounEnding: string) => {
      const correct =
        currentPhrase.adjEnding === adjEnding && currentPhrase.nounEnding === nounEnding;
      setIsPhraseAnswered(true);
      setIsPhraseCorrect(correct);

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
    [currentPhrase, stats, setStats, soundEnabled]
  );

  const handlePickPhraseAdj = (ending: '-e' | '-ie') => {
    if (isPhraseAnswered) return;
    triggerHaptic('click');
    setPhraseAdjPick(ending);
    if (phraseNounPick) {
      checkPhraseAnswer(ending, phraseNounPick);
    }
  };

  const handlePickPhraseNoun = (ending: '-y' | '-i' | '-e' | '-a') => {
    if (isPhraseAnswered) return;
    triggerHaptic('click');
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
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Правило</span>
        </button>
      </div>

      {/* Submode Switcher */}
      <div className="grid grid-cols-3 gap-1 bg-dark-850 border border-dark-700 p-1 rounded-2xl text-xs font-bold">
        {(
          [
            { id: 'nouns', label: '📦 Существительные' },
            { id: 'adjectives', label: '🎨 Прилагательные' },
            { id: 'phrases', label: '🔗 Словосочетания' },
          ] as { id: PluralSubMode; label: string }[]
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => setSubMode(item.id)}
            className={`py-2 px-1 rounded-xl transition-all text-center whitespace-nowrap ${
              subMode === item.id
                ? 'bg-white text-black shadow-sm font-black'
                : 'text-dark-400 hover:text-white'
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
        <div className="flex flex-col gap-4">
          <div
            className={`relative bg-dark-850 border rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center transition-all ${
              isNounAnswered
                ? isNounCorrect
                  ? 'border-emerald-500/50 shadow-sm'
                  : 'border-rose-500/50 shadow-sm'
                : 'border-dark-700'
            }`}
          >
            <span className="text-xs uppercase tracking-wider font-extrabold text-dark-400 mb-2">
              Окончание множественного числа
            </span>

            {/* Word - BIG font */}
            <div className="flex items-center justify-center gap-3.5 mb-2">
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {currentNoun.singular}
              </h1>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakPolish(currentNoun.singular);
                }}
                className="p-2 rounded-xl bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-750 active:scale-95 transition-all"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Translation - BIG font */}
            <p className="text-lg sm:text-xl text-dark-300 font-medium mb-6">
              {currentNoun.translation}
            </p>

            {/* Result State */}
            {isNounAnswered && (
              <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
                <div
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-base sm:text-lg font-bold ${
                    isNounCorrect
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {isNounCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span>
                    {currentNoun.singular} &rarr;{' '}
                    <span className="underline decoration-2 font-black">{currentNoun.plural}</span>
                  </span>
                </div>

                {/* Detailed Explanation on mistake */}
                {!isNounCorrect && (
                  <div className="w-full text-left p-4 rounded-2xl bg-dark-800 border border-dark-700 space-y-2 mt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-white">
                      <Info className="w-4 h-4 text-rose-400" />
                      <span>Разбор правила:</span>
                    </div>
                    <p className="text-sm sm:text-base text-dark-200 leading-relaxed font-normal">
                      {currentNoun.detail}
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

                {/* Next Button */}
                <div className="mt-3 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextNoun();
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

          {/* 4 Noun buttons: -y, -i, -e, -a with clear color badges */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { ending: '-y' as const, label: 'твердые', colorBorder: 'border-sky-500/40 hover:border-sky-400' },
              { ending: '-i' as const, label: 'на k/g', colorBorder: 'border-purple-500/40 hover:border-purple-400' },
              { ending: '-e' as const, label: 'мягк/шип', colorBorder: 'border-emerald-500/40 hover:border-emerald-400' },
              { ending: '-a' as const, label: 'ср. род', colorBorder: 'border-amber-500/40 hover:border-amber-400' },
            ].map(({ ending, label, colorBorder }, index) => {
              const isSelected = selectedNounEnding === ending;
              const isRight = currentNoun.correctEnding === ending;

              let btnClass = `bg-dark-850 border ${colorBorder} text-dark-100 hover:bg-dark-800 active:scale-95`;

              if (isNounAnswered) {
                if (isRight) {
                  btnClass =
                    'bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-500/30';
                } else if (isSelected && !isNounCorrect) {
                  btnClass = 'bg-rose-600 border-rose-400 text-white font-bold';
                } else {
                  btnClass = 'bg-dark-900 border-dark-800 text-dark-500 opacity-30';
                }
              }

              return (
                <button
                  key={ending}
                  onClick={() => handleSelectNounEnding(ending)}
                  disabled={isNounAnswered}
                  className={`flex flex-col items-center justify-center py-4 sm:py-5 px-1 rounded-2xl border transition-all ${btnClass}`}
                >
                  <span className="text-2xl font-black">{ending}</span>
                  <span className="text-[10px] text-dark-400 font-mono mt-0.5 hidden sm:inline">{label}</span>
                  <span className="text-[10px] text-dark-500 font-mono mt-0.5">[{index + 1}]</span>
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
        <div className="flex flex-col gap-4">
          <div
            className={`relative bg-dark-850 border rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center transition-all ${
              isAdjAnswered
                ? isAdjCorrect
                  ? 'border-emerald-500/50 shadow-sm'
                  : 'border-rose-500/50 shadow-sm'
                : 'border-dark-700'
            }`}
          >
            <span className="text-xs uppercase tracking-wider font-extrabold text-dark-400 mb-2">
              Окончание прилагательного (мн. число)
            </span>

            {/* Word - BIG font */}
            <div className="flex items-center justify-center gap-3.5 mb-2">
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {currentAdj.singular}
              </h1>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakPolish(currentAdj.singular);
                }}
                className="p-2 rounded-xl bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-750 active:scale-95 transition-all"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Translation - BIG font */}
            <p className="text-lg sm:text-xl text-dark-300 font-medium mb-6">
              {currentAdj.translation}
            </p>

            {/* Result State */}
            {isAdjAnswered && (
              <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
                <div
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-base font-bold ${
                    isAdjCorrect
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {isAdjCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span>
                    {currentAdj.singular} &rarr;{' '}
                    <span className="underline decoration-2 font-black">{currentAdj.plural}</span>
                  </span>
                </div>

                {/* Detailed Explanation on mistake */}
                {!isAdjCorrect && (
                  <div className="w-full text-left p-4 rounded-2xl bg-dark-800 border border-dark-700 space-y-2 mt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-white">
                      <Info className="w-4 h-4 text-rose-400" />
                      <span>Разбор правила:</span>
                    </div>
                    <p className="text-sm sm:text-base text-dark-200 leading-relaxed font-normal">
                      {currentAdj.detail}
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

                {/* Next Button */}
                <div className="mt-3 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextAdj();
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

          {/* 2 Adjective buttons: -e vs -ie */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { ending: '-e' as const, label: 'обычная основа (дефолт)', border: 'border-emerald-500/40 hover:border-emerald-400' },
              { ending: '-ie' as const, label: 'после корней на k и g', border: 'border-rose-500/40 hover:border-rose-400' },
            ].map(({ ending, label, border }, index) => {
              const isSelected = selectedAdjEnding === ending;
              const isRight = currentAdj.correctEnding === ending;

              let btnClass = `bg-dark-850 border ${border} text-dark-100 hover:bg-dark-800 active:scale-95`;

              if (isAdjAnswered) {
                if (isRight) {
                  btnClass =
                    'bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-500/30';
                } else if (isSelected && !isAdjCorrect) {
                  btnClass = 'bg-rose-600 border-rose-400 text-white font-bold';
                } else {
                  btnClass = 'bg-dark-900 border-dark-800 text-dark-500 opacity-30';
                }
              }

              return (
                <button
                  key={ending}
                  onClick={() => handleSelectAdjEnding(ending)}
                  disabled={isAdjAnswered}
                  className={`flex flex-col items-center justify-center py-5 px-2 rounded-2xl border transition-all ${btnClass}`}
                >
                  <span className="text-2xl font-black">{ending}</span>
                  <span className="text-xs text-dark-300 font-mono mt-0.5">{label}</span>
                  <span className="text-[11px] text-dark-500 font-mono mt-1 hidden sm:inline">[{index + 1}]</span>
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
        <div className="flex flex-col gap-4">
          <div
            className={`relative bg-dark-850 border rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all ${
              isPhraseAnswered
                ? isPhraseCorrect
                  ? 'border-emerald-500/50 shadow-sm'
                  : 'border-rose-500/50 shadow-sm'
                : 'border-dark-700'
            }`}
          >
            <span className="text-xs uppercase tracking-wider font-extrabold text-dark-400 mb-2">
              Словосочетание (прил. + сущ.)
            </span>

            {/* Phrase - BIG font */}
            <div className="flex items-center justify-center gap-3.5 mb-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
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
                className="p-2 rounded-xl bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-750 active:scale-95 transition-all"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-base sm:text-lg text-dark-300 font-medium mb-4">
              {currentPhrase.translation}
            </p>

            {/* Result State */}
            {isPhraseAnswered && (
              <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
                <div
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-base sm:text-lg font-bold ${
                    isPhraseCorrect
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {isPhraseCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span>{currentPhrase.fullPlural}</span>
                </div>

                {!isPhraseCorrect && (
                  <div className="w-full text-left p-4 rounded-2xl bg-dark-800 border border-dark-700 space-y-1.5 text-sm sm:text-base">
                    <div>
                      <strong className="text-white">1. Прилагательное:</strong> {currentPhrase.adjExplanation}
                    </div>
                    <div>
                      <strong className="text-white">2. Существительное:</strong> {currentPhrase.nounExplanation}
                    </div>
                  </div>
                )}

                {/* Next Button */}
                <div className="mt-3 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextPhrase();
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-black text-sm hover:bg-dark-200 active:scale-95 transition-all shadow-md"
                  >
                    <span>Следующее словосочетание</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dual Pickers */}
          <div className="space-y-3">
            {/* Pick 1: Adjective */}
            <div className="bg-dark-850 border border-dark-700 rounded-2xl p-4">
              <div className="flex justify-between text-sm text-dark-300 mb-2.5 font-bold">
                <span>1. Прилагательное ({currentPhrase.adjSingular}):</span>
                {phraseAdjPick && <span className="text-white font-black">{phraseAdjPick}</span>}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {(['-e', '-ie'] as const).map((ending) => {
                  const isPicked = phraseAdjPick === ending;
                  let style = 'bg-dark-800 text-dark-100 border-dark-700 hover:bg-dark-750';
                  if (isPicked) style = 'bg-white text-black font-black border-white';
                  if (isPhraseAnswered) {
                    if (currentPhrase.adjEnding === ending) {
                      style = 'bg-emerald-600 text-white font-bold border-emerald-400';
                    } else if (isPicked) {
                      style = 'bg-rose-600 text-white font-bold border-rose-400';
                    }
                  }
                  return (
                    <button
                      key={ending}
                      onClick={() => handlePickPhraseAdj(ending)}
                      disabled={isPhraseAnswered}
                      className={`py-3.5 rounded-xl text-xl font-black border transition-all active:scale-95 ${style}`}
                    >
                      {ending}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pick 2: Noun */}
            <div className="bg-dark-850 border border-dark-700 rounded-2xl p-4">
              <div className="flex justify-between text-sm text-dark-300 mb-2.5 font-bold">
                <span>2. Существительное ({currentPhrase.nounSingular}):</span>
                {phraseNounPick && <span className="text-white font-black">{phraseNounPick}</span>}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { ending: '-y' as const, color: 'hover:border-sky-400' },
                  { ending: '-i' as const, color: 'hover:border-purple-400' },
                  { ending: '-e' as const, color: 'hover:border-emerald-400' },
                  { ending: '-a' as const, color: 'hover:border-amber-400' },
                ].map(({ ending, color }) => {
                  const isPicked = phraseNounPick === ending;
                  let style = `bg-dark-800 text-dark-100 border-dark-700 ${color}`;
                  if (isPicked) style = 'bg-white text-black font-black border-white';
                  if (isPhraseAnswered) {
                    if (currentPhrase.nounEnding === ending) {
                      style = 'bg-emerald-600 text-white font-bold border-emerald-400';
                    } else if (isPicked) {
                      style = 'bg-rose-600 text-white font-bold border-rose-400';
                    }
                  }
                  return (
                    <button
                      key={ending}
                      onClick={() => handlePickPhraseNoun(ending)}
                      disabled={isPhraseAnswered}
                      className={`py-3.5 rounded-xl text-xl font-black border transition-all active:scale-95 ${style}`}
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
