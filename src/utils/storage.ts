import type { UserStats } from '../types';

const STATS_KEY = 'polski_helper_stats_v1';
const SETTINGS_KEY = 'polski_helper_settings_v1';

export interface UserSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

const DEFAULT_STATS: UserStats = {
  streak: 0,
  bestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  mistakeHistory: {},
};

const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      streak: Number(parsed.streak) || 0,
      bestStreak: Number(parsed.bestStreak) || 0,
      totalAnswered: Number(parsed.totalAnswered) || 0,
      totalCorrect: Number(parsed.totalCorrect) || 0,
      mistakeHistory: parsed.mistakeHistory || {},
    };
  } catch (e) {
    console.error('Failed to load stats from localStorage', e);
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats to localStorage', e);
  }
}

export function loadUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function recordWordResult(
  wordId: string,
  wordText: string,
  isCorrect: boolean,
  currentStats: UserStats
): UserStats {
  const newStreak = isCorrect ? currentStats.streak + 1 : 0;
  const newBestStreak = Math.max(currentStats.bestStreak, newStreak);
  const newTotalAnswered = currentStats.totalAnswered + 1;
  const newTotalCorrect = currentStats.totalCorrect + (isCorrect ? 1 : 0);

  const updatedMistakes = { ...currentStats.mistakeHistory };

  if (!isCorrect) {
    const existing = updatedMistakes[wordId] || {
      wordId,
      mistakeCount: 0,
      lastSeen: Date.now(),
      wordText,
    };
    updatedMistakes[wordId] = {
      ...existing,
      mistakeCount: existing.mistakeCount + 1,
      lastSeen: Date.now(),
      wordText,
    };
  } else {
    // If correct in error practice, reduce mistake count
    if (updatedMistakes[wordId]) {
      if (updatedMistakes[wordId].mistakeCount <= 1) {
        delete updatedMistakes[wordId];
      } else {
        updatedMistakes[wordId] = {
          ...updatedMistakes[wordId],
          mistakeCount: updatedMistakes[wordId].mistakeCount - 1,
          lastSeen: Date.now(),
        };
      }
    }
  }

  const updatedStats: UserStats = {
    streak: newStreak,
    bestStreak: newBestStreak,
    totalAnswered: newTotalAnswered,
    totalCorrect: newTotalCorrect,
    mistakeHistory: updatedMistakes,
  };

  saveUserStats(updatedStats);
  return updatedStats;
}

export function clearAllMistakes(currentStats: UserStats): UserStats {
  const updated: UserStats = {
    ...currentStats,
    mistakeHistory: {},
  };
  saveUserStats(updated);
  return updated;
}

export function resetAllStats(): UserStats {
  const resetStats: UserStats = {
    streak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    mistakeHistory: {},
  };
  saveUserStats(resetStats);
  return resetStats;
}
