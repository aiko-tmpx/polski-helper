import React from 'react';
import type { ActiveTab, UserStats } from '../types';
import { Zap, BookOpen, Bookmark, AlertTriangle, Volume2, VolumeX, Sparkles, Trophy } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: UserStats;
  soundEnabled: boolean;
  toggleSound: () => void;
  mistakesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  soundEnabled,
  toggleSound,
  mistakesCount,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'sprint', label: 'Спринт', icon: <Zap className="w-4 h-4" /> },
    { id: 'phrases', label: 'Словосочетания', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'words', label: 'База слов', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'rules', label: 'Правила', icon: <Bookmark className="w-4 h-4" /> },
    {
      id: 'mistakes',
      label: 'Ошибки',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: mistakesCount,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-2xl mx-auto px-3 py-2.5 sm:px-4">
        {/* Top brand and quick stats bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Флаг Польши">
              🇵🇱
            </span>
            <div>
              <h1 className="text-base font-bold text-slate-100 tracking-tight leading-tight flex items-center gap-1.5">
                Польский тренажер
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Мн. число
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">rodzaj niemęskoosobowy</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak and Record stats */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-full px-2.5 py-1 text-xs">
              <span className="flex items-center gap-1 text-amber-400 font-bold" title="Текущая серия">
                🔥 {stats.streak}
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]" title="Лучший рекорд">
                <Trophy className="w-3 h-3" /> {stats.bestStreak}
              </span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Выключить звук' : 'Включить звук'}
              className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 transition-all"
              title={soundEnabled ? 'Звук включен' : 'Звук выключен'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 relative active:scale-95 ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-rose-600' : 'bg-rose-500/80 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
