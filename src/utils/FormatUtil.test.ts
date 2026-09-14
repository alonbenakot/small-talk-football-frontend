import {describe, expect, it} from 'vitest';
import {formatParams, formatString, subStringUntilColon, ordinal} from './FormatUtil.ts';

describe('formatString', () => {
  it('converts SNAKE_CASE to Title Case with spaces', () => {
    expect(formatString('PREMIER_LEAGUE')).toBe('Premier League');
  });

  it('title-cases a single word', () => {
    expect(formatString('ADMIN')).toBe('Admin');
  });

  it('normalises mixed casing', () => {
    expect(formatString('pReMiEr_lEaGuE')).toBe('Premier League');
  });

  it('handles a trailing underscore by emitting an empty segment', () => {
    expect(formatString('CUP_')).toBe('Cup ');
  });

  it('returns an empty string unchanged', () => {
    expect(formatString('')).toBe('');
  });
});

describe('subStringUntilColon', () => {
  it('returns the text before the first colon', () => {
    expect(subStringUntilColon('Offside: what it means')).toBe('Offside');
  });

  it('stops at the first colon when several are present', () => {
    expect(subStringUntilColon('a:b:c')).toBe('a');
  });

  it('returns the whole string when there is no colon', () => {
    expect(subStringUntilColon('No colon here')).toBe('No colon here');
  });

  it('returns an empty string when the colon is first', () => {
    expect(subStringUntilColon(':leading')).toBe('');
  });

  it('returns an empty string unchanged', () => {
    expect(subStringUntilColon('')).toBe('');
  });
});

describe('formatParams', () => {
  it('lowercases and keeps single spaces between words', () => {
    expect(formatParams('Premier League')).toBe('premier league');
  });

  it('replaces non-letters with spaces and collapses the result', () => {
    expect(formatParams('Serie-A  2024!')).toBe('serie a');
  });

  it('trims leading and trailing whitespace produced by stripping', () => {
    expect(formatParams('  123 Cup 45  ')).toBe('cup');
  });

  it('returns an empty string when the input has no letters', () => {
    expect(formatParams('1234-56')).toBe('');
  });

  it('returns an empty string unchanged', () => {
    expect(formatParams('')).toBe('');
  });
});

describe('ordinal', () => {
  it('appends st/nd/rd for 1, 2, 3', () => {
    expect(ordinal(1)).toBe('1st');
    expect(ordinal(2)).toBe('2nd');
    expect(ordinal(3)).toBe('3rd');
  });

  it('appends th for the teens and other numbers', () => {
    expect(ordinal(4)).toBe('4th');
    expect(ordinal(11)).toBe('11th');
    expect(ordinal(12)).toBe('12th');
    expect(ordinal(13)).toBe('13th');
    expect(ordinal(20)).toBe('20th');
  });

  it('handles larger numbers ending in 1, 2, 3', () => {
    expect(ordinal(21)).toBe('21st');
    expect(ordinal(112)).toBe('112th');
  });
});
