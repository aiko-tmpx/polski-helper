import React, { useState } from 'react';
import { supabase, formatUsernameToEmail } from '../utils/supabase';
import { ArrowLeft, Loader2, User, KeyRound } from 'lucide-react';

interface AuthScreenProps {
  onBackToMenu: () => void;
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBackToMenu, onSuccess }) => {
  const [mode, setMode] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      setErrorMessage('Введите логин');
      return;
    }

    if (cleanUsername.length < 3) {
      setErrorMessage('Логин должен содержать минимум 3 символа');
      return;
    }

    if (!/^[a-z0-9_-]+$/i.test(cleanUsername)) {
      setErrorMessage('Логин может содержать только латинские буквы, цифры, дефис и подчеркивание');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);
    const virtualEmail = formatUsernameToEmail(cleanUsername);

    try {
      if (mode === 'sign_in') {
        const { error } = await supabase.auth.signInWithPassword({
          email: virtualEmail,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('Неверный логин или пароль');
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        onSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: virtualEmail,
          password,
          options: {
            data: {
              username: username.trim(),
            },
          },
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            setErrorMessage('Пользователь с таким логином уже существует');
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        // If email confirmation is disabled in Supabase, data.session exists immediately
        if (data.session) {
          onSuccess();
        } else {
          // If confirmation is still enabled in dashboard, try logging in or prompt
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: virtualEmail,
            password,
          });

          if (!signInError) {
            onSuccess();
          } else {
            setErrorMessage(
              'Аккаунт создан, но требует подтверждения. В дашборде Supabase выключите Confirm Email (Authentication → Providers → Email).'
            );
          }
        }
      }
    } catch {
      setErrorMessage('Ошибка соединения с базой. Проверьте подключение.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col gap-6 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>В меню</span>
        </button>

        <span className="text-xs text-zinc-400 font-mono">
          {mode === 'sign_in' ? 'Вход' : 'Регистрация'}
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('sign_in');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-md transition-all text-center ${
              mode === 'sign_in'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('sign_up');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-md transition-all text-center ${
              mode === 'sign_up'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {mode === 'sign_in' ? 'Вход в аккаунт' : 'Создание аккаунта'}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {mode === 'sign_in'
              ? 'Войдите для доступа к персональному словарю и синхронизации'
              : 'Введите логин и пароль для сохранения прогресса повторений'}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-r-lg border-l-2 border-rose-500 bg-rose-500/10 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Логин
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" strokeWidth={1.75} />
              <input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="например, aiko"
                className="w-full pl-9.5 pr-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Пароль
            </label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" strokeWidth={1.75} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="минимум 6 символов"
                className="w-full pl-9.5 pr-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-sm font-medium transition-colors shadow-xs disabled:opacity-50 active:scale-98"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" strokeWidth={1.75} />}
            <span>{mode === 'sign_in' ? 'Войти' : 'Зарегистрироваться'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
