import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onBackToMenu: () => void;
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBackToMenu, onSuccess }) => {
  const [mode, setMode] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Введите корректный email');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'sign_in') {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('Неверный email или пароль');
          } else if (error.message.includes('Email not confirmed')) {
            setErrorMessage('Email не подтвержден. Проверьте почту или выключите Confirm email в дашборде Supabase.');
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        onSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            setErrorMessage('Пользователь с таким email уже существует');
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        if (data.session) {
          onSuccess();
        } else {
          // If email confirmation is enabled on Supabase, an email was sent
          setInfoMessage(`На почту ${cleanEmail} отправлено письмо для подтверждения.`);
        }
      }
    } catch {
      setErrorMessage('Ошибка соединения с базой');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-12 sm:py-16 flex flex-col gap-4 animate-fadeIn">
      {/* Main Card */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5 shadow-xs">
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('sign_in');
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            className={`py-1.5 px-3 rounded-md transition-all text-center ${
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
              setInfoMessage(null);
            }}
            className={`py-1.5 px-3 rounded-md transition-all text-center ${
              mode === 'sign_up'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Info message */}
        {infoMessage && (
          <div className="p-2.5 rounded-lg border-l-2 border-emerald-500 bg-emerald-500/10 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
            {infoMessage}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-2.5 rounded-lg border-l-2 border-rose-500 bg-rose-500/10 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Пароль
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-sm font-medium transition-colors shadow-xs disabled:opacity-50 active:scale-98"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" strokeWidth={1.75} />}
            <span>{mode === 'sign_in' ? 'Войти' : 'Создать аккаунт'}</span>
          </button>
        </form>
      </div>

      {/* Return to menu link */}
      <button
        type="button"
        onClick={onBackToMenu}
        className="text-center text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors py-1"
      >
        ← Вернуться в меню
      </button>
    </div>
  );
};
