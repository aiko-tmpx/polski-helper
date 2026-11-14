import React, { useState, useMemo } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface ParsedWord {
  word: string;
  translation: string;
  notes?: string;
}

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Parse lines or JSON in real time
  const parsedWords = useMemo<ParsedWord[]>(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return [];

    // 1. Try parsing as JSON array
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const json = JSON.parse(trimmed);
        if (Array.isArray(json)) {
          return json
            .filter((item) => item && typeof item.word === 'string' && typeof item.translation === 'string')
            .map((item) => ({
              word: item.word.trim(),
              translation: item.translation.trim(),
              notes: item.notes ? String(item.notes).trim() : undefined,
            }))
            .filter((w) => w.word && w.translation);
        }
      } catch {
        // Fall back to line-by-line parsing
      }
    }

    // 2. Line by line parsing with common delimiters: " - ", " — ", ";", "\t"
    const lines = trimmed.split('\n');
    const result: ParsedWord[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      let parts: string[] = [];

      if (line.includes('\t')) {
        parts = line.split('\t');
      } else if (line.includes(' — ')) {
        parts = line.split(' — ');
      } else if (line.includes(' - ')) {
        parts = line.split(' - ');
      } else if (line.includes(';')) {
        parts = line.split(';');
      } else if (line.includes(':')) {
        parts = line.split(':');
      }

      let word = '';
      let translation = '';
      let notes: string | undefined;

      if (parts.length >= 2) {
        word = parts[0].trim();
        translation = parts[1].trim();
        notes = parts.slice(2).join(' ').trim() || undefined;
      } else {
        // Line without delimiter or with trailing delimiter like "polski - "
        word = line.replace(/[\s\-—:;.]+$/, '').trim();
      }

      if (word) {
        result.push({
          word,
          translation: translation || '—',
          notes,
        });
      }
    }

    return result;
  }, [inputText]);

  if (!isOpen) return null;

  const handleImport = async () => {
    if (parsedWords.length === 0) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const now = new Date().toISOString();
      const rows = parsedWords.map((item) => ({
        user_id: userId,
        word: item.word,
        translation: item.translation,
        notes: item.notes || null,
        interval_days: 0,
        repetition_count: 0,
        ease_factor: 2.5,
        next_review_at: now,
      }));

      // Insert in batches of 100 to prevent payload overflow
      const batchSize = 100;
      for (let i = 0; i < rows.length; i += batchSize) {
        const chunk = rows.slice(i, i + batchSize);
        const { error } = await supabase.from('user_words').insert(chunk);
        if (error) throw error;
      }

      setInputText('');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при сохранении слов в базу';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Массовый импорт слов
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Вставьте строки <code className="font-mono text-zinc-700 dark:text-zinc-300">слово - перевод</code> или просто список слов
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Text Area */}
        <div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={"kot - кот\npies - собака\nsamochód - автомобиль\nspotkanie - встреча"}
            rows={8}
            className="w-full p-3 rounded-lg text-xs font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors resize-none"
          />
        </div>

        {/* Status / Live Preview */}
        <div className="flex items-center justify-between text-xs">
          <div className="font-mono text-zinc-500 dark:text-zinc-400">
            {parsedWords.length > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Распознано: {parsedWords.length} слов
              </span>
            ) : (
              <span>Строк пока не обнаружено</span>
            )}
          </div>

          {parsedWords.length > 0 && (
            <span className="text-zinc-400 dark:text-zinc-500 truncate max-w-[200px]">
              Пример: {parsedWords[0].word} → {parsedWords[0].translation}
            </span>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-2.5 rounded-lg border-l-2 border-rose-500 bg-rose-500/10 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isLoading || parsedWords.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-colors disabled:opacity-50 active:scale-98 shadow-xs"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.75} />
            ) : (
              <Upload className="w-3.5 h-3.5" strokeWidth={1.75} />
            )}
            <span>
              {parsedWords.length > 0 ? `Импортировать ${parsedWords.length} слов` : 'Импортировать'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
