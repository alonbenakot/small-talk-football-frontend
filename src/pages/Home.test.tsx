import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen, within} from '@testing-library/react';
import Home from './Home.tsx';
import {HomeLoaderOutput} from '../routes/loaders/HomeLoader.ts';
import {Lang} from '../components/features/language/Lang.ts';
import {makeTestStore, renderWithProviders} from '../test/utils.tsx';

const loaderData = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useLoaderData: () => loaderData(),
}));

const renderHome = () => {
  loaderData.mockReturnValue({
    articles: { data: [], error: null },
    cheatCards: { data: [], error: null },
  } as HomeLoaderOutput);
  const store = makeTestStore({ lang: { lang: Lang.BRITISH } });
  return renderWithProviders(<Home />, { store, route: '/home' });
};

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the five feature tiles', () => {
    renderHome();

    ['Match One-Liners', 'Team & Player One-Liners', 'Cheat Cards', 'Expert Articles', 'Join the Community']
      .forEach((title) => expect(screen.getByRole('heading', { name: title })).toBeInTheDocument());
  });

  it('links the team tile to the teams page', () => {
    renderHome();

    const tile = screen.getByRole('heading', { name: 'Team & Player One-Liners' }).parentElement!;
    expect(within(tile).getByRole('link', { name: /Browse Teams/ })).toHaveAttribute('href', '/teams');
  });

  it('shows the team one-liner example after the match one', () => {
    renderHome();

    expect(screen.getByText(/Or ask about a club as one of their own fans/)).toBeInTheDocument();
    expect(screen.getByText(/Four wins from four under Maresca/)).toBeInTheDocument();
  });

  it('links the getting-started steps to the teams page', () => {
    renderHome();

    expect(screen.getByRole('link', { name: 'Browse the tables' })).toHaveAttribute('href', '/teams');
    expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute('href', '/teams');
    expect(screen.getByRole('link', { name: 'Player One-Liners' })).toHaveAttribute('href', '/teams');
    expect(screen.getByRole('link', { name: 'Match' })).toHaveAttribute('href', '/matches');
  });
});
