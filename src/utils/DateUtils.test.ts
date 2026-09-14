import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {DateUtils} from './DateUtils.ts';

describe('DateUtils.toMidnight', () => {
  it('zeroes the time portion', () => {
    const result = DateUtils.toMidnight(new Date(2025, 2, 14, 17, 42, 31, 500));
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('keeps the calendar day', () => {
    const result = DateUtils.toMidnight(new Date(2025, 2, 14, 23, 59));
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(14);
  });

  it('returns a new Date and does not mutate its input', () => {
    const input = new Date(2025, 2, 14, 17, 42);
    const result = DateUtils.toMidnight(input);
    expect(result).not.toBe(input);
    expect(input.getHours()).toBe(17);
  });
});

describe('DateUtils.isSameDay', () => {
  it('is true for the same day at different times', () => {
    expect(
      DateUtils.isSameDay(new Date(2025, 2, 14, 0, 1), new Date(2025, 2, 14, 23, 59)),
    ).toBe(true);
  });

  it('is false for adjacent days', () => {
    expect(
      DateUtils.isSameDay(new Date(2025, 2, 14, 23, 59), new Date(2025, 2, 15, 0, 1)),
    ).toBe(false);
  });

  it('is false across a month boundary', () => {
    expect(
      DateUtils.isSameDay(new Date(2025, 2, 31, 12), new Date(2025, 3, 1, 12)),
    ).toBe(false);
  });

  it('is false across a year boundary', () => {
    expect(
      DateUtils.isSameDay(new Date(2024, 11, 31, 12), new Date(2025, 0, 1, 12)),
    ).toBe(false);
  });
});

describe('DateUtils.getRelativeDateLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mid-afternoon, so "today" is unambiguous regardless of the surrounding hours.
    vi.setSystemTime(new Date(2025, 2, 14, 15, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('labels the current day "Today" regardless of time of day', () => {
    expect(DateUtils.getRelativeDateLabel(new Date(2025, 2, 14, 2, 0))).toBe('Today');
    expect(DateUtils.getRelativeDateLabel(new Date(2025, 2, 14, 23, 30))).toBe('Today');
  });

  it('labels the previous day "Yesterday"', () => {
    expect(DateUtils.getRelativeDateLabel(new Date(2025, 2, 13, 20, 0))).toBe('Yesterday');
  });

  it('labels the next day "Tomorrow"', () => {
    expect(DateUtils.getRelativeDateLabel(new Date(2025, 2, 15, 9, 0))).toBe('Tomorrow');
  });

  it('falls back to zero-padded DD/MM/YY for more distant dates', () => {
    expect(DateUtils.getRelativeDateLabel(new Date(2025, 2, 9, 12, 0))).toBe('09/03/25');
    expect(DateUtils.getRelativeDateLabel(new Date(2025, 10, 22, 12, 0))).toBe('22/11/25');
  });

  it('formats a date two days out rather than using a relative label', () => {
    expect(DateUtils.getRelativeDateLabel(new Date(2025, 2, 16, 12, 0))).toBe('16/03/25');
  });
});

describe('DateUtils.findNearestDate', () => {
  // The fixture list the app supplies is sorted ascending.
  const sorted = [
    new Date(2025, 2, 10),
    new Date(2025, 2, 12),
    new Date(2025, 2, 16),
    new Date(2025, 2, 20),
  ];

  it('returns null for an empty list', () => {
    expect(DateUtils.findNearestDate(new Date(2025, 2, 14), [])).toBeNull();
  });

  it('prefers an exact calendar-day match, ignoring the time of day', () => {
    const result = DateUtils.findNearestDate(new Date(2025, 2, 12, 18, 30), sorted);
    expect(result).toBe(sorted[1]);
  });

  it('returns the earliest future date when there is no exact match', () => {
    const result = DateUtils.findNearestDate(new Date(2025, 2, 14), sorted);
    expect(result).toBe(sorted[2]);
  });

  it('returns the first date when the target precedes the whole list', () => {
    const result = DateUtils.findNearestDate(new Date(2025, 1, 1), sorted);
    expect(result).toBe(sorted[0]);
  });

  it('falls back to the most recent past date when the target is after the whole list', () => {
    const result = DateUtils.findNearestDate(new Date(2025, 3, 1), sorted);
    expect(result).toBe(sorted[3]);
  });

  // Documents the sorted-input assumption stated in the JSDoc: the past-date
  // fallback returns the last element rather than searching for the latest one.
  it('returns the last element, not the latest date, when the list is unsorted', () => {
    const unsorted = [new Date(2025, 2, 20), new Date(2025, 2, 10), new Date(2025, 2, 12)];
    const result = DateUtils.findNearestDate(new Date(2025, 3, 1), unsorted);
    expect(result).toBe(unsorted[2]);
    expect(result).not.toBe(unsorted[0]);
  });
});
