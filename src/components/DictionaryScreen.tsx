import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import type { UserWord } from '../types';
import { supabase } from '../utils/supabase';
import { speakPolish } from '../utils/audio';
import { BulkImportModal } from './BulkImportModal';
import { Search, Plus, Upload, Trash2, Volume2, Loader2, ArrowLeft } from 'lucide-react';

interface DictionaryScreenProps {
  user: User | null;
  onNavigateToAuth: () => void;
  onBackToMenu: () => void;
}

export const DictionaryScreen: React.FC<DictionaryScreenProps> = ({
  user,
  onNavigateToAuth,
  onBackToMenu,
}) => {
  const [words, setWords] = useState<UserWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddingInline, setIsAddingInline] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nowTimestamp] = useState(() => Date.now());

  const fetchWords = useCallback(async () => {
    if (!user) {
      setWords([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_words')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWords(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при загрузке словаря';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    if (!user) {
      return;
    }

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('user_words')
          .select('*')
          .order('created_at', { ascending: false });

        if (isMounted) {
          if (error) throw error;
          setWords(data || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Ошибка при загрузке словаря';
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
  }, [user]);

  const handleDeleteWord = async (id: string) => {
    try {
      const { error } = await supabase.from('user_words').delete().eq('id', id);
      if (error) throw error;
      setWords((prev) => prev.filter((w) => w.id !== id));
    } catch {
      setErrorMessage('Не удалось удалить слово');
    }
  };

  const handleAddSingleWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newWord.trim() || !newTranslation.trim()) return;

    setIsSubmittingNew(true);
    setErrorMessage(null);

    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('user_words')
        .insert([
          {
            user_id: user.id,
            word: newWord.trim(),
            translation: newTranslation.trim(),
            interval_days: 0,
            repetition_count: 0,
            ease_factor: 2.5,
            next_review_at: now,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setWords((prev) => [data, ...prev]);
        setNewWord('');
        setNewTranslation('');
        setIsAddingInline(false);
      }
    } catch {
      setErrorMessage('Ошибка при добавлении слова');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Filter words by search query
  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return words;
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q)
    );
  }, [words, searchQuery]);

  // Unauthenticated state
  if (!user) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center gap-4 animate-fadeIn">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Персональный словарь
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          Войдите в аккаунт, чтобы сохранять слова, синхронизировать прогресс и повторять лексику по карточкам.
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

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToMenu}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors mr-1 sm:hidden"
              title="Назад"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Словарь
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {words.length} слов
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            База сохраненных слов для тренировок и повторения
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingInline((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Добавить</span>
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-colors shadow-xs active:scale-98"
          >
            <Upload className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Импорт</span>
          </button>
        </div>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="p-3 rounded-lg border-l-2 border-rose-500 bg-rose-500/10 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Inline Add Form */}
      {isAddingInline && (
        <form
          onSubmit={handleAddSingleWord}
          className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-xs animate-fadeIn"
        >
          <input
            type="text"
            required
            placeholder="Слово по-польски"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="w-full sm:flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          />
          <input
            type="text"
            required
            placeholder="Перевод"
            value={newTranslation}
            onChange={(e) => setNewTranslation(e.target.value)}
            className="w-full sm:flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsAddingInline(false)}
              className="px-2.5 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmittingNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-colors disabled:opacity-50"
            >
              {isSubmittingNew && <Loader2 className="w-3 h-3 animate-spin" strokeWidth={1.75} />}
              <span>Сохранить</span>
            </button>
          </div>
        </form>
      )}

      {/* Search Input */}
      {words.length > 0 && (
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по слову или переводу..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors shadow-2xs"
          />
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-12 flex items-center justify-center text-zinc-400 gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
          <span>Загрузка словаря...</span>
        </div>
      )}

      {/* Word List */}
      {!isLoading && words.length > 0 && (
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {filteredWords.length > 0 ? (
            filteredWords.map((item) => {
              const isDueToday = new Date(item.next_review_at).getTime() <= nowTimestamp;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 sm:px-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => speakPolish(item.word)}
                      title="Прослушать произношение"
                      className="p-1 rounded-md text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.word}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {item.translation}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        isDueToday
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {isDueToday ? 'сегодня' : `${item.interval_days} дн.`}
                    </span>

                    <button
                      onClick={() => handleDeleteWord(item.id)}
                      title="Удалить слово"
                      className="p-1 rounded-md text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors opacity-70 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-zinc-400">
              По запросу <span className="font-semibold text-zinc-700 dark:text-zinc-300">«{searchQuery}»</span> ничего не найдено
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && words.length === 0 && (
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 sm:p-12 text-center flex flex-col items-center gap-3 shadow-xs">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            В словаре пока нет слов
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
            Импортируйте список слов или добавьте первые слова вручную, чтобы тренировать их по карточкам.
          </p>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-colors shadow-xs active:scale-98"
          >
            <Upload className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Импортировать слова</span>
          </button>
        </div>
      )}

      {/* Bulk Import Modal */}
      {user && (
        <BulkImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={fetchWords}
          userId={user.id}
        />
      )}
    </div>
  );
};
