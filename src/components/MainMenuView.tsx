import React, { useState } from 'react';
import type { AppStats, ScreenState } from '../types';
import { Volume2, VolumeX, Trophy, Flame, Play, BookOpen, RotateCcw, ArrowRight } from 'lucide-react';

interface MainMenuViewProps {
  onNavigate: (screen: ScreenState) => void;
  stats: AppStats;
  soundEnabled: boolean;
  toggleSound: () => void;
  onResetStats: () => void;
}

export const MainMenuView: React.FC<MainMenuViewProps> = ({
  onNavigate,
  stats,
  soundEnabled,
  toggleSound,
  onResetStats,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col gap-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-dark-700/80">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl" role="img" aria-label="Флаг Польши">
            🇵🇱
          </span>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-tight flex items-center gap-2">
              <span>Polski Helper</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-dark-800 text-dark-300 border border-dark-700">
                Тренажер
              </span>
            </h1>
            <p className="text-xs text-dark-400">Грамматика и окончания польского языка</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Stats pill */}
          <div className="flex items-center gap-2 bg-dark-850 border border-dark-700/80 rounded-full px-3.5 py-1.5 text-xs">
            <span className="flex items-center gap-1 font-extrabold text-amber-400" title="Текущая серия побед">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{stats.streak}</span>
            </span>
            <span className="text-dark-600 font-mono">/</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold" title="Рекорд">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span>{stats.bestStreak}</span>
            </span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Выключить звук' : 'Включить звук'}
            className="p-2 rounded-full bg-dark-850 border border-dark-700 text-dark-300 hover:text-white active:scale-95 transition-all"
            title={soundEnabled ? 'Звук включен' : 'Звук выключен'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-dark-500" />}
          </button>
        </div>
      </div>

      {/* Intro title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Выберите задание для тренировки
        </h2>
        <p className="text-sm sm:text-base text-dark-300 mt-1 leading-relaxed">
          Спокойно отрабатывайте грамматику в своем темпе с мгновенным разбором правил.
        </p>
      </div>

      {/* Module 1: Rodzaj gramatyczny */}
      <div className="bg-dark-850 border border-dark-700 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm hover:border-dark-600 transition-all">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🏷️</span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-sky-400">
                Модуль 1
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Грамматический род существительных
            </h3>
            <p className="text-sm text-dark-300 mt-1 leading-relaxed">
              Определение мужского (Męski), женского (Żeński) и среднего (Nijaki) рода по окончаниям основы.
            </p>
          </div>
        </div>

        {/* Gender Preview Tags */}
        <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30">
            🟦 ten (согласный: dom, stół)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30">
            🟪 ta (-a: kobieta, szkoła)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
            🟨 to (-o, -e, -ę: okno, morze)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => onNavigate('train-gender')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-black font-black text-sm hover:bg-dark-200 active:scale-95 transition-all shadow-md"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Начать тренировку рода</span>
          </button>

          <button
            onClick={() => onNavigate('rules-gender')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-dark-800 border border-dark-700 text-dark-200 hover:text-white hover:bg-dark-750 font-bold text-sm active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Правило</span>
          </button>
        </div>
      </div>

      {/* Module 2: Liczba mnoga (rodzaj niemęskoosobowy) */}
      <div className="bg-dark-850 border border-dark-700 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm hover:border-dark-600 transition-all">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">✨</span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Модуль 2
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Множественное число (niemęskoosobowy)
          </h3>
          <p className="text-sm text-dark-300 mt-1 leading-relaxed">
            Окончания предметов, животных и женщин. Выберите нужный подрежим тренировки:
          </p>
        </div>

        {/* 3 Submode buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Submode A: Nouns */}
          <button
            onClick={() => onNavigate('train-plural-nouns')}
            className="flex items-center justify-between p-4 rounded-2xl bg-dark-800 border border-dark-700/80 hover:bg-dark-750 hover:border-dark-600 text-left active:scale-[0.99] transition-all group"
          >
            <div>
              <div className="text-base font-black text-white flex items-center gap-2">
                <span>📦 1. Существительные</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  -a (ср. род)
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  -e (шипящие/мягкие)
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  -i (на k/g)
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  -y (твердые)
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>

          {/* Submode B: Adjectives */}
          <button
            onClick={() => onNavigate('train-plural-adj')}
            className="flex items-center justify-between p-4 rounded-2xl bg-dark-800 border border-dark-700/80 hover:bg-dark-750 hover:border-dark-600 text-left active:scale-[0.99] transition-all group"
          >
            <div>
              <div className="text-base font-black text-white flex items-center gap-2">
                <span>🎨 2. Прилагательные</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  -e (дефолт: nowe, duże)
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  -ie (после k/g: drogie)
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>

          {/* Submode C: Phrases (together) */}
          <button
            onClick={() => onNavigate('train-plural-phrases')}
            className="flex items-center justify-between p-4 rounded-2xl bg-dark-800 border border-dark-700/80 hover:bg-dark-750 hover:border-dark-600 text-left active:scale-[0.99] transition-all group"
          >
            <div>
              <div className="text-base font-black text-white flex items-center gap-2">
                <span>🔗 3. Вместе (Словосочетания)</span>
              </div>
              <p className="text-xs text-dark-300 mt-1">
                nowa szkoła &rarr; <strong>nowe szkoły</strong>, długa ulica &rarr; <strong>długie ulice</strong>
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>
        </div>

        {/* Fullscreen rule button for Plural */}
        <div className="pt-1">
          <button
            onClick={() => onNavigate('rules-plural')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-dark-800 border border-dark-700 text-dark-200 hover:text-white hover:bg-dark-750 font-bold text-sm active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Полное правило и шпаргалка (TL;DR)</span>
          </button>
        </div>
      </div>

      {/* Footer & Reset stats */}
      <div className="flex items-center justify-between pt-2 border-t border-dark-700/60 text-xs text-dark-400">
        <span>Всего ответов: <strong className="text-white">{stats.totalAnswered}</strong></span>

        {showConfirmReset ? (
          <div className="flex items-center gap-2">
            <span className="text-white">Сбросить?</span>
            <button
              onClick={() => {
                onResetStats();
                setShowConfirmReset(false);
              }}
              className="text-white underline font-bold"
            >
              Да
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="text-dark-400"
            >
              Отмена
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1 text-dark-400 hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить статистику</span>
          </button>
        )}
      </div>
    </div>
  );
};
