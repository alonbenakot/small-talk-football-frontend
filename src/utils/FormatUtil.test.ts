import {describe, expect, it} from 'vitest';
import {formatParams, formatString, subStringUntilColon} from './FormatUtil.ts';

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
