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
    // Hard: interval 1 day for new, or slight expansion for reviews
    const newEase = Math.max(1.3, Number((currentEase - 0.15).toFixed(2)));
    const newInterval =
      currentCount === 0 || currentInterval === 0
        ? 1
        : Math.max(currentInterval + 1, Math.round(currentInterval * 1.2));

    return {
      interval_days: newInterval,
      repetition_count: currentCount + 1,
      ease_factor: newEase,
      next_review_at: new Date(now + newInterval * ONE_DAY_MS).toISOString(),
    };
  }

  if (rating === 3) {
    // Good: 2 days for initial new word, 4 for second step, then exponential expansion
    let newInterval: number;
    if (currentCount === 0 || currentInterval === 0) {
      newInterval = 2;
    } else if (currentCount === 1) {
      newInterval = 4;
    } else {
      newInterval = Math.max(currentInterval + 2, Math.round(currentInterval * currentEase));
    }

    return {
      interval_days: newInterval,
      repetition_count: currentCount + 1,
      ease_factor: currentEase,
      next_review_at: new Date(now + newInterval * ONE_DAY_MS).toISOString(),
    };
  }

  // rating === 4: Easy: 4 days immediately for new word, then aggressive expansion
  const newEase = Number((currentEase + 0.15).toFixed(2));
  let newInterval: number;
  if (currentCount === 0 || currentInterval === 0) {
    newInterval = 4;
  } else if (currentCount === 1) {
    newInterval = 7;
  } else {
    newInterval = Math.max(currentInterval + 3, Math.round(currentInterval * currentEase * 1.3));
  }

  return {
    interval_days: newInterval,
    repetition_count: currentCount + 1,
    ease_factor: newEase,
    next_review_at: new Date(now + newInterval * ONE_DAY_MS).toISOString(),
  };
}
