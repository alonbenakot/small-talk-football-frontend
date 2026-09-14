import {beforeEach, describe, expect, it, vi} from 'vitest';
import {teamsLoader} from './TeamsLoader.ts';
import {getTeams} from '../../utils/api/http.ts';
import TeamsResponse from '../../components/features/teams/models/TeamsResponse.ts';

vi.mock('../../utils/api/http.ts', () => ({ getTeams: vi.fn() }));

const mockedGetTeams = vi.mocked(getTeams);

const teams: TeamsResponse = {
  competitions: ['PREMIER_LEAGUE'],
  teams: [],
};

describe('teamsLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns the teams payload on success', async () => {
    mockedGetTeams.mockResolvedValue({ data: teams, statusCode: 200 });

    await expect(teamsLoader()).resolves.toEqual({ data: teams, error: null });
  });

  it('throws a Response carrying the backend message when systemMessage is an error', async () => {
    mockedGetTeams.mockResolvedValue({
      data: teams,
      statusCode: 503,
      systemMessage: { messageText: 'Standings unavailable', isError: true },
    });

    const thrown = await teamsLoader().catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(503);
    await expect((thrown as Response).text()).resolves.toBe('Standings unavailable');
  });

  it('throws a 500 Response when the request itself rejects', async () => {
    mockedGetTeams.mockRejectedValue(new Error('Network Error'));

    const thrown = await teamsLoader().catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(500);
    await expect((thrown as Response).text()).resolves.toBe('Network Error');
  });
});
