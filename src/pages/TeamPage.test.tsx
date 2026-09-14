import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamPage from './TeamPage.tsx';
import {TeamLoaderOutput} from '../routes/loaders/TeamLoader.ts';
import SquadPlayer from '../components/features/players/models/SquadPlayer.ts';
import TeamOneLiner, {TeamFacts} from '../components/features/teams/models/TeamOneLiner.ts';
import {Perspective} from '../components/features/teams/models/Perspective.ts';
import PlayerRecord from '../components/features/players/models/PlayerRecord.ts';
import {Lang} from '../components/features/language/Lang.ts';
import {getTeamOneLiner} from '../utils/api/http.ts';
import {makeTestStore, renderWithProviders} from '../test/utils.tsx';

const loaderData = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useLoaderData: () => loaderData(),
  useNavigate: () => vi.fn(),
}));

vi.mock('../utils/api/http.ts', () => ({ getTeamOneLiner: vi.fn() }));

const mockedGetTeamOneLiner = vi.mocked(getTeamOneLiner);

const makePlayer = (overrides: Partial<SquadPlayer>): SquadPlayer => ({
  id: 'p', name: 'Player', image: '', number: '1', position: 'Goalkeepers', injured: false, matchesPlayed: 5,
  ...overrides,
});

const squad: SquadPlayer[] = [
  makePlayer({ id: '1', name: 'Gianluigi Donnarumma', position: 'Goalkeepers' }),
  makePlayer({ id: '2', name: 'Marcus Bettinelli', position: 'Goalkeepers', matchesPlayed: null }),
  makePlayer({ id: '3', name: 'Ruben Dias', position: 'Defenders', number: '3' }),
  makePlayer({ id: '4', name: 'Jeremy Doku', position: 'Forwards', number: '11', injured: true }),
];

const facts: TeamFacts = {
  id: '80', name: 'Manchester City', crest: '', coach: 'Enzo Maresca', founded: '1880',
  venue: { name: 'Etihad', address: '', city: 'Manchester', capacity: '55097', surface: 'grass' },
  primaryCompetition: 'PREMIER_LEAGUE',
  standings: {
    PREMIER_LEAGUE: {
      competition: 'PREMIER_LEAGUE', position: 2, playedMatches: 4, points: 12,
      overall: { wins: 4, losses: 0, draws: 0 }, home: { wins: 2, losses: 0, draws: 0 }, away: { wins: 2, losses: 0, draws: 0 },
    },
    CHAMPIONS_LEAGUE: {
      competition: 'CHAMPIONS_LEAGUE', position: 8, playedMatches: 1, points: 3,
      overall: { wins: 1, losses: 0, draws: 0 }, home: { wins: 0, losses: 0, draws: 0 }, away: { wins: 1, losses: 0, draws: 0 },
    },
  },
  recentForm: [
    { competition: 'PREMIER_LEAGUE', date: '2026-09-13T15:30:00Z', opponent: 'Manchester Utd', home: false, score: '0-1', result: 'WIN' },
    { competition: 'PREMIER_LEAGUE', date: '2026-09-06T15:30:00Z', opponent: 'Chelsea', home: true, score: '1-1', result: 'DRAW' },
  ],
  nextFixture: { fixtureId: 'fx1', opponent: 'Sunderland', home: true, kickOff: '2026-09-20T13:00:00Z' },
  notablePlayers: [{ id: '4', name: 'Jeremy Doku' } as PlayerRecord],
};

const oneLiner: TeamOneLiner = {
  oneLiner: {
    language: Lang.BRITISH, competition: 'PREMIER_LEAGUE', perspective: Perspective.FAN,
    text: 'Four wins from four', generatedAt: '2026-09-13T19:12:56Z',
  },
  facts,
};

const renderPage = ({ route = '/teams/80', squadRows = squad, teamFacts = facts }: {
  route?: string; squadRows?: SquadPlayer[]; teamFacts?: TeamFacts;
} = {}) => {
  loaderData.mockReturnValue({ facts: teamFacts, squad: squadRows } as TeamLoaderOutput);
  const store = makeTestStore({ lang: { lang: Lang.BRITISH } });
  return { ...renderWithProviders(<TeamPage />, { store, route }), user: userEvent.setup() };
};

const generate = () => screen.getByRole('button', { name: /Generate One-Liner/ });

describe('TeamPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetTeamOneLiner.mockResolvedValue({ data: oneLiner, statusCode: 200 });
  });

  it('shows the team header and the three perspectives with the fan selected', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Manchester City' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Manchester City fan/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /Rival fan/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Keep it Neutral/ })).toBeInTheDocument();
  });

  it('requests the fan one-liner in the selected language without a competition', async () => {
    const { user } = renderPage();

    await user.click(generate());

    expect(mockedGetTeamOneLiner).toHaveBeenCalledWith({
      teamId: '80',
      lang: Lang.BRITISH,
      perspective: Perspective.FAN,
    });
  });

  it('sends the chosen perspective', async () => {
    const { user } = renderPage();

    await user.click(screen.getByRole('radio', { name: /Rival fan/ }));
    await user.click(generate());

    expect(mockedGetTeamOneLiner.mock.calls[0][0].perspective).toBe(Perspective.RIVAL_FAN);
  });

  it('passes ?competition= through to the request and shows it in the header', async () => {
    const { user } = renderPage({ route: '/teams/80?competition=CHAMPIONS_LEAGUE' });

    expect(screen.getByText('Champions League')).toBeInTheDocument();

    await user.click(generate());

    expect(mockedGetTeamOneLiner.mock.calls[0][0].competition).toBe('CHAMPIONS_LEAGUE');
  });

  it('groups the squad by position and links rows to the player route', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Goalkeepers' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Defenders' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Forwards' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ruben Dias/ })).toHaveAttribute('href', '/teams/80/players/3');
  });

  it('lists players who have not featured in a rest-of-squad group at the end and badges injured ones', () => {
    renderPage();

    const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(headings.slice(-4)).toEqual(['Goalkeepers', 'Defenders', 'Forwards', 'Rest of the squad']);
    const bench = screen.getByRole('heading', { name: 'Rest of the squad' }).nextElementSibling!;
    expect(within(bench as HTMLElement).getByRole('link', { name: /Marcus Bettinelli/ })).toBeInTheDocument();
    expect(within(bench as HTMLElement).queryByRole('link', { name: /Gianluigi Donnarumma/ })).not.toBeInTheDocument();
    expect(within(screen.getByRole('link', { name: /Jeremy Doku/ })).getByText('Injured')).toBeInTheDocument();
  });

  it('omits the rest-of-squad group when every player has featured', () => {
    renderPage({ squadRows: squad.filter((p) => p.matchesPlayed !== null) });

    expect(screen.queryByText('Rest of the squad')).not.toBeInTheDocument();
  });

  it('shows an empty state when the squad is empty', () => {
    renderPage({ squadRows: [] });

    expect(screen.getByText('No squad yet')).toBeInTheDocument();
  });

  it('shows the facts and notable-player dot from the loader before generating', () => {
    renderPage();

    expect(mockedGetTeamOneLiner).not.toHaveBeenCalled();
    expect(screen.getByText('Coach: Enzo Maresca')).toBeInTheDocument();
    expect(screen.getByText('Premier League')).toBeInTheDocument();
    expect(screen.getByText('2nd')).toBeInTheDocument();
    expect(screen.getByText('4-0-0')).toBeInTheDocument();
    expect(screen.getByText(/8th · 3 pts · 1 played · 1W-0D-0L/)).toBeInTheDocument();
    expect(screen.getByText('at Manchester Utd')).toBeInTheDocument();
    expect(screen.getByText('vs Chelsea')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /vs Sunderland/ })).toHaveAttribute('href', '/matches/fx1');
    expect(within(screen.getByRole('link', { name: /Jeremy Doku/ })).getByTestId('notable-dot')).toBeInTheDocument();
    expect(screen.getAllByTestId('notable-dot')).toHaveLength(1);
  });

  it('shows the one-liner beneath the form after generating', async () => {
    const { user } = renderPage();

    await user.click(generate());

    expect(await screen.findByText(/Four wins from four/)).toBeInTheDocument();
  });

  it('omits the next fixture when there is none', () => {
    renderPage({ teamFacts: { ...facts, nextFixture: null } });

    expect(screen.queryByText(/Next:/)).not.toBeInTheDocument();
  });

  it('falls back to the only standing when primaryCompetition is null (national side)', () => {
    renderPage({
      teamFacts: {
        ...facts,
        primaryCompetition: null,
        standings: {
          WORLD_CUP: {
            competition: 'WORLD_CUP', position: 3, playedMatches: 2, points: 4,
            overall: { wins: 1, losses: 0, draws: 1 }, home: { wins: 0, losses: 0, draws: 0 }, away: { wins: 0, losses: 0, draws: 0 },
          },
        },
      },
    });

    expect(screen.getByText('World Cup')).toBeInTheDocument();
    expect(screen.getByText('3rd')).toBeInTheDocument();
    expect(screen.getByText('1-1-0')).toBeInTheDocument();
  });
});
