import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ApiError } from '@estimator/shared';

const configMock = vi.hoisted(() => ({
  apiUrl: 'http://localhost:3001',
  apiAuthToken: undefined as string | undefined,
}));

vi.mock('./config.js', () => ({
  loadWebApiConfig: () => configMock,
}));

import { request, ApiRequestError } from './api.js';

const mockError: ApiError = {
  error: { code: 'VALIDATION_ERROR', message: 'Validation failed' },
};

describe('API client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('request sends GET and returns parsed data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { id: '1' } }), { status: 200 }),
    );
    const result = await request<{ id: string }>('/test');
    expect(result).toEqual({ id: '1' });
  });

  it('includes Authorization header when apiAuthToken is configured', async () => {
    configMock.apiAuthToken = 'test-token';
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: {} }), { status: 200 }),
    );
    await request('/test');
    const fetchSpy = vi.mocked(globalThis.fetch);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const requestHeaders = new Headers(options.headers);
    expect(requestHeaders.get('Authorization')).toBe('Bearer test-token');
    configMock.apiAuthToken = undefined;
  });

  it('throws ApiRequestError on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockError), { status: 400 }),
    );
    await expect(request('/test')).rejects.toThrow(ApiRequestError);
  });

  it('ApiRequestError contains status and code', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockError), { status: 400 }),
    );
    try {
      await request('/test');
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiRequestError);
      const apiError = error as ApiRequestError;
      expect(apiError.status).toBe(400);
      expect(apiError.code).toBe('VALIDATION_ERROR');
    }
  });
});
