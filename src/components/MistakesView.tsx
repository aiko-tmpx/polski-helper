import React, { useState } from 'react';
import type { UserStats } from '../types';
import { POLISH_WORDS } from '../data/words';
import { clearAllMistakes, resetAllStats } from '../utils/storage';
import { speakPolish, triggerHaptic } from '../utils/audio';
import {
  Trophy,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Play,
  Volume2,
  Percent,
} from 'lucide-react';

interface MistakesViewProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  onStartMistakesSprint: (wordIds: string[]) => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({
  stats,
  setStats,
  onStartMistakesSprint,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const mistakeKeys = Object.keys(stats.mistakeHistory || {});
  const mistakeWords = mistakeKeys
    .map((id) => {
      const wordObj = POLISH_WORDS.find((w) => w.id === id);
      const historyItem = stats.mistakeHistory[id];
      return {
        id,
        count: historyItem?.mistakeCount || 1,
        word: wordObj,
        text: historyItem?.wordText || id,
      };
    })
    .filter((item) => item.word !== undefined);

  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0;

  const handleClearMistakes = () => {
    triggerHaptic('click');
    const updated = clearAllMistakes(stats);
    setStats(updated);
  };

  const handleResetAll = () => {
    triggerHaptic('error');
    const reset = resetAllStats();
    setStats(reset);
    setShowConfirmReset(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 flex flex-col gap-5 text-slate-100">
      {/* Title */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span>Статистика и ошибки</span>
        </h2>
        <p className="text-xs text-slate-400">
          Данные сохраняются локально в вашем браузере
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Streak */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Серия</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
            {stats.streak}
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Рекорд</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
            {stats.bestStreak}
          </div>
        </div>

        {/* Total Answered */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Всего ответов</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-400 mt-2">
            {stats.totalAnswered}
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Точность</span>
            <Percent className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-2">
            {accuracy}%
          </div>
        </div>
      </div>

      {/* Mistakes Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              История ошибок ({mistakeWords.length})
            </h3>
          </div>
          {mistakeWords.length > 0 && (
            <button
              onClick={handleClearMistakes}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Очистить список</span>
            </button>
          )}
        </div>

        {mistakeWords.length > 0 ? (
          <>
            {/* Action button to train mistakes */}
            <button
              onClick={() => onStartMistakesSprint(mistakeWords.map((m) => m.id))}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/20 hover:from-rose-600 hover:to-amber-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Тренировать эти {mistakeWords.length} слов в спринте</span>
            </button>

            {/* List of failed words */}
            <div className="flex flex-col gap-2 mt-1 max-h-[350px] overflow-y-auto pr-1">
              {mistakeWords.map(({ id, count, word }) => {
                if (!word) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => speakPolish(word.plural)}
                        className="p-1 rounded-full text-slate-400 hover:text-rose-400 active:scale-95"
                        title="Прослушать"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span>{word.singular}</span>
                          <span className="text-slate-500">&rarr;</span>
                          <span className="text-rose-300 font-extrabold">{word.plural}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{word.translation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Ошибок: {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8 bg-slate-900/50 rounded-xl border border-dashed border-slate-800 p-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-200">
              Список ошибок пуст!
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Когда вы допустите ошибку в Спринте или Словосочетаниях, сложные слова появятся здесь для целенаправленного повторения.
            </p>
          </div>
        )}
      </div>

      {/* Reset Stats section */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-500">
        <span>Сброс всей статистики приложения</span>
        {showConfirmReset ? (
          <div className="flex items-center gap-2">
            <span className="text-rose-400">Точно сбросить?</span>
            <button
              onClick={handleResetAll}
              className="px-2 py-1 rounded bg-rose-600 text-white font-semibold hover:bg-rose-700"
            >
              Да
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Нет
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить всё</span>
          </button>
        )}
      </div>
    </div>
  );
};
