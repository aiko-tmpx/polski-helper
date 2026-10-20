import React, { useState, useEffect } from 'react';
import type { ScreenState, AppStats } from './types';
import {
  loadAppStats,
  loadSoundSetting,
  saveSoundSetting,
  resetStats,
} from './utils/storage';
import { MainMenuView } from './components/MainMenuView';
import { GenderModule } from './components/GenderModule';
import { PluralModule } from './components/PluralModule';
import { FullscreenRules } from './components/FullscreenRules';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('menu');
  const [previousScreen, setPreviousScreen] = useState<ScreenState>('menu');

  const [stats, setStats] = useState<AppStats>(() => loadAppStats());
  const [soundEnabled, setSoundEnabled] = useState(() => loadSoundSetting());

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      saveSoundSetting(next);
      return next;
    });
  };

  const handleResetStats = () => {
    const fresh = resetStats();
    setStats(fresh);
  };

  const navigateTo = (screen: ScreenState) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleCloseRules = () => {
    setCurrentScreen(previousScreen);
  };

  useEffect(() => {
    if (stats.streak > 0) {
      document.title = `🔥 ${stats.streak} | Polski Helper`;
    } else {
      document.title = 'Polski Helper — Польская грамматика';
    }
  }, [stats.streak]);

  return (
    <div className="min-h-screen bg-dark-900 text-dark-200 flex flex-col font-sans">
      {/* 1. Main Menu Hub */}
      {currentScreen === 'menu' && (
        <MainMenuView
          onNavigate={navigateTo}
          stats={stats}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
          onResetStats={handleResetStats}
        />
      )}

      {/* 2. Gender Training */}
      {currentScreen === 'train-gender' && (
        <GenderModule
          stats={stats}
          setStats={setStats}
          soundEnabled={soundEnabled}
          onBackToMenu={() => setCurrentScreen('menu')}
          onOpenRules={() => navigateTo('rules-gender')}
        />
      )}

      {/* 3. Plural Training: Nouns */}
      {currentScreen === 'train-plural-nouns' && (
        <PluralModule
          initialSubMode="nouns"
          stats={stats}
          setStats={setStats}
          soundEnabled={soundEnabled}
          onBackToMenu={() => setCurrentScreen('menu')}
          onOpenRules={() => navigateTo('rules-plural')}
        />
      )}

      {/* 4. Plural Training: Adjectives */}
      {currentScreen === 'train-plural-adj' && (
        <PluralModule
          initialSubMode="adjectives"
          stats={stats}
          setStats={setStats}
          soundEnabled={soundEnabled}
          onBackToMenu={() => setCurrentScreen('menu')}
          onOpenRules={() => navigateTo('rules-plural')}
        />
      )}

      {/* 5. Plural Training: Phrases (together) */}
      {currentScreen === 'train-plural-phrases' && (
        <PluralModule
          initialSubMode="phrases"
          stats={stats}
          setStats={setStats}
          soundEnabled={soundEnabled}
          onBackToMenu={() => setCurrentScreen('menu')}
          onOpenRules={() => navigateTo('rules-plural')}
        />
      )}

      {/* 6. Fullscreen Rules: Gender */}
      {currentScreen === 'rules-gender' && (
        <FullscreenRules
          type="gender"
          onClose={handleCloseRules}
        />
      )}

      {/* 7. Fullscreen Rules: Plural */}
      {currentScreen === 'rules-plural' && (
        <FullscreenRules
          type="plural"
          onClose={handleCloseRules}
        />
      )}
    </div>
  );
};

export default App;
