import {beforeEach, describe, expect, it, vi} from 'vitest';
import axios from 'axios';
import jwtAxios from './jwtAxios.ts';
import {Lang} from '../../components/features/language/Lang.ts';
import {TeamType} from '../../components/features/matches/models/MatchModel.ts';
import {Perspective} from '../../components/features/teams/models/Perspective.ts';

vi.mock('axios', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));
vi.mock('./jwtAxios.ts', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

const BASE = 'http://api.test/';

// http.ts reads import.meta.env at module load, so the value must be stubbed
// before the module is first evaluated.
vi.stubEnv('VITE_API_BASE_URL', BASE);
const http = await import('./http.ts');

const publicClient = vi.mocked(axios);
const authedClient = vi.mocked(jwtAxios);

const envelope = { data: { data: 'payload', statusCode: 200 } };

describe('http', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    publicClient.get.mockResolvedValue(envelope);
    publicClient.post.mockResolvedValue(envelope);
    authedClient.post.mockResolvedValue(envelope);
    authedClient.patch.mockResolvedValue(envelope);
    authedClient.delete.mockResolvedValue(envelope);
  });

  it('unwraps response.data rather than returning the axios response', async () => {
    await expect(http.getCheatCards()).resolves.toEqual(envelope.data);
  });

  describe('public endpoints use the unauthenticated client', () => {
    it.each([
      ['login', () => http.login({ email: 'a@b.com', password: 'x' }), 'post', `${BASE}users/login`],
      ['signUp', () => http.signUp({} as never), 'post', `${BASE}users/signup`],
      ['getCheatCards', () => http.getCheatCards(), 'get', `${BASE}small-infos`],
      ['getCheatCardCategories', () => http.getCheatCardCategories(), 'get', `${BASE}small-infos/categories`],
      ['getPublishedArticles', () => http.getPublishedArticles(), 'get', `${BASE}articles/published`],
      ['getPendingArticles', () => http.getPendingArticles(), 'get', `${BASE}articles/pending`],
      ['getFixtures', () => http.getFixtures(), 'get', `${BASE}fixtures`],
      ['getTeams', () => http.getTeams(), 'get', `${BASE}teams`],
    ])('%s', async (_name, call, method, url) => {
      await call();

      const client = publicClient[method as 'get' | 'post'];
      expect(client).toHaveBeenCalled();
      expect(client.mock.calls[0][0]).toBe(url);
      expect(authedClient[method as 'get' | 'post']).not.toHaveBeenCalled();
    });
  });

  describe('authenticated endpoints use jwtAxios', () => {
    it.each([
      ['publishArticle', () => http.publishArticle('a1'), 'patch', `${BASE}articles/publish/a1`],
      ['removeArticle', () => http.removeArticle('a1'), 'patch', `${BASE}articles/remove/a1`],
      ['deleteArticle', () => http.deleteArticle('a1'), 'delete', `${BASE}articles/a1`],
      ['initArticles', () => http.initArticles(), 'post', `${BASE}articles/init`],
      ['initCheatCards', () => http.initCheatCards(), 'post', `${BASE}small-infos/init`],
      ['initTeams', () => http.initTeams(), 'post', `${BASE}teams`],
      ['deleteTeams', () => http.deleteTeams(), 'delete', `${BASE}teams`],
      ['refreshStandings', () => http.refreshStandings(), 'patch', `${BASE}teams/standings`],
      ['deleteFixtures', () => http.deleteFixtures(), 'delete', `${BASE}fixtures`],
    ])('%s', async (_name, call, method, url) => {
      await call();

      const client = authedClient[method as 'post' | 'patch' | 'delete'];
      expect(client).toHaveBeenCalled();
      expect(client.mock.calls[0][0]).toBe(url);
    });
  });

  describe('parameterised endpoints', () => {
    it('getArticle targets the article by id', async () => {
      await http.getArticle('abc');

      expect(publicClient.get).toHaveBeenCalledWith(`${BASE}articles/abc`);
    });

    it('getFixture targets the fixture by id', async () => {
      await http.getFixture('42');

      expect(publicClient.get).toHaveBeenCalledWith(`${BASE}fixtures/42`);
    });

    it('getOneLiner puts the match in the path and the rest in query params', async () => {
      await http.getOneLiner({ matchId: '42', lang: Lang.BRITISH, teamType: TeamType.HOME });

      expect(publicClient.get).toHaveBeenCalledWith(`${BASE}one-liners/42`, {
        params: { lang: Lang.BRITISH, teamType: TeamType.HOME },
      });
    });

    it('getOneLiner omits teamType for a neutral request', async () => {
      await http.getOneLiner({ matchId: '42', lang: Lang.HEBREW });

      expect(publicClient.get).toHaveBeenCalledWith(`${BASE}one-liners/42`, {
        params: { lang: Lang.HEBREW, teamType: undefined },
      });
    });

    it('getTeamFacts targets the team by id', async () => {
      await http.getTeamFacts('80');

      expect(publicClient.get).toHaveBeenCalledWith(`${BASE}teams/80`);
    });

    it('getSquad targets the team by id', async () => {
      await http.getSquad('80');

      expect(publicClient.get).toHaveBeenCalledWith(`${BASE}players/teams/80`);
    });

    it('getTeamOneLiner puts the team in the path and the rest in query params', async () => {
      await http.getTeamOneLiner({
        teamId: '80', lang: Lang.BRITISH, perspective: Perspective.FAN, competition: 'CHAMPIONS_LEAGUE',
      });

      expect(publicClient.get).toHaveBeenCalledWith(`${BASE}one-liners/teams/80`, {
        params: { lang: Lang.BRITISH, perspective: Perspective.FAN, competition: 'CHAMPIONS_LEAGUE' },
      });
    });

    it('getTeamOneLiner omits perspective and competition when not given', async () => {
      await http.getTeamOneLiner({ teamId: '80', lang: Lang.HEBREW });

      expect(publicClient.get).toHaveBeenCalledWith(`${BASE}one-liners/teams/80`, {
        params: { lang: Lang.HEBREW, perspective: undefined, competition: undefined },
      });
    });

    it('getPlayerOneLiner puts the player in the path and lang in query params', async () => {
      await http.getPlayerOneLiner({ playerId: '659972248', lang: Lang.AMERICAN });

      expect(publicClient.get).toHaveBeenCalledWith(`${BASE}one-liners/players/659972248`, {
        params: { lang: Lang.AMERICAN },
      });
    });

    it('addArticle posts the payload with credentials', async () => {
      const article = { title: 'T', author: 'A', text: 'x' };

      await http.addArticle(article);

      expect(authedClient.post).toHaveBeenCalledWith(`${BASE}articles`, article);
    });

    it('fetchFixtures requests the configured match-day window', async () => {
      await http.fetchFixtures();

      expect(authedClient.post).toHaveBeenCalledWith(`${BASE}fixtures`, null, {
        params: { matchDays: 25, matchDaysIntoFuture: 15 },
      });
    });
  });

  it('exposes the shared unauthorized message', () => {
    expect(http.UNAUTHORIZED_MSG).toContain('unauthorized');
  });
});
