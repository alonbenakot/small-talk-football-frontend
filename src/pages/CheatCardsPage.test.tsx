import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheatCardsPage from './CheatCardsPage.tsx';
import CheatCardModel from '../components/features/cheat-cards/models/CheatCardModel.ts';
import {Lang} from '../components/features/language/Lang.ts';
import {makeTestStore, renderWithProviders} from '../test/utils.tsx';

const navigate = vi.fn();
const params = vi.fn(() => ({}) as { id?: string });
const loaderData = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
  useParams: () => params(),
  useLoaderData: () => loaderData(),
}));

const card = (id: string, category: string, title = `Card ${id}`): CheatCardModel => ({
  id,
  title,
  subtitle: `Subtitle ${id}`,
  infoTexts: [
    { text: `American text ${id}`, lang: Lang.AMERICAN },
    { text: `British text ${id}`, lang: Lang.BRITISH },
  ],
  infoCategory: category,
});

const cards = [
  card('r1', 'RULES'),
  card('r2', 'RULES'),
  card('t1', 'TACTICS'),
];

const renderPage = (opts: {
  id?: string;
  cheatCards?: CheatCardModel[];
  categories?: string[];
  lang?: Lang;
} = {}) => {
  params.mockReturnValue(opts.id ? { id: opts.id } : {});
  loaderData.mockReturnValue({
    cheatCards: { data: opts.cheatCards ?? cards, error: null },
    categories: { data: opts.categories ?? ['RULES', 'TACTICS'], error: null },
  });
  const store = makeTestStore({ lang: { lang: opts.lang ?? Lang.AMERICAN } });
  const view = renderWithProviders(<CheatCardsPage />, { store, route: '/cheat-cards' });
  return { ...view, store, user: userEvent.setup() };
};

describe('CheatCardsPage', () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  describe('initial state', () => {
    it('selects the first category and its first card', () => {
      renderPage();

      // The title also appears in the preview grid, so assert on the body text,
      // which only the displayed card renders.
      expect(screen.getByText('American text r1')).toBeInTheDocument();
      expect(screen.getAllByText('Card r1').length).toBeGreaterThan(0);
    });

    it('reports how many cards the category holds', () => {
      renderPage();

      expect(screen.getByText('2 cards in Rules')).toBeInTheDocument();
    });

    it('shows only the selected category in the preview grid', () => {
      renderPage();

      expect(screen.getAllByText('Subtitle r1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Subtitle r2').length).toBeGreaterThan(0);
      expect(screen.queryByText('Subtitle t1')).not.toBeInTheDocument();
    });
  });

  describe('deep linking by card id', () => {
    it('opens the card named in the url', () => {
      renderPage({ id: 'r2' });

      expect(screen.getByText('American text r2')).toBeInTheDocument();
    });

    it('switches to that card category, even when it is not the first', () => {
      renderPage({ id: 't1' });

      expect(screen.getByText('1 cards in Tactics')).toBeInTheDocument();
      expect(screen.getByText('American text t1')).toBeInTheDocument();
    });

    it('falls back to the first card when the id is unknown', () => {
      renderPage({ id: 'does-not-exist' });

      expect(screen.getByText('American text r1')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('moves to the next card and updates the url', async () => {
      const { user } = renderPage();

      await user.click(screen.getByRole('button', { name: /Next/ }));

      // CheatCardDisplay wraps the card in <AnimatePresence mode="wait">, so the
      // outgoing card stays mounted until its exit animation finishes.
      expect(await screen.findByText('American text r2')).toBeInTheDocument();
      expect(navigate).toHaveBeenCalledWith('/cheat-cards/r2');
    });

    it('moves back to the previous card', async () => {
      const { user } = renderPage({ id: 'r2' });

      await user.click(screen.getByRole('button', { name: /Previous/ }));

      expect(await screen.findByText('American text r1')).toBeInTheDocument();
      expect(navigate).toHaveBeenCalledWith('/cheat-cards/r1');
    });

    it('disables Previous on the first card and Next on the last', async () => {
      const { user } = renderPage();
      expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled();

      await user.click(screen.getByRole('button', { name: /Next/ }));

      await waitFor(() => expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled());
    });

    it('jumps to a card picked from the preview grid', async () => {
      const { user } = renderPage();

      await user.click(screen.getAllByText('Subtitle r2')[0]);

      expect(await screen.findByText('American text r2')).toBeInTheDocument();
      expect(navigate).toHaveBeenCalledWith('/cheat-cards/r2');
    });

    it('switches category and lands on that category first card', async () => {
      const { user } = renderPage();

      await user.click(screen.getByRole('button', { name: 'Tactics' }));

      expect(screen.getByText('1 cards in Tactics')).toBeInTheDocument();
      expect(navigate).toHaveBeenCalledWith('/cheat-cards/t1');
    });
  });

  describe('language', () => {
    it('shows the text matching the selected language', () => {
      renderPage({ lang: Lang.BRITISH });

      expect(screen.getByText('British text r1')).toBeInTheDocument();
      expect(screen.queryByText('American text r1')).not.toBeInTheDocument();
    });

    // Documents bugs.md #8: cheat cards have no Hebrew content, so the page
    // rewrites the GLOBAL language during render and never restores it.
    it('silently switches a Hebrew user to American, globally', () => {
      const { store } = renderPage({ lang: Lang.HEBREW });

      expect(store.getState().lang.lang).toBe(Lang.AMERICAN);
      expect(screen.getByText('American text r1')).toBeInTheDocument();
    });
  });

  describe('empty data', () => {
    it('renders without a card when the category has none', () => {
      renderPage({ cheatCards: [], categories: ['RULES'] });

      expect(screen.getByText('0 cards in Rules')).toBeInTheDocument();
      expect(screen.queryByText('American text r1')).not.toBeInTheDocument();
    });
  });
});
