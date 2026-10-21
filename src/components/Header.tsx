import React from 'react';
import { Sun, Moon } from 'lucide-react';
import type { Theme } from '../utils/theme';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onLogoClick,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm transition-colors duration-150">
      <div className="max-w-2xl mx-auto px-4 h-13 sm:h-14 flex items-center justify-between">
        <button
          onClick={onLogoClick}
          className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 rounded"
        >
          Polski Helper
        </button>

        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 active:scale-95 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" strokeWidth={1.75} />
          ) : (
            <Moon className="w-4 h-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </header>
  );
};
