import React from 'react';
import { Sun, Moon, User as UserIcon, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { Theme } from '../utils/theme';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onLogoClick?: () => void;
  user?: User | null;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  isAuthScreen?: boolean;
  activeTab?: 'practice' | 'dictionary';
  onNavigateTab?: (tab: 'practice' | 'dictionary') => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onLogoClick,
  user,
  onOpenAuth,
  onSignOut,
  isAuthScreen,
  activeTab = 'practice',
  onNavigateTab,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm transition-colors duration-150">
      <div className="max-w-2xl mx-auto px-4 h-13 sm:h-14 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={onLogoClick}
            className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 rounded"
          >
            Polski Helper
          </button>

          {!isAuthScreen && onNavigateTab && (
            <nav className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 text-xs">
              <button
                onClick={() => onNavigateTab('practice')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'practice'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Тренировки
              </button>
              <button
                onClick={() => onNavigateTab('dictionary')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'dictionary'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Словарь
              </button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* User Auth Controls */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-mono text-zinc-500 dark:text-zinc-400 max-w-[160px] truncate">
                {user.email}
              </span>
              <button
                onClick={onSignOut}
                title="Выйти из аккаунта"
                aria-label="Выйти из аккаунта"
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 active:scale-95 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          ) : !isAuthScreen ? (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors active:scale-95 shadow-2xs"
            >
              <UserIcon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} />
              <span>Войти</span>
            </button>
          ) : null}

          {/* Theme Toggle */}
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
      </div>
    </header>
  );
};
