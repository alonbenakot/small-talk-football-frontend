import {describe, expect, it, vi} from 'vitest';
import {act, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProtectedButton from './ProtectedButton.tsx';
import {login} from '../../../store/user-slice.ts';
import {makeUser, renderWithProviders} from '../../../test/utils.tsx';

/**
 * Stands in for the real auth modal, which would otherwise pull in the login
 * form and the network. Exposes a control that closes the modal the same way
 * LoginForm does once a login succeeds.
 */
vi.mock('../../features/auth/user-form/UserForm.tsx', () => ({
  default: ({ setIsOpenModal }: { setIsOpenModal: (open: boolean) => void }) => (
    <div data-testid="auth-modal">
      <button onClick={() => setIsOpenModal(false)}>close-modal</button>
    </div>
  ),
}));

const modal = () => screen.queryByTestId('auth-modal');

describe('ProtectedButton', () => {
  describe('when logged in', () => {
    it('fires onClick immediately without opening the modal', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      renderWithProviders(
        <ProtectedButton buttonType="primary" onClick={onClick}>Publish</ProtectedButton>,
        { preloadedState: { auth: { user: makeUser() } } },
      );

      await user.click(screen.getByRole('button', { name: 'Publish' }));

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(modal()).not.toBeInTheDocument();
    });
  });

  describe('when logged out', () => {
    it('suppresses onClick and opens the auth modal', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      renderWithProviders(
        <ProtectedButton buttonType="primary" onClick={onClick}>Publish</ProtectedButton>,
      );

      await user.click(screen.getByRole('button', { name: 'Publish' }));

      expect(onClick).not.toHaveBeenCalled();
      expect(modal()).toBeInTheDocument();
    });

    it('replays the pending click once the user logs in and the modal closes', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      const { store } = renderWithProviders(
        <ProtectedButton buttonType="primary" onClick={onClick}>Publish</ProtectedButton>,
      );

      await user.click(screen.getByRole('button', { name: 'Publish' }));
      expect(onClick).not.toHaveBeenCalled();

      act(() => { store.dispatch(login(makeUser())); });
      await user.click(screen.getByRole('button', { name: 'close-modal' }));

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(modal()).not.toBeInTheDocument();
    });

    it('does not replay the click more than once on later re-renders', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      const { store, rerender } = renderWithProviders(
        <ProtectedButton buttonType="primary" onClick={onClick}>Publish</ProtectedButton>,
      );

      await user.click(screen.getByRole('button', { name: 'Publish' }));
      act(() => { store.dispatch(login(makeUser())); });
      await user.click(screen.getByRole('button', { name: 'close-modal' }));
      expect(onClick).toHaveBeenCalledTimes(1);

      rerender(<ProtectedButton buttonType="primary" onClick={onClick}>Publish</ProtectedButton>);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not replay anything when a user logs in without a pending click', () => {
      const onClick = vi.fn();
      const { store } = renderWithProviders(
        <ProtectedButton buttonType="primary" onClick={onClick}>Publish</ProtectedButton>,
      );

      act(() => { store.dispatch(login(makeUser())); });

      expect(onClick).not.toHaveBeenCalled();
    });

    it('holds the click while the modal is still open even though a user is present', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      const { store } = renderWithProviders(
        <ProtectedButton buttonType="primary" onClick={onClick}>Publish</ProtectedButton>,
      );

      await user.click(screen.getByRole('button', { name: 'Publish' }));
      act(() => { store.dispatch(login(makeUser())); });

      expect(onClick).not.toHaveBeenCalled();
      expect(modal()).toBeInTheDocument();
    });
  });

  it('forwards remaining props through to the underlying Button', () => {
    renderWithProviders(
      <ProtectedButton buttonType="primary" disabled className="custom">Publish</ProtectedButton>,
      { preloadedState: { auth: { user: makeUser() } } },
    );

    const button = screen.getByRole('button', { name: 'Publish' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('custom');
  });
});
