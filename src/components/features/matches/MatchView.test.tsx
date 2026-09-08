import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatchView from './MatchView.tsx';
import MatchModel, {TeamType} from './models/MatchModel.ts';
import {getOneLiner} from '../../../utils/api/http.ts';
import {Lang} from '../language/Lang.ts';
import {makeTestStore, renderWithProviders} from '../../../test/utils.tsx';

const loaderData = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useLoaderData: () => loaderData(),
  useNavigate: () => vi.fn(),
}));

vi.mock('../../../utils/api/http.ts', () => ({ getOneLiner: vi.fn() }));

const mockedGetOneLiner = vi.mocked(getOneLiner);

const match = {
  id: '42',
  competition: 'PREMIER_LEAGUE',
  matchDateTime: new Date(2025, 2, 14, 18),
  venue: 'Anfield',
  score: { winner: '', draw: '', home: 1, away: 1 },
  homeTeam: { id: 'h', name: 'Liverpool', coach: '', crest: '' },
  awayTeam: { id: 'a', name: 'Arsenal', coach: '', crest: '' },
  goals: [],
  durationInMinutes: 90,
  finished: true,
  oneLiners: [],
} as MatchModel;

const renderView = (lang: Lang = Lang.BRITISH) => {
  loaderData.mockReturnValue({ data: match });
  const store = makeTestStore({ lang: { lang } });
  const view = renderWithProviders(<MatchView />, { store, route: '/matches/42' });
  return { ...view, user: userEvent.setup() };
};

const generate = () => screen.getByRole('button', { name: /Generate One-Liner/ });

describe('MatchView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('shows the match and the one-liner form', () => {
    renderView();

    // Team names appear twice: on the match card and as form options.
    expect(screen.getAllByText('Liverpool').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Arsenal').length).toBeGreaterThan(0);
    expect(generate()).toBeInTheDocument();
  });

  it('requests a one-liner for the home team in the selected language', async () => {
    mockedGetOneLiner.mockResolvedValue({
      data: { text: 'What a game', language: Lang.BRITISH, teamType: TeamType.HOME },
      statusCode: 200,
    });
    const { user } = renderView(Lang.BRITISH);

    await user.click(generate());

    expect(mockedGetOneLiner).toHaveBeenCalledWith({
      matchId: '42',
      lang: Lang.BRITISH,
      teamType: TeamType.HOME,
    });
  });

  it('sends the away team when it is chosen', async () => {
    mockedGetOneLiner.mockResolvedValue({
      data: { text: 'x', language: Lang.BRITISH, teamType: TeamType.AWAY },
      statusCode: 200,
    });
    const { user } = renderView();

    // 'Arsenal' also appears on the match card, so target the radio itself.
    await user.click(screen.getByRole('radio', { name: /Arsenal/ }));
    await user.click(generate());

    expect(mockedGetOneLiner.mock.calls[0][0].teamType).toBe(TeamType.AWAY);
  });

  // NEUTRAL is not a TeamType — the component spreads it away rather than sending it.
  it('omits teamType entirely for a neutral request', async () => {
    mockedGetOneLiner.mockResolvedValue({
      data: { text: 'x', language: Lang.BRITISH, teamType: TeamType.HOME },
      statusCode: 200,
    });
    const { user } = renderView();

    await user.click(screen.getByRole('radio', { name: /Keep it Neutral/ }));
    await user.click(generate());

    expect(mockedGetOneLiner.mock.calls[0][0]).not.toHaveProperty('teamType');
    expect(mockedGetOneLiner.mock.calls[0][0]).toMatchObject({ matchId: '42', lang: Lang.BRITISH });
  });

  it('uses the currently selected language', async () => {
    mockedGetOneLiner.mockResolvedValue({
      data: { text: 'x', language: Lang.HEBREW, teamType: TeamType.HOME },
      statusCode: 200,
    });
    const { user } = renderView(Lang.HEBREW);

    await user.click(generate());

    expect(mockedGetOneLiner.mock.calls[0][0].lang).toBe(Lang.HEBREW);
  });

  it('swaps the form for the result once one arrives', async () => {
    mockedGetOneLiner.mockResolvedValue({
      data: { text: 'Liverpool bossed the midfield', language: Lang.BRITISH, teamType: TeamType.HOME },
      statusCode: 200,
    });
    const { user } = renderView();

    await user.click(generate());

    // OneLinerResult wraps the text in quote marks via formatQuote.
    expect(await screen.findByText(/Liverpool bossed the midfield/)).toBeInTheDocument();
  });

  it('returns to a blank form on "start over"', async () => {
    mockedGetOneLiner.mockResolvedValue({
      data: { text: 'Liverpool bossed the midfield', language: Lang.BRITISH, teamType: TeamType.HOME },
      statusCode: 200,
    });
    const { user } = renderView();
    await user.click(generate());
    await screen.findByText(/Liverpool bossed the midfield/);

    await user.click(screen.getByRole('button', { name: /Start Over|Another/i }));

    expect(await screen.findByRole('button', { name: /Generate One-Liner/ })).toBeInTheDocument();
    expect(screen.queryByText(/Liverpool bossed the midfield/)).not.toBeInTheDocument();
  });

  it('keeps the form visible when the request fails', async () => {
    mockedGetOneLiner.mockRejectedValue(new Error('AI unavailable'));
    const { user } = renderView();

    await user.click(generate());

    expect(await screen.findByRole('button', { name: /Generate One-Liner/ })).toBeInTheDocument();
  });
});
