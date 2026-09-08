import {beforeEach, describe, expect, it, vi} from 'vitest';
import {homeLoader} from './HomeLoader.ts';
import {getCheatCards, getPublishedArticles} from '../../utils/api/http';
import ArticleModel from '../../components/features/articles/models/ArticleModel.ts';
import CheatCardModel from '../../components/features/cheat-cards/models/CheatCardModel.ts';

vi.mock('../../utils/api/http', () => ({
  getCheatCards: vi.fn(),
  getPublishedArticles: vi.fn(),
}));

const mockedCheatCards = vi.mocked(getCheatCards);
const mockedArticles = vi.mocked(getPublishedArticles);

const articles: ArticleModel[] = [
  { id: '1', title: 'A', author: 'X', text: 'x', published: true },
];
const cheatCards: CheatCardModel[] = [
  { id: 'c1', title: 'Offside', subtitle: 'The rule', infoTexts: [], infoCategory: 'RULES' },
];

describe('homeLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns both payloads on success', async () => {
    mockedArticles.mockResolvedValue({ data: articles, statusCode: 200 });
    mockedCheatCards.mockResolvedValue({ data: cheatCards, statusCode: 200 });

    await expect(homeLoader()).resolves.toEqual({
      articles: { data: articles, error: null, statusCode: 200 },
      cheatCards: { data: cheatCards, error: null, statusCode: 200 },
    });
  });

  it('requests both resources concurrently', async () => {
    mockedArticles.mockResolvedValue({ data: articles, statusCode: 200 });
    mockedCheatCards.mockResolvedValue({ data: cheatCards, statusCode: 200 });

    await homeLoader();

    expect(mockedArticles).toHaveBeenCalledTimes(1);
    expect(mockedCheatCards).toHaveBeenCalledTimes(1);
  });

  it('throws when the articles request fails', async () => {
    mockedArticles.mockRejectedValue(new Error('Articles down'));
    mockedCheatCards.mockResolvedValue({ data: cheatCards, statusCode: 200 });

    const thrown = await homeLoader().catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(500);
    await expect((thrown as Response).text()).resolves.toBe('Articles down');
  });

  it('throws when the cheat cards request fails', async () => {
    mockedArticles.mockResolvedValue({ data: articles, statusCode: 200 });
    mockedCheatCards.mockResolvedValue({
      data: [],
      statusCode: 503,
      systemMessage: { messageText: 'Cheat cards unavailable', isError: true },
    });

    const thrown = await homeLoader().catch((e) => e);

    await expect((thrown as Response).text()).resolves.toBe('Cheat cards unavailable');
    expect((thrown as Response).status).toBe(503);
  });

  // Articles are checked first, so its message is the one the user sees.
  it('reports the articles failure when both fail', async () => {
    mockedArticles.mockRejectedValue(new Error('Articles down'));
    mockedCheatCards.mockRejectedValue(new Error('Cheat cards down'));

    const thrown = await homeLoader().catch((e) => e);

    await expect((thrown as Response).text()).resolves.toBe('Articles down');
  });
});
