import React, { useState, useEffect } from 'react';
import type { ScreenState } from './types';
import { Header } from './components/Header';
import { MainMenuView } from './components/MainMenuView';
import { GenderModule } from './components/GenderModule';
import { PluralModule } from './components/PluralModule';
import { FullscreenRules } from './components/FullscreenRules';
import { type Theme, getInitialTheme, applyTheme } from './utils/theme';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('menu');
  const [previousScreen, setPreviousScreen] = useState<ScreenState>('menu');
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.title = 'Polski Helper — Польская грамматика';
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navigateTo = (screen: ScreenState) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleCloseRules = () => {
    setCurrentScreen(previousScreen);
  };

  const handleLogoClick = () => {
    setCurrentScreen('menu');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-150 selection:bg-rose-500/20 selection:text-rose-900 dark:selection:text-rose-200">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogoClick={handleLogoClick}
      />

      <main className="flex-1 flex flex-col">
        {/* 1. Main Menu Hub */}
        {currentScreen === 'menu' && (
          <MainMenuView onNavigate={navigateTo} />
        )}

        {/* 2. Gender Training */}
        {currentScreen === 'train-gender' && (
          <GenderModule
            onBackToMenu={() => setCurrentScreen('menu')}
            onOpenRules={() => navigateTo('rules-gender')}
          />
        )}

        {/* 3. Plural Training: Nouns */}
        {currentScreen === 'train-plural-nouns' && (
          <PluralModule
            key="nouns"
            initialSubMode="nouns"
            onBackToMenu={() => setCurrentScreen('menu')}
            onOpenRules={() => navigateTo('rules-plural')}
          />
        )}

        {/* 4. Plural Training: Adjectives */}
        {currentScreen === 'train-plural-adj' && (
          <PluralModule
            key="adjectives"
            initialSubMode="adjectives"
            onBackToMenu={() => setCurrentScreen('menu')}
            onOpenRules={() => navigateTo('rules-plural')}
          />
        )}

        {/* 5. Plural Training: Phrases */}
        {currentScreen === 'train-plural-phrases' && (
          <PluralModule
            key="phrases"
            initialSubMode="phrases"
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
      </main>
    </div>
  );
};

export default App;
