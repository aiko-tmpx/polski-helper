import React, { useState } from 'react';
import type { RulesMode } from '../types';
import { GENDER_RULES_SHORT, GENDER_RULES_LONG } from '../data/genderWords';
import {
  PLURAL_ALGORITHM_STEPS,
  PLURAL_TRAPS,
  PLURAL_ADJECTIVES_RULE,
  PLURAL_RULES_LONG,
} from '../data/pluralWords';
import { VIRILE_RULES_SHORT, VIRILE_RULES_LONG } from '../data/virileWords';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface FullscreenRulesProps {
  type: 'gender' | 'plural' | 'virile';
  onClose: () => void;
}

export const FullscreenRules: React.FC<FullscreenRulesProps> = ({ type, onClose }) => {
  const [mode, setMode] = useState<RulesMode>('short');

  const title =
    type === 'gender'
      ? 'Род в единственном числе'
      : type === 'plural'
      ? 'Множественное: вещи и женщины'
      : 'Множественное: мужчины (oni)';

  const subtitle =
    type === 'gender'
      ? 'Определение рода существительных: ten, ta, to.'
      : type === 'plural'
      ? 'Правила окончаний для категории niemęskoosobowy (one / te).'
      : 'Окончания и чередования согласных для категории męskoosobowy (oni / ci).';

  return (
    <div className="fixed inset-0 z-50 bg-zinc-50 dark:bg-zinc-950 overflow-y-auto flex flex-col animate-fadeIn">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Назад</span>
          </button>

          {/* Segmented Control */}
          <div className="inline-flex items-center p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
            <button
              onClick={() => setMode('short')}
              className={`px-3 py-1 rounded-md transition-all ${
                mode === 'short'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Кратко
            </button>
            <button
              onClick={() => setMode('long')}
              className={`px-3 py-1 rounded-md transition-all ${
                mode === 'long'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Подробно
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-medium text-zinc-400 dark:text-zinc-500">
            Справочник правил
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            {title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {subtitle}
          </p>
        </div>

        {/* ========================================================= */}
        {/* 1. GENDER RULES */}
        {/* ========================================================= */}
        {type === 'gender' && (
          <div className="flex flex-col gap-4">
            {mode === 'short' ? (
              <div className="space-y-4">
                {GENDER_RULES_SHORT.map((item) => (
                  <section
                    key={item.gender}
                    className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.gender}
                      </h2>
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300">
                        {item.badge}
                      </span>
                    </div>

                    <div className="text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="text-zinc-500 dark:text-zinc-400 font-normal">Маркер: </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.ending}</span>
                    </div>

                    {/* Clean Examples (no badge pills) */}
                    <div className="pt-1">
                      <div className="text-xs text-zinc-400 dark:text-zinc-500 mb-1.5 font-medium">
                        Примеры:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-4 text-xs sm:text-sm">
                        {item.examples.map((ex, i) => (
                          <div key={i} className="flex items-baseline gap-1.5">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{ex.pl}</span>
                            {ex.ru && <span className="text-zinc-400 dark:text-zinc-500 text-xs">({ex.ru})</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exceptions callout */}
                    {item.exceptions && (
                      <div className="p-3 rounded-r-lg border-l-2 border-amber-500/80 bg-amber-500/5 dark:bg-amber-500/10 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        <span className="font-semibold text-amber-800 dark:text-amber-400 mr-1.5">
                          Внимание:
                        </span>
                        <span>{item.exceptions}</span>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {GENDER_RULES_LONG.map((sec) => (
                  <section
                    key={sec.title}
                    className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs"
                  >
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {sec.title}
                    </h2>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                      {sec.rule}
                    </p>
                    <ul className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                      {sec.points.map((pt, i) => (
                        <li key={i} className="leading-relaxed">{pt}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. PLURAL RULES */}
        {/* ========================================================= */}
        {type === 'plural' && (
          <div className="flex flex-col gap-6">
            {mode === 'short' ? (
              <div className="space-y-6">
                {/* 1. Algorithm Flow Card */}
                <section className="p-6 sm:p-7 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-xs">
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3.5">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      Алгоритм выбора за 5 секунд
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Проверяйте слово сверху вниз:
                    </p>
                  </div>

                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {PLURAL_ALGORITHM_STEPS.map((step) => {
                      const badgeClass =
                        step.ending === '-a'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300'
                          : step.ending === '-i'
                          ? 'border-purple-500/30 bg-purple-500/10 text-purple-800 dark:text-purple-300'
                          : step.ending === '-e'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                          : 'border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300';

                      return (
                        <div
                          key={step.step}
                          className="py-4 first:pt-1 last:pb-1 space-y-2"
                        >
                          {/* Top Line: Step number + condition on left, ending on right */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-5 h-5 rounded flex items-center justify-center font-mono text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shrink-0">
                                {step.step}
                              </span>
                              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {step.condition}
                              </span>
                            </div>

                            <span
                              className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border shrink-0 ${badgeClass}`}
                            >
                              {step.ending}
                            </span>
                          </div>

                          {/* Bottom Line: Clean examples with breathing room */}
                          <div className="pl-7.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                            {step.examples.map((ex, i) => (
                              <span key={i} className="inline-flex items-baseline">
                                {ex.sg} →{' '}
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100 ml-1">
                                  {ex.pl}
                                </span>
                                {i < step.examples.length - 1 && (
                                  <span className="text-zinc-300 dark:text-zinc-700 ml-4">•</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 2. Traps Callout */}
                <div className="p-5 sm:p-6 rounded-r-xl border-l-2 border-amber-500/80 bg-amber-500/5 dark:bg-amber-500/10 space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    <span>3 главные ловушки</span>
                  </div>

                  <div className="space-y-2.5">
                    {PLURAL_TRAPS.map((trap, i) => (
                      <div key={i} className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 mr-1.5">
                          {trap.title}:
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400">{trap.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Adjectives */}
                <section className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {PLURAL_ADJECTIVES_RULE.title}
                    </h3>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300">
                      -e / -ie
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {PLURAL_ADJECTIVES_RULE.rule}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    {PLURAL_ADJECTIVES_RULE.examples.map((ex, i) => (
                      <div key={i} className="flex items-baseline gap-1">
                        <span>{ex.sg} →</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{ex.pl}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="space-y-4">
                {PLURAL_RULES_LONG.map((sec, idx) => (
                  <section
                    key={idx}
                    className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs"
                  >
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {sec.title}
                    </h2>
                    <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
                      {sec.content}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. VIRILE RULES */}
        {/* ========================================================= */}
        {type === 'virile' && (
          <div className="flex flex-col gap-4">
            {mode === 'short' ? (
              <div className="space-y-4">
                {VIRILE_RULES_SHORT.map((item, idx) => (
                  <section
                    key={idx}
                    className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.category}
                      </h2>
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300">
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                      {item.target}
                    </p>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                      {item.rule}
                    </p>

                    {item.caution && (
                      <div className="p-3 rounded-r-lg border-l-2 border-amber-500/80 bg-amber-500/5 dark:bg-amber-500/10 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        <span className="font-semibold text-amber-800 dark:text-amber-400 mr-1.5">
                          Внимание:
                        </span>
                        <span>{item.caution}</span>
                      </div>
                    )}

                    {/* Clean Examples (no badge pills) */}
                    <div className="pt-1">
                      <div className="text-xs text-zinc-400 dark:text-zinc-500 mb-1.5 font-medium">
                        Примеры:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs sm:text-sm">
                        {item.examples.map((ex, i) => (
                          <div key={i} className="flex items-baseline gap-1.5 font-mono">
                            <span className="text-zinc-500 dark:text-zinc-400">{ex.sg} →</span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{ex.pl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {VIRILE_RULES_LONG.map((sec, idx) => (
                  <section
                    key={idx}
                    className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs"
                  >
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {sec.title}
                    </h2>
                    <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
                      {sec.content}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="pt-4 flex justify-center pb-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-colors shadow-xs active:scale-98"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    </div>
  );
};
