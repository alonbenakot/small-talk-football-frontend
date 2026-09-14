import {describe, expect, it, vi} from 'vitest';
import {extractIdFromUrl, handleLoaderApiCall} from './api-utils.ts';
import {SmallTalkResponse} from '../../models/small-talk-response.ts';

type Payload = { name: string };
const fallback: Payload = { name: 'fallback' };

describe('handleLoaderApiCall', () => {
  it('passes data and statusCode through on success', async () => {
    const response: SmallTalkResponse<Payload> = { data: { name: 'real' }, statusCode: 200 };
    const result = await handleLoaderApiCall(() => Promise.resolve(response), 'failed', fallback);

    expect(result).toEqual({ data: { name: 'real' }, error: null, statusCode: 200 });
  });

  it('reports no error when systemMessage is present but not an error', async () => {
    const response: SmallTalkResponse<Payload> = {
      data: { name: 'real' },
      statusCode: 200,
      systemMessage: { messageText: 'Loaded 3 fixtures', isError: false },
    };
    const result = await handleLoaderApiCall(() => Promise.resolve(response), 'failed', fallback);

    expect(result.error).toBeNull();
  });

  // The backend signals failure in the body, not only via the HTTP status.
  it('surfaces systemMessage.messageText when isError is true', async () => {
    const response: SmallTalkResponse<Payload> = {
      data: { name: 'partial' },
      statusCode: 404,
      systemMessage: { messageText: 'Fixture not found', isError: true },
    };
    const result = await handleLoaderApiCall(() => Promise.resolve(response), 'failed', fallback);

    expect(result).toEqual({ data: { name: 'partial' }, error: 'Fixture not found', statusCode: 404 });
  });

  it('returns the fallback with status 500 when the call throws an Error', async () => {
    const result = await handleLoaderApiCall<Payload>(
      () => Promise.reject(new Error('Network Error')),
      'Failed to load',
      fallback,
    );

    expect(result).toEqual({ data: fallback, error: 'Network Error', statusCode: 500 });
  });

  it('uses the supplied errorMessage when the rejection is not an Error', async () => {
    const result = await handleLoaderApiCall<Payload>(
      () => Promise.reject('just a string'),
      'Failed to load matches',
      fallback,
    );

    expect(result).toEqual({ data: fallback, error: 'Failed to load matches', statusCode: 500 });
  });

  it('invokes the api call exactly once', async () => {
    const apiCall = vi.fn().mockResolvedValue({ data: fallback, statusCode: 200 });
    await handleLoaderApiCall(apiCall, 'failed', fallback);

    expect(apiCall).toHaveBeenCalledTimes(1);
  });
});

describe('extractIdFromUrl', () => {
  it('returns the last path segment', () => {
    expect(extractIdFromUrl(new Request('http://localhost/matches/42'))).toBe('42');
  });

  it('ignores the query string', () => {
    expect(extractIdFromUrl(new Request('http://localhost/articles/abc?lang=BRITISH'))).toBe('abc');
  });

  it('returns an empty string for a trailing slash', () => {
    expect(extractIdFromUrl(new Request('http://localhost/cheat-cards/'))).toBe('');
  });

  it('handles a deeply nested path', () => {
    expect(extractIdFromUrl(new Request('http://localhost/a/b/c/d'))).toBe('d');
  });
});
