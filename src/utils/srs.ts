import type { UserWord } from '../types';

export type SRSRating = 1 | 2 | 3 | 4;

export interface SRSResult {
  interval_days: number;
  repetition_count: number;
  ease_factor: number;
  next_review_at: string;
}

/**
 * Calculates next review parameters based on Anki-style SM-2 algorithm.
 * Ratings:
 * 1 - Again (failed: reset interval, review again today)
 * 2 - Hard (interval 1 day, small penalty to ease)
 * 3 - Good (interval expands 1 -> 3 -> interval * ease)
 * 4 - Easy (interval expands with bonus multiplier)
 */
export function calculateNextSRS(
  word: Pick<UserWord, 'interval_days' | 'repetition_count' | 'ease_factor'>,
  rating: SRSRating
): SRSResult {
  const currentEase = word.ease_factor || 2.5;
  const currentCount = word.repetition_count || 0;
  const currentInterval = word.interval_days || 0;

  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  if (rating === 1) {
    // Again: reset interval, repeat in current session
    const newEase = Math.max(1.3, Number((currentEase - 0.2).toFixed(2)));
    return {
      interval_days: 0,
      repetition_count: 0,
      ease_factor: newEase,
      // 10 minutes later or today
      next_review_at: new Date(now + 10 * 60 * 1000).toISOString(),
    };
  }

  if (rating === 2) {
    // Hard: interval 1 day, slight penalty to ease
    const newEase = Math.max(1.3, Number((currentEase - 0.15).toFixed(2)));
    const newInterval = Math.max(1, currentInterval > 0 ? Math.round(currentInterval * 1.2) : 1);
    return {
      interval_days: newInterval,
      repetition_count: currentCount + 1,
      ease_factor: newEase,
      next_review_at: new Date(now + newInterval * ONE_DAY_MS).toISOString(),
    };
  }

  if (rating === 3) {
    // Good: standard expansion
    let newInterval: number;
    if (currentCount === 0 || currentInterval === 0) {
      newInterval = 1;
    } else if (currentCount === 1) {
      newInterval = 3;
    } else {
      newInterval = Math.max(4, Math.round(currentInterval * currentEase));
    }

    return {
      interval_days: newInterval,
      repetition_count: currentCount + 1,
      ease_factor: currentEase,
      next_review_at: new Date(now + newInterval * ONE_DAY_MS).toISOString(),
    };
  }

  // rating === 4: Easy
  const newEase = Number((currentEase + 0.15).toFixed(2));
  let newInterval: number;
  if (currentCount === 0 || currentInterval === 0) {
    newInterval = 2;
  } else if (currentCount === 1) {
    newInterval = 5;
  } else {
    newInterval = Math.max(6, Math.round(currentInterval * currentEase * 1.3));
  }

  return {
    interval_days: newInterval,
    repetition_count: currentCount + 1,
    ease_factor: newEase,
    next_review_at: new Date(now + newInterval * ONE_DAY_MS).toISOString(),
  };
}
