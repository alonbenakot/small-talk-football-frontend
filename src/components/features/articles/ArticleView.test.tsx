import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleView from './ArticleView.tsx';
import ArticleModel from './models/ArticleModel.ts';
import {deleteArticle, publishArticle, removeArticle} from '../../../utils/api/http.ts';
import {UserRole} from '../auth/models/User.ts';
import {makeUser, renderWithProviders} from '../../../test/utils.tsx';

const navigate = vi.fn();
const loaderData = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
  useLoaderData: () => loaderData(),
}));

vi.mock('../../../utils/api/http.ts', () => ({
  publishArticle: vi.fn(),
  removeArticle: vi.fn(),
  deleteArticle: vi.fn(),
  UNAUTHORIZED_MSG: 'You are unauthorized to make this action.',
}));

const article = (published: boolean): ArticleModel => ({
  id: 'a1',
  title: 'Offside explained',
  author: 'Yekutiel Cohen',
  text: 'First paragraph.\n\nSecond paragraph.',
  published,
});

const renderView = (opts: { role?: UserRole; published?: boolean } = {}) => {
  loaderData.mockReturnValue({ data: article(opts.published ?? false) });
  const view = renderWithProviders(<ArticleView />, {
    preloadedState: opts.role ? { auth: { user: makeUser({ role: opts.role }) } } : undefined,
  });
  return { ...view, user: userEvent.setup() };
};

describe('ArticleView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(publishArticle).mockResolvedValue({ data: article(true), statusCode: 200 });
    vi.mocked(removeArticle).mockResolvedValue({ data: article(false), statusCode: 200 });
    vi.mocked(deleteArticle).mockResolvedValue({ data: null, statusCode: 200 });
  });

  describe('rendering', () => {
    it('shows the title and author', () => {
      renderView();

      expect(screen.getByText('Offside explained')).toBeInTheDocument();
      expect(screen.getByText('Yekutiel Cohen')).toBeInTheDocument();
    });

    it('splits the body on blank lines into paragraphs', () => {
      renderView();

      expect(screen.getByText('First paragraph.')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
    });

    it('goes back when Back is pressed', async () => {
      const { user } = renderView();

      await user.click(screen.getByRole('button', { name: 'Back' }));

      expect(navigate).toHaveBeenCalledWith(-1);
    });
  });

  describe('as a member', () => {
    it('hides the admin controls', () => {
      renderView({ role: UserRole.MEMBER });

      expect(screen.queryByRole('button', { name: 'Publish' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    });
  });

  describe('as a logged-out visitor', () => {
    it('hides the admin controls', () => {
      renderView();

      expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    });
  });

  describe('as an admin', () => {
    it('offers Publish for an unpublished article', () => {
      renderView({ role: UserRole.ADMIN, published: false });

      expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument();
    });

    it('offers Remove for a published article', () => {
      renderView({ role: UserRole.ADMIN, published: true });

      expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    });

    it('publishes and navigates back', async () => {
      const { user } = renderView({ role: UserRole.ADMIN, published: false });

      await user.click(screen.getByRole('button', { name: 'Publish' }));

      await waitFor(() => expect(publishArticle).toHaveBeenCalledWith('a1'));
      expect(navigate).toHaveBeenCalledWith(-1);
      expect(removeArticle).not.toHaveBeenCalled();
    });

    // Removing an article puts it back in the pending queue, so the indicator returns.
    it('raises the pending-articles indication when removing', async () => {
      const { user, store } = renderView({ role: UserRole.ADMIN, published: true });

      await user.click(screen.getByRole('button', { name: 'Remove' }));

      await waitFor(() => expect(removeArticle).toHaveBeenCalledWith('a1'));
      expect(store.getState().auth.user?.userIndications.pendingArticles).toBe(true);
    });

    it('does not raise the indication when publishing', async () => {
      const { user, store } = renderView({ role: UserRole.ADMIN, published: false });

      await user.click(screen.getByRole('button', { name: 'Publish' }));

      await waitFor(() => expect(publishArticle).toHaveBeenCalled());
      expect(store.getState().auth.user?.userIndications.pendingArticles).toBe(false);
    });

    it('stays put and shows an error when the action fails', async () => {
      vi.mocked(publishArticle).mockRejectedValue(new Error('nope'));
      const { user } = renderView({ role: UserRole.ADMIN, published: false });

      await user.click(screen.getByRole('button', { name: 'Publish' }));

      expect(await screen.findByText(/unauthorized/)).toBeInTheDocument();
      expect(navigate).not.toHaveBeenCalled();
    });

    describe('deleting', () => {
      it('asks for confirmation first', async () => {
        const { user } = renderView({ role: UserRole.ADMIN });

        await user.click(screen.getByRole('button', { name: 'Delete' }));

        expect(screen.getByText('Deleting Article')).toBeInTheDocument();
        expect(deleteArticle).not.toHaveBeenCalled();
      });

      it('deletes and navigates back on confirmation', async () => {
        const { user } = renderView({ role: UserRole.ADMIN });

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await user.click(screen.getByRole('button', { name: 'Yes' }));

        await waitFor(() => expect(deleteArticle).toHaveBeenCalledWith('a1'));
        expect(navigate).toHaveBeenCalledWith(-1);
      });

      it('abandons the deletion on "No"', async () => {
        const { user } = renderView({ role: UserRole.ADMIN });

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await user.click(screen.getByRole('button', { name: 'No' }));

        expect(deleteArticle).not.toHaveBeenCalled();
        expect(screen.queryByText('Deleting Article')).not.toBeInTheDocument();
      });
    });
  });
});
