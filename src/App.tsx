import React, { useState, useEffect } from 'react';
import type { AppTab, AppStats } from './types';
import {
  loadAppStats,
  loadSoundSetting,
  saveSoundSetting,
  resetStats,
} from './utils/storage';
import { Header } from './components/Header';
import { GenderModule } from './components/GenderModule';
import { PluralModule } from './components/PluralModule';
import { RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('gender');
  const [stats, setStats] = useState<AppStats>(() => loadAppStats());
  const [soundEnabled, setSoundEnabled] = useState(() => loadSoundSetting());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      saveSoundSetting(next);
      return next;
    });
  };

  const handleReset = () => {
    const fresh = resetStats();
    setStats(fresh);
    setShowConfirmReset(false);
  };

  useEffect(() => {
    if (stats.streak > 0) {
      document.title = `(${stats.streak}) Polski Helper`;
    } else {
      document.title = 'Polski Helper — Род и множественное число';
    }
  }, [stats.streak]);

  return (
    <div className="min-h-screen bg-black text-dark-100 flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
      />

      {/* Main Module View */}
      <main className="flex-1 flex flex-col justify-start">
        {activeTab === 'gender' && (
          <GenderModule
            stats={stats}
            setStats={setStats}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'plural' && (
          <PluralModule
            stats={stats}
            setStats={setStats}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="py-4 border-t border-dark-800 text-center text-xs text-dark-500 max-w-lg mx-auto w-full px-4 flex items-center justify-between">
        <span>Всего ответов: {stats.totalAnswered}</span>

        {showConfirmReset ? (
          <div className="flex items-center gap-2">
            <span>Сбросить?</span>
            <button
              onClick={handleReset}
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
            <RotateCcw className="w-3 h-3" />
            <span>Сброс</span>
          </button>
        )}
      </footer>
    </div>
  );
};

export default App;
