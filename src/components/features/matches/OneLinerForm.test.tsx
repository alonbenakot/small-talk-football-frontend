import {describe, expect, it, vi} from 'vitest';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OneLinerForm, {NEUTRAL} from './OneLinerForm.tsx';
import MatchModel, {TeamType} from './models/MatchModel.ts';
import {renderWithProviders} from '../../../test/utils.tsx';

const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

const match = {
  id: '1',
  competition: 'PREMIER_LEAGUE',
  matchDateTime: new Date(2025, 2, 14, 18, 0),
  venue: 'Anfield',
  score: { winner: '', draw: '', home: 0, away: 0 },
  homeTeam: { id: 'h', name: 'Liverpool', coach: '', crest: 'liverpool.png' },
  awayTeam: { id: 'a', name: 'Arsenal', coach: '', crest: 'arsenal.png' },
  goals: [],
  durationInMinutes: 90,
  finished: false,
  oneLiners: [],
} as MatchModel;

const renderForm = (overrides: { isLoading?: boolean } = {}) => {
  const onSubmit = vi.fn();
  renderWithProviders(
    <OneLinerForm match={match} isLoading={overrides.isLoading ?? false} onSubmit={onSubmit} />,
  );
  return { onSubmit, user: userEvent.setup() };
};

const submitButton = () => screen.getByRole('button', { name: /Generate One-Liner/ });

describe('OneLinerForm', () => {
  it('offers both teams plus a neutral option', () => {
    renderForm();

    expect(screen.getByText('Liverpool')).toBeInTheDocument();
    expect(screen.getByText('Arsenal')).toBeInTheDocument();
    expect(screen.getByText('Keep it Neutral')).toBeInTheDocument();
  });

  it('defaults to the home team', async () => {
    const { onSubmit, user } = renderForm();

    await user.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ team: TeamType.HOME });
  });

  it('submits the away team when it is selected', async () => {
    const { onSubmit, user } = renderForm();

    await user.click(screen.getByText('Arsenal'));
    await user.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ team: TeamType.AWAY });
  });

  it('submits the neutral option when it is selected', async () => {
    const { onSubmit, user } = renderForm();

    await user.click(screen.getByText('Keep it Neutral'));
    await user.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ team: NEUTRAL });
  });

  it('reflects the current selection in the radio inputs', async () => {
    const { user } = renderForm();

    await user.click(screen.getByText('Arsenal'));

    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios.find((r) => r.value === TeamType.AWAY)!.checked).toBe(true);
    expect(radios.find((r) => r.value === TeamType.HOME)!.checked).toBe(false);
  });

  it('disables submission and shows progress while loading', () => {
    renderForm({ isLoading: true });

    const button = screen.getByRole('button', { name: /Generating/ });
    expect(button).toBeDisabled();
  });

  it('does not submit while loading', async () => {
    const { onSubmit, user } = renderForm({ isLoading: true });

    await user.click(screen.getByRole('button', { name: /Generating/ }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('navigates back without submitting when "Back to Matches" is used', async () => {
    navigate.mockClear();
    const { onSubmit, user } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Back to Matches' }));

    expect(navigate).toHaveBeenCalledWith(-1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
