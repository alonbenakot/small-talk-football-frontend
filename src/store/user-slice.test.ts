import {beforeEach, describe, expect, it, vi} from 'vitest';
import userReducer, {login, logout, triggerPendingArticleIndication} from './user-slice.ts';
import {makeUser} from '../test/utils.tsx';
import {Lang} from '../components/features/language/Lang.ts';

describe('user-slice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts logged out when localStorage is empty', () => {
    expect(userReducer(undefined, { type: '@@INIT' })).toEqual({ user: null });
  });

  describe('login', () => {
    it('stores the user in state', () => {
      const user = makeUser();
      const state = userReducer({ user: null }, login(user));
      expect(state.user).toEqual(user);
    });

    it('persists the user to localStorage under the "user" key', () => {
      const user = makeUser();
      userReducer({ user: null }, login(user));
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual(user);
    });

    it('persists the jwt, which is what jwtAxios reads back', () => {
      userReducer({ user: null }, login(makeUser({ jwt: 'abc.def.ghi' })));
      expect(JSON.parse(localStorage.getItem('user')!).jwt).toBe('abc.def.ghi');
    });
  });

  describe('logout', () => {
    it('clears the user from state', () => {
      const state = userReducer({ user: makeUser() }, logout());
      expect(state.user).toBeNull();
    });

    it('removes the user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify(makeUser()));
      userReducer({ user: makeUser() }, logout());
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('triggerPendingArticleIndication', () => {
    it('sets the flag while preserving the other indications', () => {
      const user = makeUser({
        userIndications: { pendingArticles: false, preferredLanguage: Lang.AMERICAN },
      });
      const state = userReducer({ user }, triggerPendingArticleIndication(true));
      expect(state.user!.userIndications.pendingArticles).toBe(true);
      expect(state.user!.userIndications.preferredLanguage).toBe(Lang.AMERICAN);
    });

    it('can clear the flag again', () => {
      const user = makeUser({
        userIndications: { pendingArticles: true, preferredLanguage: Lang.BRITISH },
      });
      const state = userReducer({ user }, triggerPendingArticleIndication(false));
      expect(state.user!.userIndications.pendingArticles).toBe(false);
    });

    it('is a no-op when nobody is logged in', () => {
      const state = userReducer({ user: null }, triggerPendingArticleIndication(true));
      expect(state.user).toBeNull();
    });
  });

  // initialState is evaluated at module load, so the hydrate path needs a fresh import.
  describe('hydration from localStorage at module load', () => {
    it('restores a persisted user as the initial state', async () => {
      const user = makeUser();
      localStorage.setItem('user', JSON.stringify(user));
      vi.resetModules();

      const freshReducer = (await import('./user-slice.ts')).default;
      expect(freshReducer(undefined, { type: '@@INIT' })).toEqual({ user });
    });

    it('starts logged out when the stored value is the literal "null"', async () => {
      localStorage.setItem('user', 'null');
      vi.resetModules();

      const freshReducer = (await import('./user-slice.ts')).default;
      expect(freshReducer(undefined, { type: '@@INIT' })).toEqual({ user: null });
    });
  });
});
