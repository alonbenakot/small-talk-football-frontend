import {beforeEach, describe, expect, it, vi} from 'vitest';
import {LoaderFunctionArgs} from 'react-router-dom';
import {matchLoader} from './MatchLoader.ts';
import {getFixture} from '../../utils/api/http.ts';
import MatchModel from '../../components/features/matches/models/MatchModel.ts';

vi.mock('../../utils/api/http.ts', () => ({ getFixture: vi.fn() }));

const mockedGetFixture = vi.mocked(getFixture);
const match = { id: '42' } as MatchModel;

const args = (url: string) => ({ request: new Request(url) }) as LoaderFunctionArgs;

describe('matchLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns the match on success', async () => {
    mockedGetFixture.mockResolvedValue({ data: match, statusCode: 200 });

    await expect(matchLoader(args('http://localhost/matches/42')))
      .resolves.toEqual({ data: match, error: null });
  });

  it('passes the id from the url to the api', async () => {
    mockedGetFixture.mockResolvedValue({ data: match, statusCode: 200 });

    await matchLoader(args('http://localhost/matches/42'));

    expect(mockedGetFixture).toHaveBeenCalledWith('42');
  });

  it('throws a Response carrying the backend message', async () => {
    mockedGetFixture.mockResolvedValue({
      data: {} as MatchModel,
      statusCode: 404,
      systemMessage: { messageText: 'Fixture not found', isError: true },
    });

    const thrown = await matchLoader(args('http://localhost/matches/999')).catch((e) => e);

    expect((thrown as Response).status).toBe(404);
    await expect((thrown as Response).text()).resolves.toBe('Fixture not found');
  });

  it('throws a 500 Response when the request rejects', async () => {
    mockedGetFixture.mockRejectedValue(new Error('Network Error'));

    const thrown = await matchLoader(args('http://localhost/matches/42')).catch((e) => e);

    expect((thrown as Response).status).toBe(500);
  });
});
