import {beforeEach, describe, expect, it, vi} from 'vitest';
import {teamLoader} from './TeamLoader.ts';
import {getSquad, getTeams} from '../../utils/api/http.ts';
import TeamsResponse, {TeamSummary} from '../../components/features/teams/models/TeamsResponse.ts';
import SquadPlayer from '../../components/features/players/models/SquadPlayer.ts';

vi.mock('../../utils/api/http.ts', () => ({ getTeams: vi.fn(), getSquad: vi.fn() }));

const mockedGetTeams = vi.mocked(getTeams);
const mockedGetSquad = vi.mocked(getSquad);

const city = (competition: string, position: number): TeamSummary =>
  ({ id: '80', name: 'Manchester City', crest: 'city.jpg', competition, position, points: 12 });

const arsenal: TeamSummary =
  { id: '141', name: 'Arsenal FC', crest: 'arsenal.jpg', competition: 'PREMIER_LEAGUE', position: 1, points: 12 };

const teams: TeamsResponse = {
  competitions: ['PREMIER_LEAGUE', 'CHAMPIONS_LEAGUE'],
  teams: [arsenal, city('PREMIER_LEAGUE', 2), city('CHAMPIONS_LEAGUE', 8)],
};

const squad: SquadPlayer[] = [
  { id: '1', name: 'Gianluigi Donnarumma', image: '', number: '1', position: 'Goalkeepers', injured: false, matchesPlayed: 9 },
];

const load = (id: string) =>
  teamLoader({ params: { id }, request: new Request(`http://localhost/teams/${id}`), context: {} });

describe('teamLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedGetTeams.mockResolvedValue({ data: teams, statusCode: 200 });
    mockedGetSquad.mockResolvedValue({ data: squad, statusCode: 200 });
  });

  it('picks the first row for the id and lists every competition it appears in', async () => {
    await expect(load('80')).resolves.toEqual({
      team: city('PREMIER_LEAGUE', 2),
      competitions: ['PREMIER_LEAGUE', 'CHAMPIONS_LEAGUE'],
      squad,
    });
    expect(mockedGetSquad).toHaveBeenCalledWith('80');
  });

  it('returns a single competition for a domestic-only club', async () => {
    const result = await load('141');

    expect(result.team).toEqual(arsenal);
    expect(result.competitions).toEqual(['PREMIER_LEAGUE']);
  });

  it('throws a 404 Response when no row matches the id', async () => {
    const thrown = await load('999').catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
    await expect((thrown as Response).text()).resolves.toBe('Team not found');
  });

  it('throws a Response carrying the backend message when the teams envelope is an error', async () => {
    mockedGetTeams.mockResolvedValue({
      data: teams,
      statusCode: 503,
      systemMessage: { messageText: 'Standings unavailable', isError: true },
    });

    const thrown = await load('80').catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(503);
    await expect((thrown as Response).text()).resolves.toBe('Standings unavailable');
  });

  it('throws a 500 Response when the squad request rejects', async () => {
    mockedGetSquad.mockRejectedValue(new Error('Network Error'));

    const thrown = await load('80').catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(500);
    await expect((thrown as Response).text()).resolves.toBe('Network Error');
  });
});
