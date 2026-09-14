import {beforeEach, describe, expect, it, vi} from 'vitest';
import {teamLoader} from './TeamLoader.ts';
import {getSquad, getTeamFacts} from '../../utils/api/http.ts';
import {TeamFacts} from '../../components/features/teams/models/TeamOneLiner.ts';
import SquadPlayer from '../../components/features/players/models/SquadPlayer.ts';

vi.mock('../../utils/api/http.ts', () => ({ getTeamFacts: vi.fn(), getSquad: vi.fn() }));

const mockedGetTeamFacts = vi.mocked(getTeamFacts);
const mockedGetSquad = vi.mocked(getSquad);

const facts = { id: '80', name: 'Manchester City', crest: 'city.jpg', coach: 'Enzo Maresca' } as TeamFacts;

const squad: SquadPlayer[] = [
  { id: '1', name: 'Gianluigi Donnarumma', image: '', number: '1', position: 'Goalkeepers', injured: false, matchesPlayed: 9 },
];

const load = (id: string) =>
  teamLoader({ params: { id }, request: new Request(`http://localhost/teams/${id}`), context: {} });

describe('teamLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedGetTeamFacts.mockResolvedValue({ data: facts, statusCode: 200 });
    mockedGetSquad.mockResolvedValue({ data: squad, statusCode: 200 });
  });

  it('returns the team facts and squad for the id', async () => {
    await expect(load('80')).resolves.toEqual({ facts, squad });
    expect(mockedGetTeamFacts).toHaveBeenCalledWith('80');
    expect(mockedGetSquad).toHaveBeenCalledWith('80');
  });

  it('throws a Response carrying the backend message when the facts envelope is an error', async () => {
    mockedGetTeamFacts.mockResolvedValue({
      data: {} as TeamFacts,
      statusCode: 404,
      systemMessage: { messageText: 'No team was found for id: 80', isError: true },
    });

    const thrown = await load('80').catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
    await expect((thrown as Response).text()).resolves.toBe('No team was found for id: 80');
  });

  it('throws a 500 Response when the squad request rejects', async () => {
    mockedGetSquad.mockRejectedValue(new Error('Network Error'));

    const thrown = await load('80').catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(500);
    await expect((thrown as Response).text()).resolves.toBe('Network Error');
  });
});
