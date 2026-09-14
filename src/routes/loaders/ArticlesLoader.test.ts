import {beforeEach, describe, expect, it, vi} from 'vitest';
import {LoaderFunctionArgs} from 'react-router-dom';
import {articlesLoader} from './ArticlesLoader.ts';
import {getPendingArticles, getPublishedArticles} from '../../utils/api/http';
import ArticleModel from '../../components/features/articles/models/ArticleModel.ts';

vi.mock('../../utils/api/http', () => ({
  getPendingArticles: vi.fn(),
  getPublishedArticles: vi.fn(),
}));

const mockedPending = vi.mocked(getPendingArticles);
const mockedPublished = vi.mocked(getPublishedArticles);

const articles: ArticleModel[] = [
  { id: '1', title: 'A', author: 'X', text: 'x', published: true },
];

const args = (url: string) => ({ request: new Request(url) }) as LoaderFunctionArgs;

describe('articlesLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads published articles by default', async () => {
    mockedPublished.mockResolvedValue({ data: articles, statusCode: 200 });

    await expect(articlesLoader(args('http://localhost/articles')))
      .resolves.toEqual({ data: articles, error: null });
    expect(mockedPublished).toHaveBeenCalled();
    expect(mockedPending).not.toHaveBeenCalled();
  });

  it('loads pending articles when ?filter=pending', async () => {
    mockedPending.mockResolvedValue({ data: articles, statusCode: 200 });

    await articlesLoader(args('http://localhost/articles?filter=pending'));

    expect(mockedPending).toHaveBeenCalled();
    expect(mockedPublished).not.toHaveBeenCalled();
  });

  it('treats an unrecognised filter as published', async () => {
    mockedPublished.mockResolvedValue({ data: articles, statusCode: 200 });

    await articlesLoader(args('http://localhost/articles?filter=nonsense'));

    expect(mockedPublished).toHaveBeenCalled();
    expect(mockedPending).not.toHaveBeenCalled();
  });

  it('throws a Response when the published request fails', async () => {
    mockedPublished.mockRejectedValue(new Error('Network Error'));

    const thrown = await articlesLoader(args('http://localhost/articles')).catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(500);
  });

  it('throws a Response carrying the backend message for the pending branch', async () => {
    mockedPending.mockResolvedValue({
      data: [],
      statusCode: 403,
      systemMessage: { messageText: 'Admins only', isError: true },
    });

    const thrown = await articlesLoader(args('http://localhost/articles?filter=pending')).catch((e) => e);

    expect((thrown as Response).status).toBe(403);
    await expect((thrown as Response).text()).resolves.toBe('Admins only');
  });
});
