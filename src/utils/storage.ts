import type { AppStats } from '../types';

const STATS_KEY = 'polski_helper_stats_v2';
const SETTINGS_KEY = 'polski_helper_settings_v2';

const DEFAULT_STATS: AppStats = {
  streak: 0,
  bestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
};

export function loadAppStats(): AppStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      streak: Number(parsed.streak) || 0,
      bestStreak: Number(parsed.bestStreak) || 0,
      totalAnswered: Number(parsed.totalAnswered) || 0,
      totalCorrect: Number(parsed.totalCorrect) || 0,
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveAppStats(stats: AppStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

export function recordAnswer(isCorrect: boolean, currentStats: AppStats): AppStats {
  const newStreak = isCorrect ? currentStats.streak + 1 : 0;
  const newBestStreak = Math.max(currentStats.bestStreak, newStreak);
  const updated: AppStats = {
    streak: newStreak,
    bestStreak: newBestStreak,
    totalAnswered: currentStats.totalAnswered + 1,
    totalCorrect: currentStats.totalCorrect + (isCorrect ? 1 : 0),
  };
  saveAppStats(updated);
  return updated;
}

export function resetStats(): AppStats {
  saveAppStats(DEFAULT_STATS);
  return DEFAULT_STATS;
}

export function loadSoundSetting(): boolean {
  try {
    const val = localStorage.getItem(SETTINGS_KEY);
    return val !== null ? JSON.parse(val) : true;
  } catch {
    return true;
  }
}

export function saveSoundSetting(enabled: boolean): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(enabled));
  } catch (e) {
    console.error('Failed to save sound setting', e);
  }
}
