import React, { useState } from 'react';
import type { RulesMode } from '../types';
import { GENDER_RULES_SHORT, GENDER_RULES_LONG, GENDER_WORDS } from '../data/genderWords';
import { PLURAL_RULES_SHORT, PLURAL_RULES_LONG, NOUNS_DATA } from '../data/pluralWords';
import { speakPolish } from '../utils/audio';
import { ArrowLeft, Volume2, BookOpen, AlertCircle } from 'lucide-react';

interface FullscreenRulesProps {
  type: 'gender' | 'plural';
  onClose: () => void;
}

export const FullscreenRules: React.FC<FullscreenRulesProps> = ({ type, onClose }) => {
  const [mode, setMode] = useState<RulesMode>('short');

  const title = type === 'gender' ? 'Грамматический род существительных' : 'Множественное число (Liczba mnoga)';
  const subtitle =
    type === 'gender'
      ? 'Правила распределения слов на Męski (ten), Żeński (ta) и Nijaki (to)'
      : 'Полная грамматика окончаний для категории rodzaj niemęskoosobowy';

  return (
    <div className="fixed inset-0 z-50 bg-dark-900 overflow-y-auto flex flex-col animate-fadeIn">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 bg-dark-900/95 backdrop-blur border-b border-dark-700/80 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-850 border border-dark-700 text-dark-200 hover:text-white hover:bg-dark-800 text-sm font-semibold active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>

          {/* Switcher: Кратко (TL;DR) / Подробно */}
          <div className="flex items-center bg-dark-850 border border-dark-700 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setMode('short')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'short'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Кратко (TL;DR)
            </button>
            <button
              onClick={() => setMode('long')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'long'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Подробно
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Header banner */}
        <div>
          <span className="text-xs uppercase tracking-wider font-extrabold text-dark-400 flex items-center gap-1.5 mb-1">
            <BookOpen className="w-4 h-4 text-dark-300" />
            <span>Справочник грамматики польского языка</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-dark-300 mt-1">
            {subtitle}
          </p>
        </div>

        {/* ========================================================= */}
        {/* 1. GENDER RULES */}
        {/* ========================================================= */}
        {type === 'gender' && (
          <div className="flex flex-col gap-5">
            {mode === 'short' ? (
              /* TL;DR GENDER */
              <div className="space-y-4">
                {GENDER_RULES_SHORT.map((item) => {
                  return (
                    <div
                      key={item.gender}
                      className="p-5 rounded-2xl bg-dark-850 border border-dark-700/80 space-y-3 shadow-sm"
                    >
                      {/* Gender Header with Badge */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.icon}</span>
                          <span className="text-lg font-black text-white">{item.gender}</span>
                        </div>
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-dark-800 text-white border border-dark-700">
                          {item.badge}
                        </span>
                      </div>

                      {/* Rule formula */}
                      <div className="text-sm sm:text-base text-dark-200 font-medium">
                        Маркер: <strong className="text-white underline decoration-2">{item.ending}</strong>
                      </div>

                      {/* Examples Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.examples.map((ex, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-750 text-xs font-medium"
                          >
                            <span className="font-bold text-white">{ex.pl}</span>
                            <span className="text-dark-400">({ex.ru})</span>
                          </div>
                        ))}
                      </div>

                      {/* Exceptions / Caution */}
                      {item.exceptions && (
                        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-dark-900 border border-dark-800 text-xs text-dark-300">
                          <AlertCircle className="w-4 h-4 text-dark-400 shrink-0 mt-0.5" />
                          <span>{item.exceptions}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LONG GENDER */
              <div className="space-y-5">
                {GENDER_RULES_LONG.map((sec) => (
                  <div
                    key={sec.title}
                    className="p-5 sm:p-6 rounded-2xl bg-dark-850 border border-dark-700/80 space-y-3"
                  >
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {sec.title}
                    </h2>
                    <p className="text-sm sm:text-base text-dark-200 leading-relaxed font-normal">
                      {sec.rule}
                    </p>
                    <ul className="space-y-2 pt-2 border-t border-dark-800 text-sm text-dark-300 list-disc list-inside">
                      {sec.points.map((pt, i) => (
                        <li key={i} className="leading-relaxed">{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Vocabulary with audio */}
                <div className="p-5 rounded-2xl bg-dark-850 border border-dark-700/80 space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Словарь модуля с произношением ({GENDER_WORDS.length}):</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                    {GENDER_WORDS.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-dark-800 border border-dark-750 text-sm"
                      >
                        <div>
                          <span className="font-bold text-white">{w.word}</span>{' '}
                          <span className="text-dark-400">({w.translation})</span>
                          <div className="text-xs text-dark-400 uppercase font-mono">{w.gender}</div>
                        </div>
                        <button
                          onClick={() => speakPolish(w.word)}
                          title="Прослушать произношение"
                          className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 active:scale-95"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. PLURAL RULES */}
        {/* ========================================================= */}
        {type === 'plural' && (
          <div className="flex flex-col gap-5">
            {mode === 'short' ? (
              /* TL;DR PLURAL */
              <div className="space-y-4">
                {PLURAL_RULES_SHORT.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-dark-850 border border-dark-700/80 space-y-3 shadow-sm"
                    >
                      {/* Header with Color Badge */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-black text-white">
                          {item.category}
                        </span>
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-dark-800 text-white border border-dark-700">
                          {item.badge}
                        </span>
                      </div>

                      {/* Rule target */}
                      <p className="text-sm sm:text-base text-dark-200 font-medium">
                        {item.target}
                      </p>

                      {/* Caution / Tip */}
                      <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-800 text-xs text-dark-300">
                        {item.caution}
                      </div>

                      {/* Example Pills */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {item.examples.map((ex, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-dark-800 border border-dark-750 text-xs font-medium"
                          >
                            <span className="text-dark-400">{ex.sg} &rarr;</span>
                            <span className="font-bold text-white underline decoration-2">{ex.pl}</span>
                            <span className="text-dark-400 text-[11px]">({ex.ru})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LONG PLURAL */
              <div className="space-y-5">
                {PLURAL_RULES_LONG.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-dark-850 border border-dark-700/80 space-y-3"
                  >
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {sec.title}
                    </h2>
                    <div className="text-sm sm:text-base text-dark-200 leading-relaxed whitespace-pre-line font-normal">
                      {sec.content}
                    </div>
                  </div>
                ))}

                {/* Vocabulary with audio */}
                <div className="p-5 rounded-2xl bg-dark-850 border border-dark-700/80 space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Словарь множественного числа с озвучкой ({NOUNS_DATA.length}):</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                    {NOUNS_DATA.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-dark-800 border border-dark-750 text-sm"
                      >
                        <div>
                          <div className="font-bold text-white">
                            {n.singular} &rarr;{' '}
                            <span className="underline decoration-2">{n.plural}</span>
                          </div>
                          <div className="text-xs text-dark-400">{n.translation}</div>
                        </div>
                        <button
                          onClick={() => speakPolish(n.plural)}
                          title="Прослушать произношение"
                          className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 active:scale-95"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="pt-4 flex justify-center pb-6">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-white text-black font-black text-sm hover:bg-dark-200 active:scale-95 transition-all shadow-md"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    </div>
  );
};
