import {describe, expect, it, vi} from 'vitest';
import {act, renderHook, waitFor} from '@testing-library/react';
import {AxiosError, AxiosHeaders} from 'axios';
import useApi from './use-api.ts';
import {SmallTalkResponse} from '../../models/small-talk-response.ts';

const ok = (data: string): SmallTalkResponse<string> => ({ data, statusCode: 200 });

/** Builds an error axios.isAxiosError() recognises, carrying a backend systemMessage. */
const axiosErrorWithMessage = (messageText: string) => {
  const error = new AxiosError('Request failed with status code 400');
  error.response = {
    data: { systemMessage: { messageText, isError: true } },
    status: 400,
    statusText: 'Bad Request',
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  };
  return error;
};

describe('useApi', () => {
  it('starts idle', () => {
    const { result } = renderHook(() => useApi(vi.fn()));
    expect(result.current.fetchedData).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });

  it('seeds fetchedData from the initial value when given one', () => {
    const { result } = renderHook(() => useApi(vi.fn(), ok('seed')));
    expect(result.current.fetchedData).toEqual(ok('seed'));
  });

  it('stores the response and reports success', async () => {
    const fetchMethod = vi.fn().mockResolvedValue(ok('payload'));
    const { result } = renderHook(() => useApi(fetchMethod));

    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current.invokeApi();
    });

    expect(returned).toBe(true);
    expect(result.current.fetchedData).toEqual(ok('payload'));
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('passes its argument through to the fetch method', async () => {
    const fetchMethod = vi.fn().mockResolvedValue(ok('payload'));
    const { result } = renderHook(() => useApi<string, { id: number }>(fetchMethod));

    await act(async () => {
      await result.current.invokeApi({ id: 7 });
    });

    expect(fetchMethod).toHaveBeenCalledWith({ id: 7 });
  });

  it('is loading while the request is in flight', async () => {
    let resolve!: (value: SmallTalkResponse<string>) => void;
    const fetchMethod = vi.fn(() => new Promise<SmallTalkResponse<string>>((r) => { resolve = r; }));
    const { result } = renderHook(() => useApi(fetchMethod));

    act(() => { void result.current.invokeApi(); });
    await waitFor(() => expect(result.current.isLoading).toBe(true));

    await act(async () => { resolve(ok('done')); });
    expect(result.current.isLoading).toBe(false);
  });

  it('surfaces the backend systemMessage from an axios error', async () => {
    const fetchMethod = vi.fn().mockRejectedValue(axiosErrorWithMessage('Email already registered'));
    const { result } = renderHook(() => useApi(fetchMethod));

    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current.invokeApi();
    });

    expect(returned).toBe(false);
    expect(result.current.error).toBe('Email already registered');
    expect(result.current.success).toBe(false);
  });

  it('falls back to the axios message when there is no systemMessage', async () => {
    const error = new AxiosError('Network Error');
    const fetchMethod = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useApi(fetchMethod));

    await act(async () => { await result.current.invokeApi(); });

    expect(result.current.error).toBe('Network Error');
  });

  it('falls back to a generic message for a non-axios throw', async () => {
    const fetchMethod = vi.fn().mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useApi(fetchMethod));

    await act(async () => { await result.current.invokeApi(); });

    expect(result.current.error).toBe('Failed to fetch data.');
  });

  it('clears a previous error when a later call succeeds', async () => {
    const fetchMethod = vi.fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(ok('recovered'));
    const { result } = renderHook(() => useApi(fetchMethod));

    await act(async () => { await result.current.invokeApi(); });
    expect(result.current.error).toBe('Failed to fetch data.');

    await act(async () => { await result.current.invokeApi(); });
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(true);
  });

  it('keeps the last successful data when a later call fails', async () => {
    const fetchMethod = vi.fn()
      .mockResolvedValueOnce(ok('first'))
      .mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useApi(fetchMethod));

    await act(async () => { await result.current.invokeApi(); });
    await act(async () => { await result.current.invokeApi(); });

    expect(result.current.fetchedData).toEqual(ok('first'));
    expect(result.current.success).toBe(false);
  });

  it('lets callers overwrite the data directly via setFetchedData', async () => {
    const { result } = renderHook(() => useApi(vi.fn(), ok('seed')));

    act(() => { result.current.setFetchedData(ok('replaced')); });

    expect(result.current.fetchedData).toEqual(ok('replaced'));
  });
});
