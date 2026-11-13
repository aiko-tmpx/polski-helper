import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { X, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email || !password) {
      setErrorMessage('Пожалуйста, заполните email и пароль');
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
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('Неверный email или пароль');
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        onSuccess();
        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data.session) {
          onSuccess();
          onClose();
        } else {
          // If email confirmation is enabled in Supabase
          setInfoMessage('Регистрация успешна! Проверьте вашу почту для подтверждения входа.');
        }
      }
    } catch {
      setErrorMessage('Не удалось связаться с сервером. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={1.75} />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {mode === 'sign_in' ? 'Вход в аккаунт' : 'Регистрация'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {mode === 'sign_in'
              ? 'Войдите для синхронизации словаря и прогресса'
              : 'Создайте аккаунт для сохранения ваших слов'}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-r-lg border-l-2 border-rose-500 bg-rose-500/10 text-xs text-rose-700 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Info message */}
        {infoMessage && (
          <div className="mb-4 p-3 rounded-r-lg border-l-2 border-emerald-500 bg-emerald-500/10 text-xs text-emerald-800 dark:text-emerald-300">
            {infoMessage}
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
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Пароль
            </label>
            <input
              type="password"
              autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
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

        {/* Toggle Mode */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
          {mode === 'sign_in' ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('sign_up');
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                className="font-medium text-zinc-900 dark:text-zinc-100 underline hover:opacity-80 transition-opacity"
              >
                Зарегистрироваться
              </button>
            </p>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('sign_in');
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                className="font-medium text-zinc-900 dark:text-zinc-100 underline hover:opacity-80 transition-opacity"
              >
                Войти
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
