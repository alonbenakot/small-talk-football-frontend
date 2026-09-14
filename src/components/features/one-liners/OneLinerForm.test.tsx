import {describe, expect, it, vi} from 'vitest';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OneLinerForm from './OneLinerForm.tsx';
import {OneLinerOption} from './models/OneLinerOption.ts';
import {renderWithProviders} from '../../../test/utils.tsx';

const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

type Side = 'HOME' | 'AWAY' | 'NEUTRAL';

const options: OneLinerOption<Side>[] = [
  { value: 'HOME', label: 'Liverpool', icon: <span/> },
  { value: 'AWAY', label: 'Arsenal', icon: <span/> },
  { value: 'NEUTRAL', label: 'Keep it Neutral', icon: <span/> },
];

const renderForm = (overrides: {
  isLoading?: boolean; options?: OneLinerOption<Side>[]; submitLabel?: string; backTo?: string | number;
} = {}) => {
  const onSubmit = vi.fn();
  renderWithProviders(
    <OneLinerForm
      title="Choose your team!"
      options={overrides.options ?? options}
      defaultValue={overrides.options ? undefined : 'HOME'}
      submitLabel={overrides.submitLabel}
      backLabel="Back to Matches"
      backTo={overrides.backTo ?? -1}
      isLoading={overrides.isLoading ?? false}
      onSubmit={onSubmit}
    />,
  );
  return { onSubmit, user: userEvent.setup() };
};

const submitButton = () => screen.getByRole('button', { name: /Generate One-Liner/ });

describe('OneLinerForm', () => {
  it('renders the title and every option', () => {
    renderForm();

    expect(screen.getByText('Choose your team!')).toBeInTheDocument();
    expect(screen.getByText('Liverpool')).toBeInTheDocument();
    expect(screen.getByText('Arsenal')).toBeInTheDocument();
    expect(screen.getByText('Keep it Neutral')).toBeInTheDocument();
  });

  it('submits the default value', async () => {
    const { onSubmit, user } = renderForm();

    await user.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('HOME'));
  });

  it('submits the selected option', async () => {
    const { onSubmit, user } = renderForm();

    await user.click(screen.getByText('Arsenal'));
    await user.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('AWAY'));
  });

  it('reflects the current selection in the radio inputs', async () => {
    const { user } = renderForm();

    await user.click(screen.getByText('Arsenal'));

    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios.find((r) => r.value === 'AWAY')!.checked).toBe(true);
    expect(radios.find((r) => r.value === 'HOME')!.checked).toBe(false);
  });

  it('renders only title and buttons when there are no options', async () => {
    const { onSubmit, user } = renderForm({ options: [], submitLabel: 'What do I say about him?' });

    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /What do I say about him/ }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(undefined));
  });

  it('disables submission and shows progress while loading', () => {
    renderForm({ isLoading: true });

    expect(screen.getByRole('button', { name: /Generating/ })).toBeDisabled();
  });

  it('does not submit while loading', async () => {
    const { onSubmit, user } = renderForm({ isLoading: true });

    await user.click(screen.getByRole('button', { name: /Generating/ }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('navigates back by delta without submitting', async () => {
    navigate.mockClear();
    const { onSubmit, user } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Back to Matches' }));

    expect(navigate).toHaveBeenCalledWith(-1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('navigates back to a route when one is given', async () => {
    navigate.mockClear();
    const { user } = renderForm({ backTo: '/teams' });

    await user.click(screen.getByRole('button', { name: 'Back to Matches' }));

    expect(navigate).toHaveBeenCalledWith('/teams');
  });
});
