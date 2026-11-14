import React, { useState, useEffect } from 'react';
import type { ScreenState } from '../types';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { BookOpen, ChevronRight } from 'lucide-react';

interface MainMenuViewProps {
  onNavigate: (screen: ScreenState) => void;
  user: User | null;
}

export const MainMenuView: React.FC<MainMenuViewProps> = ({ onNavigate, user }) => {
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      return;
    }

    const fetchDueCount = async () => {
      try {
        const { count, error } = await supabase
          .from('user_words')
          .select('*', { count: 'exact', head: true })
          .lte('next_review_at', new Date().toISOString());

        if (isMounted && !error && count !== null) {
          setReviewCount(count);
        }
      } catch {
        // Quiet fallback
      }
    };

    fetchDueCount();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle Space key on home screen to trigger review if words due
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        reviewCount !== null &&
        reviewCount > 0 &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        onNavigate('srs-trainer');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reviewCount, onNavigate]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-10 flex flex-col gap-6 animate-fadeIn">
      {/* 1. Daily Action / Review Banner */}
      {user ? (
        reviewCount !== null && reviewCount > 0 ? (
          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>{reviewCount} {reviewCount === 1 ? 'слово' : reviewCount < 5 ? 'слова' : 'слов'} на сегодня</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Очередь интервального повторения
              </p>
            </div>
            <button
              onClick={() => onNavigate('srs-trainer')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-semibold transition-colors shadow-xs active:scale-98 shrink-0"
            >
              <span>Повторить</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded font-mono text-[10px] bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800 border border-zinc-700 dark:border-zinc-300">
                Space
              </kbd>
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Все слова повторены
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Очередь пуста. Вы можете добавить новые слова в словаре.
              </p>
            </div>
            <button
              onClick={() => onNavigate('dictionary')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
            >
              <span>Словарь</span>
            </button>
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Словарь и повторение
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Войдите для сохранения слов и тренировки по интервалам памяти
            </p>
          </div>
          <button
            onClick={() => onNavigate('auth')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-colors shrink-0 shadow-xs active:scale-98"
          >
            <span>Войти</span>
          </button>
        </div>
      )}

      {/* Header Label */}
      <div className="pt-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Грамматика
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Тренажеры окончаний и грамматических форм польского языка
        </p>
      </div>

      {/* Module 1: Rodzaj gramatyczny */}
      <section className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden transition-colors">
        <div className="flex items-center justify-between gap-3 p-5 sm:p-6 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Род в единственном числе
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Определение рода: ten, ta, to
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

        <div className="border-t border-zinc-100 dark:border-zinc-800/80 divide-y divide-zinc-100 dark:divide-zinc-800/80">
          <button
            onClick={() => onNavigate('train-gender')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
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
      <section className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden transition-colors">
        <div className="flex items-center justify-between gap-3 p-5 sm:p-6 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Множественное: вещи и женщины
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Категория niemęskoosobowy (one / te)
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

        <div className="border-t border-zinc-100 dark:border-zinc-800/80 divide-y divide-zinc-100 dark:divide-zinc-800/80">
          <button
            onClick={() => onNavigate('train-plural-nouns')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
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

          <button
            onClick={() => onNavigate('train-plural-adj')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
          >
            <div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Прилагательные
              </div>
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                nowy → nowe, drogi → drogie
              </div>
            </div>
            <ChevronRight
              className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all shrink-0 ml-3"
              strokeWidth={1.75}
            />
          </button>

          <button
            onClick={() => onNavigate('train-plural-phrases')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
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

      {/* Module 3: Rodzaj męskoosobowy */}
      <section className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden transition-colors">
        <div className="flex items-center justify-between gap-3 p-5 sm:p-6 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Множественное: мужчины (oni)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Категория męskoosobowy (oni / ci)
            </p>
          </div>

          <button
            onClick={() => onNavigate('rules-virile')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
            title="Открыть справочник правил"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} />
            <span>Правило</span>
          </button>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800/80 divide-y divide-zinc-100 dark:divide-zinc-800/80">
          <button
            onClick={() => onNavigate('train-virile-nouns')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
          >
            <div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Существительные
              </div>
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                student → studenci, Polak → Polacy, ojciec → ojcowie
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
