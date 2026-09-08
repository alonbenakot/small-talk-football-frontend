import {beforeEach, describe, expect, it, vi} from 'vitest';
import {getCheatCardCategories, getCheatCards} from '../../utils/api/http.ts';
import CheatCardModel from '../../components/features/cheat-cards/models/CheatCardModel.ts';

vi.mock('../../utils/api/http.ts', () => ({
  getCheatCards: vi.fn(),
  getCheatCardCategories: vi.fn(),
}));

const mockedCheatCards = vi.mocked(getCheatCards);
const mockedCategories = vi.mocked(getCheatCardCategories);

const cheatCards: CheatCardModel[] = [
  { id: 'c1', title: 'Offside', subtitle: 'The rule', infoTexts: [], infoCategory: 'RULES' },
];
const categories = ['RULES', 'TACTICS'];

/**
 * The loader memoises its result in a module-level `cache`, so each test needs a
 * fresh module instance to start from a clean slate.
 */
const freshLoader = async () => {
  vi.resetModules();
  return (await import('./CheatCardLoader.ts')).cheatCardsLoader;
};

describe('cheatCardsLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns both payloads on success', async () => {
    mockedCheatCards.mockResolvedValue({ data: cheatCards, statusCode: 200 });
    mockedCategories.mockResolvedValue({ data: categories, statusCode: 200 });
    const cheatCardsLoader = await freshLoader();

    await expect(cheatCardsLoader()).resolves.toEqual({
      cheatCards: { data: cheatCards, error: null, statusCode: 200 },
      categories: { data: categories, error: null, statusCode: 200 },
    });
  });

  it('serves the second call from cache without hitting the api again', async () => {
    mockedCheatCards.mockResolvedValue({ data: cheatCards, statusCode: 200 });
    mockedCategories.mockResolvedValue({ data: categories, statusCode: 200 });
    const cheatCardsLoader = await freshLoader();

    const first = await cheatCardsLoader();
    const second = await cheatCardsLoader();

    expect(second).toBe(first);
    expect(mockedCheatCards).toHaveBeenCalledTimes(1);
    expect(mockedCategories).toHaveBeenCalledTimes(1);
  });

  // Documents bugs.md #5: nothing ever clears `cache`, so
  // content updated on the backend is not picked up for the rest of the session.
  it('keeps serving stale data after the backend content changes', async () => {
    mockedCheatCards.mockResolvedValue({ data: cheatCards, statusCode: 200 });
    mockedCategories.mockResolvedValue({ data: categories, statusCode: 200 });
    const cheatCardsLoader = await freshLoader();
    await cheatCardsLoader();

    const updated: CheatCardModel[] = [
      { id: 'c2', title: 'Press', subtitle: 'New card', infoTexts: [], infoCategory: 'TACTICS' },
    ];
    mockedCheatCards.mockResolvedValue({ data: updated, statusCode: 200 });

    const result = await cheatCardsLoader();

    expect(result.cheatCards.data).toEqual(cheatCards);
    expect(result.cheatCards.data).not.toEqual(updated);
  });

  it('throws when the cheat cards request fails', async () => {
    mockedCheatCards.mockRejectedValue(new Error('Cheat cards down'));
    mockedCategories.mockResolvedValue({ data: categories, statusCode: 200 });
    const cheatCardsLoader = await freshLoader();

    const thrown = await cheatCardsLoader().catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(500);
    await expect((thrown as Response).text()).resolves.toBe('Cheat cards down');
  });

  it('throws when the categories request fails', async () => {
    mockedCheatCards.mockResolvedValue({ data: cheatCards, statusCode: 200 });
    mockedCategories.mockResolvedValue({
      data: [],
      statusCode: 503,
      systemMessage: { messageText: 'Categories unavailable', isError: true },
    });
    const cheatCardsLoader = await freshLoader();

    const thrown = await cheatCardsLoader().catch((e) => e);

    expect((thrown as Response).status).toBe(503);
    await expect((thrown as Response).text()).resolves.toBe('Categories unavailable');
  });

  // A failure must not poison the cache — the next visit should retry.
  it('retries after a failure rather than caching the error', async () => {
    mockedCheatCards.mockRejectedValueOnce(new Error('Cheat cards down'));
    mockedCategories.mockResolvedValue({ data: categories, statusCode: 200 });
    const cheatCardsLoader = await freshLoader();
    await cheatCardsLoader().catch(() => undefined);

    mockedCheatCards.mockResolvedValue({ data: cheatCards, statusCode: 200 });
    const result = await cheatCardsLoader();

    expect(result.cheatCards.data).toEqual(cheatCards);
    expect(mockedCheatCards).toHaveBeenCalledTimes(2);
  });
});
