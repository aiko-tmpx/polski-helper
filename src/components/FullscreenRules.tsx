import React, { useState } from 'react';
import type { RulesMode } from '../types';
import { GENDER_RULES_SHORT, GENDER_RULES_LONG, GENDER_WORDS } from '../data/genderWords';
import { PLURAL_RULES_SHORT, PLURAL_RULES_LONG, NOUNS_DATA } from '../data/pluralWords';
import { speakPolish } from '../utils/audio';
import { ArrowLeft, Volume2 } from 'lucide-react';

interface FullscreenRulesProps {
  type: 'gender' | 'plural';
  onClose: () => void;
}

export const FullscreenRules: React.FC<FullscreenRulesProps> = ({ type, onClose }) => {
  const [mode, setMode] = useState<RulesMode>('short');

  const title =
    type === 'gender' ? 'Грамматический род' : 'Множественное число';
  const subtitle =
    type === 'gender'
      ? 'Распределение существительных на męski (ten), żeński (ta) и nijaki (to).'
      : 'Правила окончаний для категории rodzaj niemęskoosobowy (-y, -i, -e, -a).';

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

                {/* Vocabulary with speech */}
                <section className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Словарь модуля ({GENDER_WORDS.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                    {GENDER_WORDS.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-850/50 text-xs sm:text-sm"
                      >
                        <div>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">{w.word}</span>{' '}
                          <span className="text-zinc-400">({w.translation})</span>
                          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase mt-0.5">
                            {w.gender}
                          </div>
                        </div>
                        <button
                          onClick={() => speakPolish(w.word)}
                          title="Прослушать произношение"
                          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. PLURAL RULES */}
        {/* ========================================================= */}
        {type === 'plural' && (
          <div className="flex flex-col gap-4">
            {mode === 'short' ? (
              <div className="space-y-4">
                {PLURAL_RULES_SHORT.map((item, idx) => (
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

                {/* Vocabulary with speech */}
                <section className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Словарь множественного числа ({NOUNS_DATA.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                    {NOUNS_DATA.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-850/50 text-xs sm:text-sm"
                      >
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">
                            {n.singular} → <span>{n.plural}</span>
                          </div>
                          <div className="text-xs text-zinc-400 dark:text-zinc-500">{n.translation}</div>
                        </div>
                        <button
                          onClick={() => speakPolish(n.plural)}
                          title="Прослушать произношение"
                          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
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
