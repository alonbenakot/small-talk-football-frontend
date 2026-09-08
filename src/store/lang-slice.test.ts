import {describe, expect, it} from 'vitest';
import langReducer, {toggleLang} from './lang-slice.ts';
import {Lang} from '../components/features/language/Lang.ts';

describe('lang-slice', () => {
  it('defaults to Hebrew', () => {
    expect(langReducer(undefined, { type: '@@INIT' })).toEqual({ lang: Lang.HEBREW });
  });

  it('sets the language from the action payload', () => {
    const state = langReducer({ lang: Lang.HEBREW }, toggleLang(Lang.BRITISH));
    expect(state.lang).toBe(Lang.BRITISH);
  });

  // The action is named "toggle" but is a plain setter — dispatching the same
  // language twice must not flip back to anything else.
  it('is a setter, not a toggle', () => {
    let state = langReducer({ lang: Lang.HEBREW }, toggleLang(Lang.AMERICAN));
    state = langReducer(state, toggleLang(Lang.AMERICAN));
    expect(state.lang).toBe(Lang.AMERICAN);
  });

  it('leaves the previous state object untouched', () => {
    const initial = { lang: Lang.HEBREW };
    langReducer(initial, toggleLang(Lang.BRITISH));
    expect(initial.lang).toBe(Lang.HEBREW);
  });
});
