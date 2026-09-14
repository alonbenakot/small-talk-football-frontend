import {beforeEach, describe, expect, it, vi} from 'vitest';
import {playerLoader} from './PlayerLoader.ts';
import {getSquad} from '../../utils/api/http.ts';
import SquadPlayer from '../../components/features/players/models/SquadPlayer.ts';

vi.mock('../../utils/api/http.ts', () => ({ getSquad: vi.fn() }));

const mockedGetSquad = vi.mocked(getSquad);

const haaland: SquadPlayer =
  { id: '659972248', name: 'Erling Haaland', image: 'haaland.jpg', number: '9', position: 'Forwards', injured: false, matchesPlayed: 10 };

const squad: SquadPlayer[] = [
  { id: '1', name: 'Gianluigi Donnarumma', image: '', number: '1', position: 'Goalkeepers', injured: false, matchesPlayed: 9 },
  haaland,
];

const load = (teamId: string, playerId: string) =>
  playerLoader({
    params: { teamId, playerId },
    request: new Request(`http://localhost/teams/${teamId}/players/${playerId}`),
    context: {},
  });

describe('playerLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedGetSquad.mockResolvedValue({ data: squad, statusCode: 200 });
  });

  it('finds the player in the squad and returns it with the team id', async () => {
    await expect(load('80', '659972248')).resolves.toEqual({ teamId: '80', player: haaland });
    expect(mockedGetSquad).toHaveBeenCalledWith('80');
  });

  it('throws a 404 Response when the player is not in the squad', async () => {
    const thrown = await load('80', '999').catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
    await expect((thrown as Response).text()).resolves.toBe('Player not found');
  });

  it('throws a Response carrying the backend message when the envelope is an error', async () => {
    mockedGetSquad.mockResolvedValue({
      data: [],
      statusCode: 404,
      systemMessage: { messageText: 'No team was found for id: 80', isError: true },
    });

    const thrown = await load('80', '659972248').catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
    await expect((thrown as Response).text()).resolves.toBe('No team was found for id: 80');
  });

  it('throws a 500 Response when the request rejects', async () => {
    mockedGetSquad.mockRejectedValue(new Error('Network Error'));

    const thrown = await load('80', '659972248').catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(500);
    await expect((thrown as Response).text()).resolves.toBe('Network Error');
  });
});
