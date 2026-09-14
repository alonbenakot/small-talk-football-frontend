import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamsPage from './TeamsPage.tsx';
import TeamsResponse, {TeamSummary} from '../components/features/teams/models/TeamsResponse.ts';
import {TeamsLoaderOutput} from '../routes/loaders/TeamsLoader.ts';
import {renderWithProviders} from '../test/utils.tsx';

const loaderData = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useLoaderData: () => loaderData(),
}));

const makeTeam = (id: string, name: string, competition: string, position = 1): TeamSummary =>
  ({ id, name, competition, position, points: 12, crest: '' });

const renderPage = (data: Partial<TeamsResponse>) => {
  loaderData.mockReturnValue({
    data: { competitions: [], teams: [], ...data },
  } as TeamsLoaderOutput);
  return { ...renderWithProviders(<TeamsPage />), user: userEvent.setup() };
};

describe('TeamsPage', () => {
  beforeEach(() => loaderData.mockReset());

  it('shows only the first competition by default', () => {
    renderPage({
      competitions: ['PREMIER_LEAGUE', 'LA_LIGA'],
      teams: [makeTeam('141', 'Arsenal FC', 'PREMIER_LEAGUE'), makeTeam('97', 'Real Madrid', 'LA_LIGA')],
    });

    expect(screen.getByText('Arsenal FC')).toBeInTheDocument();
    expect(screen.queryByText('Real Madrid')).not.toBeInTheDocument();
  });

  it('switches teams when another competition is picked', async () => {
    const { user } = renderPage({
      competitions: ['PREMIER_LEAGUE', 'LA_LIGA'],
      teams: [makeTeam('141', 'Arsenal FC', 'PREMIER_LEAGUE'), makeTeam('97', 'Real Madrid', 'LA_LIGA')],
    });

    await user.click(screen.getByRole('button', { name: 'La Liga' }));

    expect(screen.getByText('Real Madrid')).toBeInTheDocument();
    expect(screen.queryByText('Arsenal FC')).not.toBeInTheDocument();
  });

  it('shows position and points for each row', () => {
    renderPage({
      competitions: ['PREMIER_LEAGUE'],
      teams: [makeTeam('141', 'Arsenal FC', 'PREMIER_LEAGUE', 3)],
    });

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('12 pts')).toBeInTheDocument();
  });

  it('links domestic rows to the team page without a competition query', () => {
    renderPage({
      competitions: ['PREMIER_LEAGUE'],
      teams: [makeTeam('141', 'Arsenal FC', 'PREMIER_LEAGUE')],
    });

    expect(screen.getByRole('link', { name: /Arsenal FC/ })).toHaveAttribute('href', '/teams/141');
  });

  it('links Champions League rows with ?competition=CHAMPIONS_LEAGUE', async () => {
    const { user } = renderPage({
      competitions: ['PREMIER_LEAGUE', 'CHAMPIONS_LEAGUE'],
      teams: [makeTeam('80', 'Manchester City', 'PREMIER_LEAGUE'), makeTeam('80', 'Manchester City', 'CHAMPIONS_LEAGUE', 8)],
    });

    await user.click(screen.getByRole('button', { name: 'Champions League' }));

    expect(screen.getByRole('link', { name: /Manchester City/ }))
      .toHaveAttribute('href', '/teams/80?competition=CHAMPIONS_LEAGUE');
  });

  it('shows an empty state when no competitions are loaded', () => {
    renderPage({});

    expect(screen.getByText('No teams yet')).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
