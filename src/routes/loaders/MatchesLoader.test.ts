import {beforeEach, describe, expect, it, vi} from 'vitest';
import {matchesLoader} from './MatchesLoader.ts';
import {getFixtures} from '../../utils/api/http.ts';
import FixturesResponse from '../../components/features/matches/models/FixturesResponse.ts';

// http.ts reads import.meta.env at module load, so this file also proves the
// runner resolves Vite env vars — it could not run under the old ts-jest setup.
vi.mock('../../utils/api/http.ts', () => ({ getFixtures: vi.fn() }));

const mockedGetFixtures = vi.mocked(getFixtures);

const fixtures: FixturesResponse = {
  competitions: ['PREMIER_LEAGUE'],
  fixtures: [],
};

describe('matchesLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns the fixtures payload on success', async () => {
    mockedGetFixtures.mockResolvedValue({ data: fixtures, statusCode: 200 });

    await expect(matchesLoader()).resolves.toEqual({ data: fixtures, error: null });
  });

  // Throwing a Response is what makes the route's errorElement (<ErrorPage/>) render.
  it('throws a Response carrying the backend message when systemMessage is an error', async () => {
    mockedGetFixtures.mockResolvedValue({
      data: fixtures,
      statusCode: 503,
      systemMessage: { messageText: 'Fixtures provider unavailable', isError: true },
    });

    const thrown = await matchesLoader().catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(503);
    await expect((thrown as Response).text()).resolves.toBe('Fixtures provider unavailable');
  });

  it('throws a 500 Response when the request itself rejects', async () => {
    mockedGetFixtures.mockRejectedValue(new Error('Network Error'));

    const thrown = await matchesLoader().catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(500);
    await expect((thrown as Response).text()).resolves.toBe('Network Error');
  });

  it('does not throw when systemMessage is present but not an error', async () => {
    mockedGetFixtures.mockResolvedValue({
      data: fixtures,
      statusCode: 200,
      systemMessage: { messageText: 'Cached result', isError: false },
    });

    await expect(matchesLoader()).resolves.toEqual({ data: fixtures, error: null });
  });
});
