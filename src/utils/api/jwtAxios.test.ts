import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {AxiosRequestConfig} from 'axios';
import jwtAxios from './jwtAxios.ts';
import {makeUser} from '../../test/utils.tsx';

const originalAdapter = jwtAxios.defaults.adapter;

/**
 * Drives the request through the real interceptor chain and captures the final
 * config, rather than reaching into axios internals.
 */
const captureRequestConfig = async (): Promise<AxiosRequestConfig> => {
  let captured: AxiosRequestConfig | undefined;
  jwtAxios.defaults.adapter = async (config) => {
    captured = config;
    return { data: null, status: 200, statusText: 'OK', headers: {}, config };
  };
  await jwtAxios.get('/anything');
  return captured!;
};

describe('jwtAxios request interceptor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jwtAxios.defaults.adapter = originalAdapter;
  });

  it('attaches the bearer token from the persisted user', async () => {
    localStorage.setItem('user', JSON.stringify(makeUser({ jwt: 'abc.def.ghi' })));

    const config = await captureRequestConfig();

    expect(config.headers!.Authorization).toBe('Bearer abc.def.ghi');
  });

  it('sends no Authorization header when nobody is logged in', async () => {
    const config = await captureRequestConfig();

    expect(config.headers!.Authorization).toBeUndefined();
  });

  it('sends no Authorization header when the stored user has no jwt', async () => {
    const user = makeUser();
    delete user.jwt;
    localStorage.setItem('user', JSON.stringify(user));

    const config = await captureRequestConfig();

    expect(config.headers!.Authorization).toBeUndefined();
  });

  it('sends no Authorization header when the stored value is the literal "null"', async () => {
    localStorage.setItem('user', 'null');

    const config = await captureRequestConfig();

    expect(config.headers!.Authorization).toBeUndefined();
  });

  // The key is written by user-slice; the two must agree or every admin call 401s.
  it('reads the same localStorage key that user-slice writes', async () => {
    localStorage.setItem('user', JSON.stringify(makeUser({ jwt: 'from-login' })));

    const config = await captureRequestConfig();

    expect(config.headers!.Authorization).toBe('Bearer from-login');
  });
});
