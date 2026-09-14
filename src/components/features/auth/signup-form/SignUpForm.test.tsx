import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpForm from './SignUpForm.tsx';
import {signUp as signUpApi} from '../../../../utils/api/http.ts';
import {Lang} from '../../language/Lang.ts';
import {makeUser, renderWithProviders} from '../../../../test/utils.tsx';

vi.mock('../../../../utils/api/http.ts', () => ({ signUp: vi.fn() }));

const mockedSignUp = vi.mocked(signUpApi);

const renderForm = (preloadedState?: Parameters<typeof renderWithProviders>[1]) => {
  const closeForm = vi.fn();
  const handleSwitchForm = vi.fn();
  const view = renderWithProviders(
    <SignUpForm isModalOpen closeForm={closeForm} handleSwitchForm={handleSwitchForm} />,
    preloadedState,
  );
  return { ...view, closeForm, handleSwitchForm, user: userEvent.setup() };
};

const submit = () => screen.getByRole('button', { name: 'Sign Up' });

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('First Name'), 'Yekutiel');
  await user.type(screen.getByLabelText('Last Name'), 'Cohen');
  await user.type(screen.getByLabelText('Email'), 'yekutiel@example.com');
  await user.type(screen.getByLabelText('Password'), 'secret1');
};

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // The component logs its effect state on every run.
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('validation', () => {
    it('requires a first name', async () => {
      const { user } = renderForm();

      await user.click(submit());

      expect(await screen.findByText('Please fill out your first name.')).toBeInTheDocument();
      expect(mockedSignUp).not.toHaveBeenCalled();
    });

    it('requires a last name', async () => {
      const { user } = renderForm();

      await user.type(screen.getByLabelText('First Name'), 'Yekutiel');
      await user.click(submit());

      expect(await screen.findByText('Please fill out your last name.')).toBeInTheDocument();
    });

    it('requires a password of at least six characters', async () => {
      const { user } = renderForm();

      await user.type(screen.getByLabelText('First Name'), 'Yekutiel');
      await user.type(screen.getByLabelText('Last Name'), 'Cohen');
      await user.type(screen.getByLabelText('Email'), 'yekutiel@example.com');
      await user.type(screen.getByLabelText('Password'), '12345');
      await user.click(submit());

      expect(await screen.findByText(/at least 6 characters/)).toBeInTheDocument();
      expect(mockedSignUp).not.toHaveBeenCalled();
    });
  });

  describe('submission', () => {
    it('sends the whole form to the api', async () => {
      mockedSignUp.mockResolvedValue({ data: makeUser(), statusCode: 200, jwt: 'tok' });
      const { user } = renderForm();

      await fillValidForm(user);
      await user.click(submit());

      expect(mockedSignUp).toHaveBeenCalledWith({
        firstName: 'Yekutiel',
        lastName: 'Cohen',
        email: 'yekutiel@example.com',
        password: 'secret1',
        priorFootballKnowledge: false,
        userIndications: { preferredLanguage: Lang.BRITISH },
      });
    });

    it('defaults the preferred language to British', async () => {
      mockedSignUp.mockResolvedValue({ data: makeUser(), statusCode: 200, jwt: 'tok' });
      const { user } = renderForm();

      await fillValidForm(user);
      await user.click(submit());

      expect(mockedSignUp.mock.calls[0][0].userIndications.preferredLanguage).toBe(Lang.BRITISH);
    });

    it('sends the chosen preferred language', async () => {
      mockedSignUp.mockResolvedValue({ data: makeUser(), statusCode: 200, jwt: 'tok' });
      const { user } = renderForm();

      await fillValidForm(user);
      await user.click(screen.getByText('Hebrew'));
      await user.click(submit());

      expect(mockedSignUp.mock.calls[0][0].userIndications.preferredLanguage).toBe(Lang.HEBREW);
    });

    it('sends the prior-knowledge checkbox when ticked', async () => {
      mockedSignUp.mockResolvedValue({ data: makeUser(), statusCode: 200, jwt: 'tok' });
      const { user } = renderForm();

      await fillValidForm(user);
      await user.click(screen.getByLabelText('Prior Football Knowledge'));
      await user.click(submit());

      expect(mockedSignUp.mock.calls[0][0].priorFootballKnowledge).toBe(true);
    });

    it('logs the new user in and closes the form', async () => {
      mockedSignUp.mockResolvedValue({
        data: makeUser({ jwt: undefined }),
        statusCode: 200,
        jwt: 'envelope-token',
      });
      const { user, closeForm, store } = renderForm();

      await fillValidForm(user);
      await user.click(submit());

      expect(store.getState().auth.user?.jwt).toBe('envelope-token');
      expect(closeForm).toHaveBeenCalled();
    });

    it('adopts the returned preferred language', async () => {
      mockedSignUp.mockResolvedValue({
        data: makeUser({ userIndications: { pendingArticles: false, preferredLanguage: Lang.AMERICAN } }),
        statusCode: 200,
        jwt: 'tok',
      });
      const { user, store } = renderForm();

      await fillValidForm(user);
      await user.click(submit());

      expect(store.getState().lang.lang).toBe(Lang.AMERICAN);
    });

    it('shows the backend message and stays open when signup fails', async () => {
      mockedSignUp.mockRejectedValue(new Error('Email already registered'));
      const { user, closeForm, store } = renderForm();

      await fillValidForm(user);
      await user.click(submit());

      expect(await screen.findByText('SignUp Error')).toBeInTheDocument();
      expect(closeForm).not.toHaveBeenCalled();
      expect(store.getState().auth.user).toBeNull();
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
    it('offers a switch to the login form', async () => {
      const { user, handleSwitchForm } = renderForm();

      await user.click(screen.getByRole('button', { name: 'Already a member' }));

      expect(handleSwitchForm).toHaveBeenCalled();
    });

    it('closes on cancel without calling the api', async () => {
      const { user, closeForm } = renderForm();

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(closeForm).toHaveBeenCalled();
      expect(mockedSignUp).not.toHaveBeenCalled();
    });
  });
});
