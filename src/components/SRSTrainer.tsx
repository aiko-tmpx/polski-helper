import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import type { UserWord } from '../types';
import { supabase } from '../utils/supabase';
import { speakPolish, hasPolishVoice } from '../utils/audio';
import { calculateNextSRS, type SRSRating } from '../utils/srs';
import { ArrowLeft, Volume2, Loader2, RotateCcw, Check } from 'lucide-react';

interface SRSTrainerProps {
  user: User | null;
  onBackToMenu: () => void;
  onNavigateToAuth: () => void;
}

export const SRSTrainer: React.FC<SRSTrainerProps> = ({
  user,
  onBackToMenu,
  onNavigateToAuth,
}) => {
  const [queue, setQueue] = useState<UserWord[]>([]);
  const [initialCount, setInitialCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(() => Boolean(user));
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPracticeAll, setIsPracticeAll] = useState(false);
  const [hasPolishTts, setHasPolishTts] = useState(() => hasPolishVoice());

  // Detect genuine Polish voice support (handles async voice loading in Chromium)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const updateVoice = () => {
      setHasPolishTts(hasPolishVoice());
    };
    updateVoice();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoice);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoice);
    };
  }, []);

  // Fetch words due for review today
  useEffect(() => {
    let isMounted = true;
    if (!user) {
      return;
    }

    const load = async () => {
      try {
        let query = supabase
          .from('user_words')
          .select('*')
          .eq('user_id', user.id);

        if (!isPracticeAll) {
          query = query.lte('next_review_at', new Date().toISOString());
        }

        const { data, error } = await query.order('next_review_at', { ascending: true });

        if (isMounted) {
          if (error) throw error;
          const words = data || [];
          setQueue(words);
          setInitialCount(words.length);
          setCompletedCount(0);
          setIsFlipped(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Ошибка при загрузке очереди повторения';
          setErrorMessage(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [user, isPracticeAll]);

  const currentWord = queue[0];

  // Auto-pronounce word when card appears only if Polish TTS is supported
  useEffect(() => {
    if (currentWord && hasPolishTts) {
      speakPolish(currentWord.word);
    }
  }, [currentWord, hasPolishTts]);

  // Flip card
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Submit rating
  const handleRate = useCallback(
    async (rating: SRSRating) => {
      if (!currentWord || isSaving || !user) return;

      setIsSaving(true);
      try {
        const next = calculateNextSRS(currentWord, rating);

        // Update in Supabase
        const { error } = await supabase
          .from('user_words')
          .update({
            interval_days: next.interval_days,
            repetition_count: next.repetition_count,
            ease_factor: next.ease_factor,
            next_review_at: next.next_review_at,
          })
          .eq('id', currentWord.id);

        if (error) throw error;

        setIsFlipped(false);

        if (rating === 1) {
          // Again: re-append card to queue to review again in this session
          setQueue((prev) => [...prev.slice(1), { ...currentWord, ...next }]);
        } else {
          // Hard, Good, Easy: advance queue
          setQueue((prev) => prev.slice(1));
          setCompletedCount((prev) => prev + 1);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Ошибка сохранения интервала';
        setErrorMessage(msg);
      } finally {
        setIsSaving(false);
      }
    },
    [currentWord, isSaving, user]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isFlipped) {
          handleFlip();
        } else {
          // If already flipped, Space defaults to Good (rating 3)
          handleRate(3);
        }
        return;
      }

      // Hotkey 'R' to replay audio
      if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
        if (currentWord) {
          e.preventDefault();
          speakPolish(currentWord.word);
        }
        return;
      }

      // Ratings only work when flipped
      if (isFlipped && !isSaving) {
        if (e.key === '1') {
          e.preventDefault();
          handleRate(1);
        } else if (e.key === '2') {
          e.preventDefault();
          handleRate(2);
        } else if (e.key === '3') {
          e.preventDefault();
          handleRate(3);
        } else if (e.key === '4') {
          e.preventDefault();
          handleRate(4);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isSaving, currentWord, handleFlip, handleRate]);

  // Unauthenticated screen
  if (!user) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center gap-4 animate-fadeIn">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Интервальное повторение
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          Войдите в аккаунт, чтобы тренировать сохраненные слова по карточкам с алгоритмом интервального повторения.
        </p>
        <button
          onClick={onNavigateToAuth}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-colors shadow-xs active:scale-98"
        >
          Войти в аккаунт
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" strokeWidth={1.75} />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Загрузка очереди слов...</p>
      </div>
    );
  }

  // Session completed
  if (queue.length === 0 && initialCount > 0) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-12 flex flex-col gap-6 animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors active:scale-98"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>В меню</span>
          </button>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            Сессия завершена
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 sm:p-12 text-center flex flex-col items-center gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Check className="w-5 h-5" strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Повторение завершено
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Все слова из очереди на сегодня успешно повторены
            </p>
          </div>

          <div className="font-mono text-xs px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Повторено: {completedCount} {completedCount === 1 ? 'слово' : completedCount < 5 ? 'слова' : 'слов'}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setIsPracticeAll(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Повторить все слова</span>
            </button>
            <button
              onClick={onBackToMenu}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-colors shadow-xs active:scale-98"
            >
              <span>Завершить</span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] px-1 rounded bg-zinc-800 dark:bg-zinc-200 text-zinc-200 dark:text-zinc-800">
                Space
              </kbd>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Queue empty at start (no due words today)
  if (queue.length === 0 && initialCount === 0) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-12 flex flex-col gap-6 animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors active:scale-98"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>В меню</span>
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 sm:p-12 text-center flex flex-col items-center gap-3 shadow-xs">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Очередь повторения пуста
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
            На сегодня нет слов, требующих повторения. Интервалы рассчитаны на следующие дни.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setIsPracticeAll(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Повторить все слова вне очереди</span>
            </button>
            <button
              onClick={onBackToMenu}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-colors shadow-xs active:scale-98"
            >
              <span>В меню</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const remainingCount = queue.length;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors active:scale-98"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>В меню</span>
        </button>

        <div className="flex items-center gap-2">
          {isPracticeAll && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              Вне очереди
            </span>
          )}
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Осталось: {remainingCount}
          </span>
        </div>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="p-3 rounded-lg border-l-2 border-rose-500 bg-rose-500/10 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Flashcard Body */}
      <div
        onClick={!isFlipped ? handleFlip : undefined}
        className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 sm:p-12 shadow-xs flex flex-col items-center justify-center text-center min-h-[260px] relative transition-all ${
          !isFlipped ? 'cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700' : ''
        }`}
      >
        {/* Audio Button (rendered strictly when Polish voice is supported) */}
        {hasPolishTts && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (currentWord) speakPolish(currentWord.word);
            }}
            title="Прослушать произношение [R]"
            className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Volume2 className="w-4 h-4" strokeWidth={1.75} />
          </button>
        )}

        {/* Front Side: Polish Word */}
        <div className="w-full flex flex-col items-center">
          <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 select-text">
            {currentWord.word}
          </div>

          {isFlipped && (
            <>
              {/* Divider */}
              <div className="w-12 h-px bg-zinc-200 dark:bg-zinc-800 my-4" />

              {/* Back Side: Translation & Notes */}
              <div className="text-xl sm:text-2xl font-semibold text-zinc-800 dark:text-zinc-200 select-text animate-fadeIn">
                {currentWord.translation}
              </div>

              {currentWord.notes && (
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-mono max-w-sm">
                  {currentWord.notes}
                </div>
              )}

              {/* Interval metadata badge */}
              <div className="mt-4 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                Интервал: {currentWord.interval_days} дн. · Повторений: {currentWord.repetition_count}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      {isFlipped ? (
        <div className="flex flex-col gap-2 animate-fadeIn">
          <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 text-center">
            Оцените, насколько легко вспомнили слово:
          </div>

          {/* 4 Linear-style Rating Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. Не помню */}
            <button
              onClick={() => handleRate(1)}
              disabled={isSaving}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-rose-500/50 hover:bg-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-all active:scale-98 disabled:opacity-50"
            >
              <kbd className="font-mono text-[10px] px-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                1
              </kbd>
              <span>Не помню</span>
            </button>

            {/* 2. Трудно */}
            <button
              onClick={() => handleRate(2)}
              disabled={isSaving}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-500/50 hover:bg-amber-500/10 text-xs font-semibold text-amber-600 dark:text-amber-400 transition-all active:scale-98 disabled:opacity-50"
            >
              <kbd className="font-mono text-[10px] px-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                2
              </kbd>
              <span>Трудно</span>
            </button>

            {/* 3. Хорошо */}
            <button
              onClick={() => handleRate(3)}
              disabled={isSaving}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-all active:scale-98 disabled:opacity-50"
            >
              <kbd className="font-mono text-[10px] px-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                3
              </kbd>
              <span>Хорошо</span>
            </button>

            {/* 4. Легко */}
            <button
              onClick={() => handleRate(4)}
              disabled={isSaving}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-500/50 hover:bg-sky-500/10 text-xs font-semibold text-sky-600 dark:text-sky-400 transition-all active:scale-98 disabled:opacity-50"
            >
              <kbd className="font-mono text-[10px] px-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                4
              </kbd>
              <span>Легко</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={handleFlip}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-colors shadow-xs active:scale-98"
          >
            <span>Показать перевод</span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 dark:bg-zinc-200 text-zinc-200 dark:text-zinc-800 border border-zinc-700 dark:border-zinc-300">
              Space
            </kbd>
          </button>
        </div>
      )}
    </div>
  );
};
