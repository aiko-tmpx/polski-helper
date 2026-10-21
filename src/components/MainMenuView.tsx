import React from 'react';
import type { ScreenState } from '../types';
import { BookOpen, ChevronRight } from 'lucide-react';

interface MainMenuViewProps {
  onNavigate: (screen: ScreenState) => void;
}

export const MainMenuView: React.FC<MainMenuViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-10 flex flex-col gap-8 animate-fadeIn">
      {/* Intro Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Грамматика
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Тренажер окончаний и грамматических форм польского языка.
        </p>
      </div>

      {/* Module 1: Rodzaj gramatyczny */}
      <section className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Грамматический род
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Определение мужского, женского и среднего рода (ten, ta, to)
            </p>
          </div>

          <button
            onClick={() => onNavigate('rules-gender')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
            title="Открыть справочник правил"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} />
            <span>Правило</span>
          </button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <button
            onClick={() => onNavigate('train-gender')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left bg-zinc-50/50 hover:bg-zinc-100/70 dark:bg-zinc-900/30 dark:hover:bg-zinc-800/50 transition-colors group"
          >
            <div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Существительные
              </div>
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                ten dom, ta kawa, to okno
              </div>
            </div>
            <ChevronRight
              className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all shrink-0 ml-3"
              strokeWidth={1.75}
            />
          </button>
        </div>
      </section>

      {/* Module 2: Liczba mnoga */}
      <section className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Множественное число
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Категория niemęskoosobowy: предметы, животные, женщины
            </p>
          </div>

          <button
            onClick={() => onNavigate('rules-plural')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
            title="Открыть справочник правил"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} />
            <span>Правило</span>
          </button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          {/* Submode A: Nouns */}
          <button
            onClick={() => onNavigate('train-plural-nouns')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left bg-zinc-50/50 hover:bg-zinc-100/70 dark:bg-zinc-900/30 dark:hover:bg-zinc-800/50 transition-colors group"
          >
            <div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Существительные
              </div>
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                okno → okna, kot → koty, ulica → ulice
              </div>
            </div>
            <ChevronRight
              className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all shrink-0 ml-3"
              strokeWidth={1.75}
            />
          </button>

          {/* Submode B: Adjectives */}
          <button
            onClick={() => onNavigate('train-plural-adj')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left bg-zinc-50/50 hover:bg-zinc-100/70 dark:bg-zinc-900/30 dark:hover:bg-zinc-800/50 transition-colors group"
          >
            <div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Прилагательные
              </div>
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                nowe, drogie (-e, -ie)
              </div>
            </div>
            <ChevronRight
              className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all shrink-0 ml-3"
              strokeWidth={1.75}
            />
          </button>

          {/* Submode C: Phrases */}
          <button
            onClick={() => onNavigate('train-plural-phrases')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left bg-zinc-50/50 hover:bg-zinc-100/70 dark:bg-zinc-900/30 dark:hover:bg-zinc-800/50 transition-colors group"
          >
            <div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Словосочетания
              </div>
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                nowa szkoła → nowe szkoły
              </div>
            </div>
            <ChevronRight
              className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all shrink-0 ml-3"
              strokeWidth={1.75}
            />
          </button>
        </div>
      </section>
    </div>
  );
};
