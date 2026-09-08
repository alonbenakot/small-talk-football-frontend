import {describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoggedInArea from './LoggedInArea.tsx';
import {UserRole} from '../models/User.ts';
import {makeUser, renderWithProviders} from '../../../../test/utils.tsx';

const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

const renderArea = (role: UserRole) => {
  navigate.mockClear();
  const view = renderWithProviders(<LoggedInArea />, {
    preloadedState: { auth: { user: makeUser({ role, firstName: 'Yekutiel' }) } },
  });
  return { ...view, user: userEvent.setup() };
};

const greeting = () => screen.getByText(/Hi Yekutiel/);

describe('LoggedInArea', () => {
  it('greets the logged-in user by first name', () => {
    renderArea(UserRole.MEMBER);

    expect(greeting()).toBeInTheDocument();
  });

  it('logs the user out and clears the persisted session', async () => {
    const { user, store } = renderArea(UserRole.MEMBER);
    localStorage.setItem('user', JSON.stringify(makeUser()));

    await user.click(screen.getByRole('button', { name: 'Logout' }));

    expect(store.getState().auth.user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  describe('as an admin', () => {
    // This greeting is the only entry point to /admin anywhere in the UI.
    it('navigates to the admin dashboard when the name is clicked', async () => {
      const { user } = renderArea(UserRole.ADMIN);

      await user.click(greeting());

      expect(navigate).toHaveBeenCalledWith('/admin');
    });

    it('marks the name as clickable', () => {
      renderArea(UserRole.ADMIN);

      expect(greeting()).toHaveClass('cursor-pointer');
    });
  });

  describe('as a member', () => {
    it('does not navigate when the name is clicked', async () => {
      const { user } = renderArea(UserRole.MEMBER);

      await user.click(greeting());

      expect(navigate).not.toHaveBeenCalled();
    });

    it('does not present the name as clickable', () => {
      renderArea(UserRole.MEMBER);

      expect(greeting()).not.toHaveClass('cursor-pointer');
    });
  });
});
