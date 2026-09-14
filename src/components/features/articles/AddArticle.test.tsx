import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddArticle from './AddArticle.tsx';
import {addArticle} from '../../../utils/api/http.ts';
import {makeUser, renderWithProviders} from '../../../test/utils.tsx';

const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

vi.mock('../../../utils/api/http.ts', () => ({ addArticle: vi.fn() }));

const mockedAddArticle = vi.mocked(addArticle);

const LONG_TEXT = 'x'.repeat(200);

const renderForm = (loggedIn = true) => {
  const view = renderWithProviders(<AddArticle />, {
    preloadedState: loggedIn
      ? { auth: { user: makeUser({ firstName: 'Yekutiel', lastName: 'Cohen' }) } }
      : undefined,
  });
  return { ...view, user: userEvent.setup() };
};

const submit = () => screen.getByRole('button', { name: 'Submit' });

// TextArea never renders a <label> for its `label` prop (bugs.md #9), so this
// field cannot be reached by label text the way Title and Author can.
const articleBody = () => document.querySelector('#text') as HTMLTextAreaElement;

describe('AddArticle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAddArticle.mockResolvedValue({ data: makeUser(), statusCode: 200 });
  });

  // Regression guard for bugs.md #9. Invert when TextArea renders its label.
  it('currently leaves the article body without an accessible label', () => {
    renderForm();

    expect(screen.queryByLabelText('Article')).not.toBeInTheDocument();
    expect(articleBody()).toBeInTheDocument();
    expect(articleBody().getAttribute('label')).toBe('Article');
  });

  describe('the author field', () => {
    it('is prefilled from the logged-in user and locked', () => {
      renderForm();

      const author = screen.getByLabelText('Author') as HTMLInputElement;
      expect(author.value).toBe('Yekutiel Cohen');
      expect(author).toBeDisabled();
    });
  });

  describe('validation', () => {
    it('requires a title', async () => {
      const { user } = renderForm();

      await user.click(submit());

      expect(await screen.findByText('Title is required')).toBeInTheDocument();
      expect(mockedAddArticle).not.toHaveBeenCalled();
    });

    it('rejects a title under three characters', async () => {
      const { user } = renderForm();

      await user.type(screen.getByLabelText('Title'), 'ab');
      await user.type(articleBody(), LONG_TEXT);
      await user.click(submit());

      expect(await screen.findByText(/such a short title/)).toBeInTheDocument();
      expect(mockedAddArticle).not.toHaveBeenCalled();
    });

    it('requires article text', async () => {
      const { user } = renderForm();

      await user.type(screen.getByLabelText('Title'), 'A good title');
      await user.click(submit());

      expect(await screen.findByText(/actually providing an article/)).toBeInTheDocument();
    });

    it('rejects an article under 200 characters', async () => {
      const { user } = renderForm();

      await user.type(screen.getByLabelText('Title'), 'A good title');
      await user.type(articleBody(), 'too short');
      await user.click(submit());

      expect(await screen.findByText(/making your article longer/)).toBeInTheDocument();
      expect(mockedAddArticle).not.toHaveBeenCalled();
    });
  });

  describe('submission', () => {
    it('sends the article', async () => {
      const { user } = renderForm();

      await user.type(screen.getByLabelText('Title'), 'A good title');
      await user.type(articleBody(), LONG_TEXT);
      await user.click(submit());

      await waitFor(() =>
        expect(mockedAddArticle).toHaveBeenCalledWith({
          title: 'A good title',
          author: 'Yekutiel Cohen',
          text: LONG_TEXT,
        }),
      );
    });

    it('confirms success and blocks a second submission', async () => {
      const { user } = renderForm();

      await user.type(screen.getByLabelText('Title'), 'A good title');
      await user.type(articleBody(), LONG_TEXT);
      await user.click(submit());

      expect(await screen.findByText(/awaiting the approval of an admin/)).toBeInTheDocument();
      await waitFor(() => expect(submit()).toBeDisabled());
    });

    it('shows an error and stays submittable when the request fails', async () => {
      mockedAddArticle.mockRejectedValue(new Error('Server exploded'));
      const { user } = renderForm();

      await user.type(screen.getByLabelText('Title'), 'A good title');
      await user.type(articleBody(), LONG_TEXT);
      await user.click(submit());

      expect(await screen.findByText('Submition Error')).toBeInTheDocument();
      expect(screen.queryByText(/awaiting the approval/)).not.toBeInTheDocument();
      expect(submit()).toBeEnabled();
    });
  });

  describe('when logged out', () => {
    it('disables submission', () => {
      renderForm(false);

      expect(submit()).toBeDisabled();
    });
  });

  it('goes back without submitting', async () => {
    const { user } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(navigate).toHaveBeenCalledWith(-1);
    expect(mockedAddArticle).not.toHaveBeenCalled();
  });
});
