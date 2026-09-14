import {beforeEach, describe, expect, it, vi} from 'vitest';
import {LoaderFunctionArgs} from 'react-router-dom';
import {articleLoader} from './ArticleLoader.ts';
import {getArticle} from '../../utils/api/http.ts';
import ArticleModel from '../../components/features/articles/models/ArticleModel.ts';

vi.mock('../../utils/api/http.ts', () => ({ getArticle: vi.fn() }));

const mockedGetArticle = vi.mocked(getArticle);

const article: ArticleModel = {
  id: 'abc',
  title: 'Why the offside rule exists',
  author: 'Yekutiel Cohen',
  text: 'Because football would be chaos without it.',
  published: true,
};

const args = (url: string) => ({ request: new Request(url) }) as LoaderFunctionArgs;

describe('articleLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns the article on success', async () => {
    mockedGetArticle.mockResolvedValue({ data: article, statusCode: 200 });

    await expect(articleLoader(args('http://localhost/articles/abc')))
      .resolves.toEqual({ data: article, error: null });
  });

  it('passes the id from the last path segment to the api', async () => {
    mockedGetArticle.mockResolvedValue({ data: article, statusCode: 200 });

    await articleLoader(args('http://localhost/articles/abc'));

    expect(mockedGetArticle).toHaveBeenCalledWith('abc');
  });

  it('throws a Response carrying the backend message', async () => {
    mockedGetArticle.mockResolvedValue({
      data: {} as ArticleModel,
      statusCode: 404,
      systemMessage: { messageText: 'Article not found', isError: true },
    });

    const thrown = await articleLoader(args('http://localhost/articles/missing')).catch((e) => e);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
    await expect((thrown as Response).text()).resolves.toBe('Article not found');
  });

  it('throws a 500 Response when the request rejects', async () => {
    mockedGetArticle.mockRejectedValue(new Error('Network Error'));

    const thrown = await articleLoader(args('http://localhost/articles/abc')).catch((e) => e);

    expect((thrown as Response).status).toBe(500);
    await expect((thrown as Response).text()).resolves.toBe('Network Error');
  });
});
