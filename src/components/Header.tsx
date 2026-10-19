import React from 'react';
import type { AppTab, AppStats } from '../types';
import { Volume2, VolumeX, Trophy, Flame } from 'lucide-react';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  stats: AppStats;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  soundEnabled,
  toggleSound,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-dark-700/80">
      <div className="max-w-xl mx-auto px-4 py-3">
        {/* Top bar: Brand & Stats */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇵🇱</span>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white leading-none">
                Polski Helper
              </h1>
              <p className="text-[10px] text-dark-400 mt-0.5">Тренировка польской грамматики</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stats pill */}
            <div className="flex items-center gap-2 bg-dark-900 border border-dark-700/80 rounded-full px-3 py-1 text-xs">
              <span className="flex items-center gap-1 font-bold text-white" title="Текущая серия">
                <Flame className="w-3.5 h-3.5 text-white" />
                <span>{stats.streak}</span>
              </span>
              <span className="text-dark-600">/</span>
              <span className="flex items-center gap-1 text-dark-400" title="Рекорд">
                <Trophy className="w-3.5 h-3.5 text-dark-400" />
                <span>{stats.bestStreak}</span>
              </span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Выключить звук' : 'Включить звук'}
              className="p-1.5 rounded-full bg-dark-900 border border-dark-700 text-dark-300 hover:text-white active:scale-95 transition-all"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-dark-500" />}
            </button>
          </div>
        </div>

        {/* 2 Main Modules Navigation */}
        <nav className="grid grid-cols-2 gap-1.5 bg-dark-900 p-1 rounded-xl border border-dark-700">
          <button
            onClick={() => setActiveTab('gender')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'gender'
                ? 'bg-white text-black shadow-sm'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            1. Род слова (M / Ż / N)
          </button>

          <button
            onClick={() => setActiveTab('plural')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'plural'
                ? 'bg-white text-black shadow-sm'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            2. Множественное число
          </button>
        </nav>
      </div>
    </header>
  );
};
