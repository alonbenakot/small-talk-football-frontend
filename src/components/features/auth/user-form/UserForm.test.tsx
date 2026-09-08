import {describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm, {FormProps} from './UserForm.tsx';
import {renderWithProviders} from '../../../../test/utils.tsx';

// The real forms pull in the network layer; the switch/close wiring is what
// UserForm actually owns, so stub the children down to that contract. The
// factories are inlined because vi.mock is hoisted above any local helper.
vi.mock('../login-form/LoginForm.tsx', () => ({
  default: ({ closeForm, handleSwitchForm }: FormProps) => (
    <div data-testid="login-form">
      <button onClick={handleSwitchForm}>switch</button>
      <button onClick={closeForm}>close</button>
    </div>
  ),
}));

vi.mock('../signup-form/SignUpForm.tsx', () => ({
  default: ({ closeForm, handleSwitchForm }: FormProps) => (
    <div data-testid="signup-form">
      <button onClick={handleSwitchForm}>switch</button>
      <button onClick={closeForm}>close</button>
    </div>
  ),
}));

describe('UserForm', () => {
  it('shows the login form by default', () => {
    renderWithProviders(<UserForm isOpenModal setIsOpenModal={vi.fn()} />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
  });

  it('honours an explicit initialFormType of signup', () => {
    renderWithProviders(
      <UserForm initialFormType="signup" isOpenModal setIsOpenModal={vi.fn()} />,
    );

    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('switches from login to signup', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserForm isOpenModal setIsOpenModal={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'switch' }));

    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('switches from signup back to login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserForm initialFormType="signup" isOpenModal setIsOpenModal={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'switch' }));

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
  });

  it('returns to the login form after switching twice', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserForm isOpenModal setIsOpenModal={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'switch' }));
    await user.click(screen.getByRole('button', { name: 'switch' }));

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('closes the modal through setIsOpenModal', async () => {
    const setIsOpenModal = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<UserForm isOpenModal setIsOpenModal={setIsOpenModal} />);

    await user.click(screen.getByRole('button', { name: 'close' }));

    expect(setIsOpenModal).toHaveBeenCalledWith(false);
  });

  it('keeps the close handler wired after switching forms', async () => {
    const setIsOpenModal = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<UserForm isOpenModal setIsOpenModal={setIsOpenModal} />);

    await user.click(screen.getByRole('button', { name: 'switch' }));
    await user.click(screen.getByRole('button', { name: 'close' }));

    expect(setIsOpenModal).toHaveBeenCalledWith(false);
  });
});
