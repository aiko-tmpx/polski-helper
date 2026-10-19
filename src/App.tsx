import React, { useState, useEffect } from 'react';
import type { ActiveTab, UserStats } from './types';
import {
  loadUserStats,
  loadUserSettings,
  saveUserSettings,
} from './utils/storage';
import { Header } from './components/Header';
import { SprintView } from './components/SprintView';
import { PhrasesView } from './components/PhrasesView';
import { WordBankView } from './components/WordBankView';
import { RulesView } from './components/RulesView';
import { MistakesView } from './components/MistakesView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sprint');
  const [stats, setStats] = useState<UserStats>(() => loadUserStats());
  const [settings, setSettings] = useState(() => loadUserSettings());
  const [sprintFilterIds, setSprintFilterIds] = useState<string[] | undefined>(undefined);

  // Toggle sound
  const toggleSound = () => {
    setSettings((prev) => {
      const next = { ...prev, soundEnabled: !prev.soundEnabled };
      saveUserSettings(next);
      return next;
    });
  };

  const mistakesCount = Object.keys(stats.mistakeHistory || {}).length;

  const handleStartMistakesSprint = (wordIds: string[]) => {
    setSprintFilterIds(wordIds);
    setActiveTab('sprint');
  };

  const handlePracticeSingleWord = (wordId: string) => {
    setSprintFilterIds([wordId]);
    setActiveTab('sprint');
  };

  const handleClearSprintFilter = () => {
    setSprintFilterIds(undefined);
  };

  // Sync title with stats
  useEffect(() => {
    if (stats.streak > 0) {
      document.title = `🔥 ${stats.streak} | Польский тренажер`;
    } else {
      document.title = `Польский тренажер: Множественное число (Niemęskoosobowy)`;
    }
  }, [stats.streak]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Sticky App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // If manually navigating away, clear custom sprint word filter unless on sprint
          if (tab !== 'sprint') {
            setSprintFilterIds(undefined);
          }
        }}
        stats={stats}
        soundEnabled={settings.soundEnabled}
        toggleSound={toggleSound}
        mistakesCount={mistakesCount}
      />

      {/* Main Tab Views */}
      <main className="flex-1 flex flex-col pb-12">
        {activeTab === 'sprint' && (
          <SprintView
            stats={stats}
            setStats={setStats}
            soundEnabled={settings.soundEnabled}
            filterWordIds={sprintFilterIds}
            onClearFilter={handleClearSprintFilter}
          />
        )}

        {activeTab === 'phrases' && (
          <PhrasesView
            stats={stats}
            setStats={setStats}
            soundEnabled={settings.soundEnabled}
          />
        )}

        {activeTab === 'words' && (
          <WordBankView onPracticeWord={handlePracticeSingleWord} />
        )}

        {activeTab === 'rules' && <RulesView />}

        {activeTab === 'mistakes' && (
          <MistakesView
            stats={stats}
            setStats={setStats}
            onStartMistakesSprint={handleStartMistakesSprint}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900">
        <p>
          Тренажер окончаний множественного числа польского языка &bull; rodzaj niemęskoosobowy
        </p>
      </footer>
    </div>
  );
};

export default App;
