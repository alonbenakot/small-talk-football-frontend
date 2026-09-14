import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticlesPage from './ArticlesPage.tsx';
import ArticleModel from '../components/features/articles/models/ArticleModel.ts';
import {Lang} from '../components/features/language/Lang.ts';
import {makeUser, renderWithProviders} from '../test/utils.tsx';

const navigate = vi.fn();
const loaderData = vi.fn();
const searchParams = vi.fn(() => new URLSearchParams());

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
  useLoaderData: () => loaderData(),
  useSearchParams: () => [searchParams(), vi.fn()],
}));

vi.mock('../components/ui/button/ProtectedButton.tsx', () => ({
  default: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

const articles: ArticleModel[] = [
  { id: '1', title: 'Offside explained', author: 'Yekutiel', text: 'x', published: true },
  { id: '2', title: 'The false nine', author: 'Dana', text: 'y', published: true },
];

const renderPage = (opts: {
  filter?: string;
  articles?: ArticleModel[] | undefined;
  pendingArticles?: boolean;
} = {}) => {
  searchParams.mockReturnValue(new URLSearchParams(opts.filter ? `filter=${opts.filter}` : ''));
  loaderData.mockReturnValue({ data: 'articles' in opts ? opts.articles : articles });
  const view = renderWithProviders(<ArticlesPage />, {
    preloadedState: {
      auth: {
        user: makeUser({
          userIndications: {
            pendingArticles: opts.pendingArticles ?? false,
            preferredLanguage: Lang.BRITISH,
          },
        }),
      },
    },
  });
  return { ...view, user: userEvent.setup() };
};

describe('ArticlesPage', () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  describe('heading and filter', () => {
    it('defaults to the published filter', () => {
      renderPage();

      expect(screen.getByText('Published Articles')).toBeInTheDocument();
    });

    it('reflects the pending filter from the url', () => {
      renderPage({ filter: 'pending' });

      expect(screen.getByText('Pending Articles')).toBeInTheDocument();
    });
  });

  describe('the filter toggle', () => {
    it('is hidden for a user with no pending articles', () => {
      renderPage();

      // The article cards are links too, so target the toggle by its label.
      expect(screen.queryByRole('link', { name: 'Pending' })).not.toBeInTheDocument();
    });

    it('appears when the user has a pending-articles indication', () => {
      renderPage({ pendingArticles: true });

      expect(screen.getByRole('link', { name: 'Pending' })).toHaveAttribute('href', '/?filter=pending');
    });

    it('offers the way back while viewing pending articles', () => {
      renderPage({ filter: 'pending' });

      expect(screen.getByRole('link', { name: 'Published' })).toHaveAttribute('href', '/?filter=published');
    });
  });

  describe('article list', () => {
    it('renders every article with a link to it', () => {
      renderPage();

      expect(screen.getByText('Offside explained')).toBeInTheDocument();
      expect(screen.getByText('The false nine')).toBeInTheDocument();
      expect(screen.getAllByRole('link')).toHaveLength(2);
    });

    it('renders nothing when the loader returned no articles', () => {
      renderPage({ articles: undefined });

      expect(screen.queryByText('Offside explained')).not.toBeInTheDocument();
    });
  });

  describe('posting an article', () => {
    it('navigates to the post-article route', async () => {
      const { user } = renderPage();

      await user.click(screen.getByRole('button', { name: 'Post Article' }));

      expect(navigate).toHaveBeenCalledWith('post-article');
    });
  });

  // When a user opens ?filter=pending and nothing comes back, the page clears the
  // indication and redirects, guarded by a ref so it happens at most once.
  describe('empty pending redirect', () => {
    it('clears the indication and returns to published', () => {
      const { store } = renderPage({ filter: 'pending', articles: undefined, pendingArticles: true });

      expect(navigate).toHaveBeenCalledWith('?filter=published', { replace: true });
      expect(store.getState().auth.user?.userIndications.pendingArticles).toBe(false);
    });

    it('redirects only once', () => {
      const { rerender } = renderPage({ filter: 'pending', articles: undefined, pendingArticles: true });

      rerender(<ArticlesPage />);

      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('does not redirect when pending articles exist', () => {
      renderPage({ filter: 'pending', pendingArticles: true });

      expect(navigate).not.toHaveBeenCalled();
    });

    it('does not redirect on the published filter', () => {
      renderPage({ articles: undefined });

      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
