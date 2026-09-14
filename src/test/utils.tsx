import {ReactElement, ReactNode} from 'react';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import {render, RenderOptions} from '@testing-library/react';
import userSlice from '../store/user-slice.ts';
import langSlice from '../store/lang-slice.ts';
import {RootState} from '../store/store.ts';
import User, {UserRole} from '../components/features/auth/models/User.ts';
import {Lang} from '../components/features/language/Lang.ts';

/**
 * Builds a store with the same reducer map as src/store/store.ts, so the typed
 * hooks (useAuthStore / useLangStore) behave exactly as they do in the app.
 */
export const makeTestStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: { auth: userSlice, lang: langSlice },
    preloadedState: preloadedState as RootState | undefined,
  });

export type TestStore = ReturnType<typeof makeTestStore>;

type Options = Omit<RenderOptions, 'wrapper'> & {
  preloadedState?: Partial<RootState>;
  store?: TestStore;
  route?: string;
};

export const renderWithProviders = (ui: ReactElement, options: Options = {}) => {
  const { preloadedState, store = makeTestStore(preloadedState), route = '/', ...rest } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...rest }) };
};

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  email: 'yekutiel.cohen@gmail.com',
  firstName: 'Yekutiel',
  lastName: 'Cohen',
  priorFootballKnowledge: false,
  userIndications: { pendingArticles: false, preferredLanguage: Lang.BRITISH },
  role: UserRole.MEMBER,
  jwt: 'test-jwt',
  ...overrides,
});
