import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm.tsx';
import {login as loginApi} from '../../../../utils/api/http.ts';
import {Lang} from '../../language/Lang.ts';
import {makeUser, renderWithProviders} from '../../../../test/utils.tsx';

vi.mock('../../../../utils/api/http.ts', () => ({ login: vi.fn() }));

const mockedLogin = vi.mocked(loginApi);

const renderForm = (preloadedState?: Parameters<typeof renderWithProviders>[1]) => {
  const closeForm = vi.fn();
  const handleSwitchForm = vi.fn();
  const view = renderWithProviders(
    <LoginForm isModalOpen closeForm={closeForm} handleSwitchForm={handleSwitchForm} />,
    preloadedState,
  );
  return { ...view, closeForm, handleSwitchForm, user: userEvent.setup() };
};

const submit = () => screen.getByRole('button', { name: 'Login' });

describe('LoginForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('validation', () => {
    it('requires an email', async () => {
      const { user } = renderForm();

      await user.click(submit());

      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(mockedLogin).not.toHaveBeenCalled();
    });

    // The input is type="email", so native constraint validation blocks the
    // submit before react-hook-form runs. The custom `pattern` message is
    // therefore unreachable here (bugs.md #7); the browser shows its own.
    it('blocks submission of a malformed email', async () => {
      const { user } = renderForm();
      const email = screen.getByLabelText('Email') as HTMLInputElement;

      await user.type(email, 'not-an-email');
      await user.type(screen.getByLabelText('Password'), 'secret1');
      await user.click(submit());

      expect(email.validity.typeMismatch).toBe(true);
      expect(mockedLogin).not.toHaveBeenCalled();
      expect(screen.queryByText('Enter a valid email address')).not.toBeInTheDocument();
    });

    it('requires a password', async () => {
      const { user } = renderForm();

      await user.type(screen.getByLabelText('Email'), 'a@b.com');
      await user.click(submit());

      expect(await screen.findByText(/give us your password/)).toBeInTheDocument();
    });

    it('requires a password of at least six characters', async () => {
      const { user } = renderForm();

      await user.type(screen.getByLabelText('Email'), 'a@b.com');
      await user.type(screen.getByLabelText('Password'), '12345');
      await user.click(submit());

      expect(await screen.findByText(/less than 6 characters/)).toBeInTheDocument();
      expect(mockedLogin).not.toHaveBeenCalled();
    });
  });

  describe('submission', () => {
    it('sends the credentials to the api', async () => {
      mockedLogin.mockResolvedValue({ data: makeUser(), statusCode: 200, jwt: 'tok' });
      const { user } = renderForm();

      await user.type(screen.getByLabelText('Email'), 'a@b.com');
      await user.type(screen.getByLabelText('Password'), 'secret1');
      await user.click(submit());

      expect(mockedLogin).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret1' });
    });

    it('stores the user with the jwt from the envelope, not the body', async () => {
      const returned = makeUser({ jwt: undefined });
      mockedLogin.mockResolvedValue({ data: returned, statusCode: 200, jwt: 'envelope-token' });
      const { user, store } = renderForm();

      await user.type(screen.getByLabelText('Email'), 'a@b.com');
      await user.type(screen.getByLabelText('Password'), 'secret1');
      await user.click(submit());

      expect(store.getState().auth.user?.jwt).toBe('envelope-token');
    });

    it('adopts the user preferred language', async () => {
      mockedLogin.mockResolvedValue({
        data: makeUser({ userIndications: { pendingArticles: false, preferredLanguage: Lang.AMERICAN } }),
        statusCode: 200,
        jwt: 'tok',
      });
      const { user, store } = renderForm();

      await user.type(screen.getByLabelText('Email'), 'a@b.com');
      await user.type(screen.getByLabelText('Password'), 'secret1');
      await user.click(submit());

      expect(store.getState().lang.lang).toBe(Lang.AMERICAN);
    });

    it('closes the form after a successful login', async () => {
      mockedLogin.mockResolvedValue({ data: makeUser(), statusCode: 200, jwt: 'tok' });
      const { user, closeForm } = renderForm();

      await user.type(screen.getByLabelText('Email'), 'a@b.com');
      await user.type(screen.getByLabelText('Password'), 'secret1');
      await user.click(submit());

      expect(closeForm).toHaveBeenCalled();
    });

    it('shows the backend message and stays open when login fails', async () => {
      mockedLogin.mockRejectedValue(new Error('Bad credentials'));
      const { user, closeForm, store } = renderForm();

      await user.type(screen.getByLabelText('Email'), 'a@b.com');
      await user.type(screen.getByLabelText('Password'), 'secret1');
      await user.click(submit());

      expect(await screen.findByText('Failed to Login')).toBeInTheDocument();
      expect(closeForm).not.toHaveBeenCalled();
      expect(store.getState().auth.user).toBeNull();
    });

    // Documents bugs.md #6: an absent preferredLanguage overwrites the store with undefined.
    it('sets the language to undefined when the user has no preferred language', async () => {
      mockedLogin.mockResolvedValue({
        data: makeUser({ userIndications: undefined as never }),
        statusCode: 200,
        jwt: 'tok',
      });
      const { user, store } = renderForm();

      await user.type(screen.getByLabelText('Email'), 'a@b.com');
      await user.type(screen.getByLabelText('Password'), 'secret1');
      await user.click(submit());

      expect(store.getState().lang.lang).toBeUndefined();
    });
  });

  describe('when already logged in', () => {
    it('explains the situation and disables the submit button', () => {
      renderForm({ preloadedState: { auth: { user: makeUser() } } });

      expect(screen.getByText('You are already logged in')).toBeInTheDocument();
      expect(submit()).toBeDisabled();
    });
  });

  describe('navigation', () => {
    it('offers a switch to the signup form', async () => {
      const { user, handleSwitchForm } = renderForm();

      await user.click(screen.getByRole('button', { name: 'Not a member' }));

      expect(handleSwitchForm).toHaveBeenCalled();
    });

    it('closes on cancel without calling the api', async () => {
      const { user, closeForm } = renderForm();

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(closeForm).toHaveBeenCalled();
      expect(mockedLogin).not.toHaveBeenCalled();
    });
  });
});
