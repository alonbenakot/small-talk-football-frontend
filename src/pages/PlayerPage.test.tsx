import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlayerPage from './PlayerPage.tsx';
import {PlayerLoaderOutput} from '../routes/loaders/PlayerLoader.ts';
import SquadPlayer from '../components/features/players/models/SquadPlayer.ts';
import PlayerOneLiner, {PlayerFacts} from '../components/features/players/models/PlayerOneLiner.ts';
import {Lang} from '../components/features/language/Lang.ts';
import {getPlayerOneLiner} from '../utils/api/http.ts';
import {makeTestStore, renderWithProviders} from '../test/utils.tsx';

const loaderData = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useLoaderData: () => loaderData(),
  useNavigate: () => vi.fn(),
}));

vi.mock('../utils/api/http.ts', () => ({ getPlayerOneLiner: vi.fn() }));

const mockedGetPlayerOneLiner = vi.mocked(getPlayerOneLiner);

const haaland: SquadPlayer = {
  id: '659972248', name: 'Erling Haaland', image: '', number: '9', position: 'Forwards', injured: false, matchesPlayed: 10,
};

const facts: PlayerFacts = {
  id: '659972248', name: 'Erling Haaland', image: '', number: '9', position: 'Forwards', age: '26',
  captain: true, injured: false,
  team: { id: '80', name: 'Manchester City', crest: '', coach: 'Enzo Maresca' },
  competition: 'PREMIER_LEAGUE',
  season: {
    matchesPlayed: 10, goals: 8, assists: 0, shotsTotal: 33, keyPasses: 4, passes: 86, passesAccurate: 54,
    tackles: 1, interceptions: null, clearances: 3, duelsTotal: 29, duelsWon: 17, yellowCards: 0, redCards: 0,
    rating: '7.30', saves: null, insideBoxSaves: null, goalsConceded: 0,
  },
  leagueScorerRank: 2,
  squadContext: {
    leadingScorer: true, leadingContributor: true, everPresent: true, firstChoiceKeeper: false,
    appearanceShare: 1, squadSize: 24,
  },
  teamStanding: {
    competition: 'PREMIER_LEAGUE', position: 2, playedMatches: 4, points: 12,
    overall: { wins: 4, losses: 0, draws: 0 }, home: { wins: 2, losses: 0, draws: 0 }, away: { wins: 2, losses: 0, draws: 0 },
  },
  recentContributions: [
    { fixtureId: 'fx0', date: '2026-09-13T15:30:00Z', opponent: 'Manchester Utd', goals: 1, assists: 0 },
  ],
  nextFixture: { fixtureId: 'fx1', opponent: 'Sunderland', home: true, kickOff: '2026-09-20T13:00:00Z' },
};

const oneLiner = (overrides: Partial<PlayerFacts> = {}): PlayerOneLiner => ({
  oneLiner: { language: Lang.BRITISH, text: "Still City's main man up top", generatedAt: '2026-09-13T18:05:53Z' },
  facts: { ...facts, ...overrides },
});

const renderPage = (player: SquadPlayer = haaland) => {
  loaderData.mockReturnValue({ teamId: '80', player } as PlayerLoaderOutput);
  const store = makeTestStore({ lang: { lang: Lang.HEBREW } });
  return { ...renderWithProviders(<PlayerPage />, { store, route: `/teams/80/players/${player.id}` }), user: userEvent.setup() };
};

const generate = () => screen.getByRole('button', { name: /What do I say about him\?/ });

const waitForOneLiner = () => screen.findByText(/main man up top/);

describe('PlayerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetPlayerOneLiner.mockResolvedValue({ data: oneLiner(), statusCode: 200 });
  });

  it('shows the player header with number and position, and a form with no radios', async () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Erling Haaland' })).toBeInTheDocument();
    expect(screen.getByText('#9 · Forwards')).toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to squad' })).toBeInTheDocument();

    await waitForOneLiner();
    expect(generate()).toBeInTheDocument();
  });

  it('badges an injured player in the header', async () => {
    renderPage({ ...haaland, injured: true });

    expect(screen.getByText('Injured')).toBeInTheDocument();
    await waitForOneLiner();
  });

  it('requests the one-liner on arrival for the player in the selected language', async () => {
    renderPage();

    await waitForOneLiner();

    expect(mockedGetPlayerOneLiner).toHaveBeenCalledTimes(1);
    expect(mockedGetPlayerOneLiner).toHaveBeenCalledWith({ playerId: '659972248', lang: Lang.HEBREW });
  });

  it('requests again when the button is tapped', async () => {
    const { user } = renderPage();
    await waitForOneLiner();

    await user.click(generate());

    expect(mockedGetPlayerOneLiner).toHaveBeenCalledTimes(2);
  });

  it('shows the facts once the one-liner arrives', async () => {
    renderPage();

    expect(screen.queryByText(/Age:/)).not.toBeInTheDocument();

    await waitForOneLiner();

    expect(await screen.findByText('Age: 26')).toBeInTheDocument();
    expect(screen.getByText('Captain')).toBeInTheDocument();
    expect(screen.getByText('2nd in the scoring charts')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Manchester City/ })).toHaveAttribute('href', '/teams/80');
    expect(screen.getByText('2nd · 12 pts')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /1G vs Manchester Utd/ })).toHaveAttribute('href', '/matches/fx0');
    expect(screen.getByRole('link', { name: /vs Sunderland/ })).toHaveAttribute('href', '/matches/fx1');
  });

  it('skips null stats and hides the goalkeeper block for an outfield player', async () => {
    renderPage();

    await waitForOneLiner();

    expect(await screen.findByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.queryByText('Interceptions')).not.toBeInTheDocument();
    expect(screen.queryByText('Saves')).not.toBeInTheDocument();
    expect(screen.queryByText('Goals conceded')).not.toBeInTheDocument();
  });

  it('shows the goalkeeper block for a goalkeeper', async () => {
    mockedGetPlayerOneLiner.mockResolvedValue({
      data: oneLiner({
        position: 'Goalkeepers',
        season: { ...facts.season, saves: 21, insideBoxSaves: 9, goalsConceded: 3, rating: '' },
      }),
      statusCode: 200,
    });
    renderPage({ ...haaland, position: 'Goalkeepers' });

    await waitForOneLiner();

    expect(await screen.findByText('Saves')).toBeInTheDocument();
    expect(screen.getByText('Saves in the box')).toBeInTheDocument();
    expect(screen.getByText('Goals conceded')).toBeInTheDocument();
    expect(screen.queryByText('Rating')).not.toBeInTheDocument();
  });

  it('hides the club stub when the team is null', async () => {
    mockedGetPlayerOneLiner.mockResolvedValue({
      data: oneLiner({ team: null, competition: null, teamStanding: null }),
      statusCode: 200,
    });
    renderPage();

    await waitForOneLiner();

    expect(await screen.findByText('Goals')).toBeInTheDocument();
    expect(screen.queryByText('Manchester City')).not.toBeInTheDocument();
  });

  it('omits the badges, contributions and next fixture when there are none', async () => {
    mockedGetPlayerOneLiner.mockResolvedValue({
      data: oneLiner({ captain: false, leagueScorerRank: null, recentContributions: [], nextFixture: null }),
      statusCode: 200,
    });
    renderPage();

    await waitForOneLiner();

    expect(await screen.findByText('Goals')).toBeInTheDocument();
    expect(screen.queryByText('Captain')).not.toBeInTheDocument();
    expect(screen.queryByText(/scoring charts/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Recent goals and assists/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Next:/)).not.toBeInTheDocument();
  });

  it('does not badge a scorer ranked outside the top five', async () => {
    mockedGetPlayerOneLiner.mockResolvedValue({ data: oneLiner({ leagueScorerRank: 6 }), statusCode: 200 });
    renderPage();

    await waitForOneLiner();

    expect(await screen.findByText('Goals')).toBeInTheDocument();
    expect(screen.queryByText(/scoring charts/)).not.toBeInTheDocument();
  });
});
