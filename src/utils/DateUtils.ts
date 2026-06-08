/**
 * Date utility functions for date-based match navigation
 */

export const DateUtils = {
  /**
   * Normalizes a date to midnight in local timezone
   * @param date - The date to normalize
   * @returns A new Date object set to midnight (00:00:00.000)
   */
  toMidnight(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  },

  /**
   * Checks if two dates represent the same calendar day
   * @param date1 - First date to compare
   * @param date2 - Second date to compare
   * @returns true if dates are on the same calendar day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    const midnight1 = DateUtils.toMidnight(date1);
    const midnight2 = DateUtils.toMidnight(date2);
    return midnight1.getTime() === midnight2.getTime();
  },

  /**
   * Returns relative label or formatted date string
   * @param date - The date to format
   * @returns "Today", "Yesterday", "Tomorrow", or DD/MM/YY format
   */
  getRelativeDateLabel(date: Date): string {
    const today = DateUtils.toMidnight(new Date());
    const targetMidnight = DateUtils.toMidnight(date);
    const diffDays = Math.round(
      (targetMidnight.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays === 1) return "Tomorrow";

    const day = String(targetMidnight.getDate()).padStart(2, '0');
    const month = String(targetMidnight.getMonth() + 1).padStart(2, '0');
    const year = String(targetMidnight.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  },

  /**
   * Finds the nearest available date to the target
   * Prefers exact match, then future dates, then past dates
   * @param target - The target date to find nearest to
   * @param availableDates - Array of available dates (should be sorted ascending)
   * @returns The nearest available date, or null if availableDates is empty
   */
  findNearestDate(target: Date, availableDates: Date[]): Date | null {
    if (availableDates.length === 0) return null;

    const targetMidnight = DateUtils.toMidnight(target);

    const exactMatch = availableDates.find(d =>
      DateUtils.isSameDay(d, targetMidnight)
    );
    if (exactMatch) return exactMatch;

    const futureDates = availableDates
      .filter(d => d.getTime() > targetMidnight.getTime())
      .sort((a, b) => a.getTime() - b.getTime());

    if (futureDates.length > 0) return futureDates[0];

    // fall back to most recent past date
    return availableDates[availableDates.length - 1];
  }
};
