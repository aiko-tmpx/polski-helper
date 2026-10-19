import React, { useState, useCallback, useEffect } from 'react';
import type { AppStats, PluralSubMode, NounWord, AdjectiveWord, PhraseItem } from '../types';
import {
  NOUNS_DATA,
  NOUN_RULES_SUMMARY,
  ADJECTIVES_DATA,
  ADJECTIVE_RULES_SUMMARY,
  PHRASES_DATA,
} from '../data/pluralWords';
import { playSuccessSound, playErrorSound, triggerHaptic, speakPolish } from '../utils/audio';
import { recordAnswer } from '../utils/storage';
import { Volume2, CheckCircle2, XCircle, ArrowRight, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface PluralModuleProps {
  stats: AppStats;
  setStats: React.Dispatch<React.SetStateAction<AppStats>>;
  soundEnabled: boolean;
}

export const PluralModule: React.FC<PluralModuleProps> = ({ stats, setStats, soundEnabled }) => {
  const [subMode, setSubMode] = useState<PluralSubMode>('nouns');
  const [showDictionary, setShowDictionary] = useState(false);

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

  // Next handlers (NO auto-advance!)
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
    <div className="w-full max-w-lg mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Submode Switcher */}
      <div className="flex items-center justify-between border-b border-dark-700/60 pb-3">
        <div className="flex items-center gap-1 bg-dark-900 border border-dark-700 p-1 rounded-xl text-xs">
          {(
            [
              { id: 'nouns', label: 'Существительные' },
              { id: 'adjectives', label: 'Прилагательные' },
              { id: 'phrases', label: 'Вместе' },
            ] as { id: PluralSubMode; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSubMode(item.id);
                setShowDictionary(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                subMode === item.id
                  ? 'bg-white text-black shadow-sm'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Dictionary toggle */}
        <button
          onClick={() => setShowDictionary((prev) => !prev)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-dark-800 text-dark-200 border border-dark-700 hover:bg-dark-700 text-xs font-medium transition-all"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Словарь</span>
          {showDictionary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Task-specific Dictionary & Rules */}
      {showDictionary && (
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-4 text-xs space-y-4 animate-fadeIn">
          {subMode === 'nouns' && (
            <>
              <div>
                <h3 className="font-bold text-white mb-2">Правила окончаний существительных:</h3>
                <div className="space-y-2">
                  {NOUN_RULES_SUMMARY.map((r) => (
                    <div key={r.ending} className="p-2 rounded-xl bg-dark-850 border border-dark-800">
                      <span className="font-bold text-white text-sm mr-2">{r.ending}</span>
                      <span className="text-dark-300">{r.target}</span>
                      <div className="text-dark-400 font-mono text-[11px] mt-1">{r.example}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Слова этого задания ({NOUNS_DATA.length}):</h3>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {NOUNS_DATA.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-dark-850 border border-dark-800 text-[11px]">
                      <span className="font-bold text-white">{n.singular}</span> &rarr;{' '}
                      <span className="text-dark-200">{n.plural}</span>
                      <div className="text-dark-400 text-[10px]">{n.translation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {subMode === 'adjectives' && (
            <>
              <div>
                <h3 className="font-bold text-white mb-2">Правила окончаний прилагательных:</h3>
                <div className="space-y-2">
                  {ADJECTIVE_RULES_SUMMARY.map((r) => (
                    <div key={r.ending} className="p-2.5 rounded-xl bg-dark-850 border border-dark-800">
                      <span className="font-bold text-white text-sm mr-2">{r.ending}</span>
                      <span className="text-dark-300">{r.target}</span>
                      <div className="text-dark-400 font-mono text-[11px] mt-1">{r.example}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Прилагательные этого задания ({ADJECTIVES_DATA.length}):</h3>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {ADJECTIVES_DATA.map((a) => (
                    <div key={a.id} className="p-2 rounded-lg bg-dark-850 border border-dark-800 text-[11px]">
                      <span className="font-bold text-white">{a.singular}</span> &rarr;{' '}
                      <span className="text-dark-200">{a.plural}</span>
                      <div className="text-dark-400 text-[10px]">{a.translation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {subMode === 'phrases' && (
            <div>
              <h3 className="font-bold text-white mb-2">Словосочетания ({PHRASES_DATA.length}):</h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {PHRASES_DATA.map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-dark-850 border border-dark-800 text-[11px]">
                    <span className="font-bold text-white">{p.adjSingular} {p.nounSingular}</span> &rarr;{' '}
                    <span className="text-emerald-300 font-bold">{p.fullPlural}</span>
                    <div className="text-dark-400 text-[10px]">{p.translation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBMODE 1: NOUNS VIEW */}
      {/* ========================================================= */}
      {subMode === 'nouns' && (
        <>
          <div
            onClick={() => {
              if (isNounAnswered) handleNextNoun();
            }}
            className={`relative bg-dark-900 border rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all ${
              isNounAnswered
                ? isNounCorrect
                  ? 'border-emerald-500/60 bg-dark-850'
                  : 'border-rose-500/60 bg-dark-850'
                : 'border-dark-700'
            } ${isNounAnswered ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center justify-center gap-3 mb-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {currentNoun.singular}
              </h1>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakPolish(currentNoun.singular);
                }}
                className="p-1.5 rounded-lg bg-dark-800 text-dark-300 hover:text-white active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-dark-300 font-medium mb-6">
              {currentNoun.translation}
            </p>

            {isNounAnswered && (
              <div className="w-full flex flex-col items-center gap-2 animate-fadeIn">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold ${
                    isNounCorrect
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {isNounCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>
                    {currentNoun.singular} &rarr;{' '}
                    <span className="underline underline-offset-4">{currentNoun.plural}</span>
                  </span>
                </div>

                {!isNounCorrect && (
                  <p className="text-xs text-dark-300 bg-dark-800 p-2.5 rounded-xl border border-dark-700 text-left w-full mt-1">
                    {currentNoun.ruleExplanation}
                  </p>
                )}

                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextNoun();
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-dark-200 active:scale-95 transition-all shadow-md"
                  >
                    <span>Дальше</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-dark-500 mt-0.5">
                  Кликните по карточке или нажмите Пробел
                </p>
              </div>
            )}
          </div>

          {/* 4 Noun buttons: -y, -i, -e, -a */}
          <div className="grid grid-cols-4 gap-2">
            {(['-y', '-i', '-e', '-a'] as const).map((ending, index) => {
              const isSelected = selectedNounEnding === ending;
              const isRight = currentNoun.correctEnding === ending;

              let btnClass =
                'bg-dark-900 border-dark-700 text-dark-100 hover:bg-dark-800 hover:border-dark-600 active:scale-95';

              if (isNounAnswered) {
                if (isRight) {
                  btnClass =
                    'bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-500/40';
                } else if (isSelected && !isNounCorrect) {
                  btnClass = 'bg-rose-600 border-rose-400 text-white font-bold';
                } else {
                  btnClass = 'bg-dark-950 border-dark-800 text-dark-500 opacity-40';
                }
              }

              return (
                <button
                  key={ending}
                  onClick={() => handleSelectNounEnding(ending)}
                  disabled={isNounAnswered}
                  className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl border text-xl font-bold transition-all ${btnClass}`}
                >
                  <span>{ending}</span>
                  <span className="text-[10px] text-dark-500 font-mono mt-1 hidden sm:inline">[{index + 1}]</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* SUBMODE 2: ADJECTIVES VIEW */}
      {/* ========================================================= */}
      {subMode === 'adjectives' && (
        <>
          <div
            onClick={() => {
              if (isAdjAnswered) handleNextAdj();
            }}
            className={`relative bg-dark-900 border rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all ${
              isAdjAnswered
                ? isAdjCorrect
                  ? 'border-emerald-500/60 bg-dark-850'
                  : 'border-rose-500/60 bg-dark-850'
                : 'border-dark-700'
            } ${isAdjAnswered ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center justify-center gap-3 mb-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {currentAdj.singular}
              </h1>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakPolish(currentAdj.singular);
                }}
                className="p-1.5 rounded-lg bg-dark-800 text-dark-300 hover:text-white active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-dark-300 font-medium mb-6">
              {currentAdj.translation}
            </p>

            {isAdjAnswered && (
              <div className="w-full flex flex-col items-center gap-2 animate-fadeIn">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold ${
                    isAdjCorrect
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {isAdjCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>
                    {currentAdj.singular} &rarr;{' '}
                    <span className="underline underline-offset-4">{currentAdj.plural}</span>
                  </span>
                </div>

                {!isAdjCorrect && (
                  <p className="text-xs text-dark-300 bg-dark-800 p-2.5 rounded-xl border border-dark-700 text-left w-full mt-1">
                    {currentAdj.ruleExplanation}
                  </p>
                )}

                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextAdj();
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-dark-200 active:scale-95 transition-all shadow-md"
                  >
                    <span>Дальше</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-dark-500 mt-0.5">
                  Кликните по карточке или нажмите Пробел
                </p>
              </div>
            )}
          </div>

          {/* 2 Adjective buttons: -e vs -ie */}
          <div className="grid grid-cols-2 gap-3">
            {(['-e', '-ie'] as const).map((ending, index) => {
              const isSelected = selectedAdjEnding === ending;
              const isRight = currentAdj.correctEnding === ending;

              let btnClass =
                'bg-dark-900 border-dark-700 text-dark-100 hover:bg-dark-800 hover:border-dark-600 active:scale-95';

              if (isAdjAnswered) {
                if (isRight) {
                  btnClass =
                    'bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-500/40';
                } else if (isSelected && !isAdjCorrect) {
                  btnClass = 'bg-rose-600 border-rose-400 text-white font-bold';
                } else {
                  btnClass = 'bg-dark-950 border-dark-800 text-dark-500 opacity-40';
                }
              }

              return (
                <button
                  key={ending}
                  onClick={() => handleSelectAdjEnding(ending)}
                  disabled={isAdjAnswered}
                  className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl border text-xl font-bold transition-all ${btnClass}`}
                >
                  <span>{ending}</span>
                  <span className="text-[10px] text-dark-500 font-mono mt-1 hidden sm:inline">[{index + 1}]</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* SUBMODE 3: PHRASES (TOGETHER) VIEW */}
      {/* ========================================================= */}
      {subMode === 'phrases' && (
        <>
          <div
            onClick={() => {
              if (isPhraseAnswered) handleNextPhrase();
            }}
            className={`relative bg-dark-900 border rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-center text-center transition-all ${
              isPhraseAnswered
                ? isPhraseCorrect
                  ? 'border-emerald-500/60 bg-dark-850'
                  : 'border-rose-500/60 bg-dark-850'
                : 'border-dark-700'
            } ${isPhraseAnswered ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center justify-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
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
                className="p-1.5 rounded-lg bg-dark-800 text-dark-300 hover:text-white active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-dark-300 font-medium mb-4">
              {currentPhrase.translation}
            </p>

            {isPhraseAnswered && (
              <div className="w-full flex flex-col items-center gap-2 animate-fadeIn">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold ${
                    isPhraseCorrect
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {isPhraseCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{currentPhrase.fullPlural}</span>
                </div>

                {!isPhraseCorrect && (
                  <div className="text-xs text-dark-300 bg-dark-800 p-2.5 rounded-xl border border-dark-700 text-left w-full space-y-1">
                    <div><strong>Прил.:</strong> {currentPhrase.adjExplanation}</div>
                    <div><strong>Сущ.:</strong> {currentPhrase.nounExplanation}</div>
                  </div>
                )}

                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextPhrase();
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-dark-200 active:scale-95 transition-all shadow-md"
                  >
                    <span>Дальше</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive dual-pickers */}
          <div className="space-y-3">
            {/* Pick 1: Adjective */}
            <div className="bg-dark-900 border border-dark-700/80 rounded-xl p-3">
              <div className="flex justify-between text-xs text-dark-400 mb-2 font-medium">
                <span>1. Прилагательное ({currentPhrase.adjSingular}):</span>
                {phraseAdjPick && <span className="text-white font-bold">{phraseAdjPick}</span>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['-e', '-ie'] as const).map((ending) => {
                  const isPicked = phraseAdjPick === ending;
                  let style = 'bg-dark-800 text-dark-200 border-dark-700 hover:bg-dark-750';
                  if (isPicked) style = 'bg-white text-black font-bold border-white';
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
                      className={`py-2.5 rounded-xl text-base font-bold border transition-all active:scale-95 ${style}`}
                    >
                      {ending}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pick 2: Noun */}
            <div className="bg-dark-900 border border-dark-700/80 rounded-xl p-3">
              <div className="flex justify-between text-xs text-dark-400 mb-2 font-medium">
                <span>2. Существительное ({currentPhrase.nounSingular}):</span>
                {phraseNounPick && <span className="text-white font-bold">{phraseNounPick}</span>}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['-y', '-i', '-e', '-a'] as const).map((ending) => {
                  const isPicked = phraseNounPick === ending;
                  let style = 'bg-dark-800 text-dark-200 border-dark-700 hover:bg-dark-750';
                  if (isPicked) style = 'bg-white text-black font-bold border-white';
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
                      className={`py-2.5 rounded-xl text-base font-bold border transition-all active:scale-95 ${style}`}
                    >
                      {ending}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
