import { beforeEach, describe, expect, it, vi } from 'vitest';

const loggerMocks = vi.hoisted(() => ({
  error: vi.fn(),
  info: vi.fn(),
}));

vi.mock('./logger.js', () => ({
  createLogger: () => loggerMocks,
  logger: loggerMocks,
}));

import { createApp, healthResponseSchema } from './app.js';
import type { ApiConfig } from './config.js';

const testConfig: ApiConfig = {
  allowedOrigins: ['http://localhost:3000'],
  authToken: 'test-token',
  logLevel: 'silent',
  nodeEnv: 'test',
  port: 3001,
  rateLimitMaxRequests: 10,
  rateLimitWindowMs: 60_000,
};

describe('API app', () => {
  beforeEach(() => {
    loggerMocks.error.mockReset();
    loggerMocks.info.mockReset();
  });

  const app = createApp({ config: testConfig });

  it('creates app with default config from environment', async () => {
    const defaultApp = createApp();
    const res = await defaultApp.request('/health');
    expect(res.status).toBe(200);
  });

  it('GET /health returns a valid health response', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const body: unknown = await res.json();
    const parsed = healthResponseSchema.parse(body);
    expect(parsed.status).toBe('ok');
    expect(parsed.timestamp).toBeTruthy();
  });

  it('healthResponseSchema rejects invalid payloads', () => {
    expect(() => healthResponseSchema.parse({ status: 123 })).toThrow();
  });

  it('GET / returns running message wrapped in data envelope', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { data: { message: string } };
    expect(body.data.message).toBe('API is running');
  });

  it('returns 404 with error envelope for unknown routes', async () => {
    const res = await app.request('/unknown-route');
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: { code: string; message: string } };
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('adds request ID and security headers', async () => {
    const res = await app.request('/health', {
      headers: { 'X-Request-Id': 'custom-request-id' },
    });

    expect(res.headers.get('x-request-id')).toBe('custom-request-id');
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('x-frame-options')).toBe('DENY');
    expect(res.headers.get('referrer-policy')).toBe('no-referrer');
  });

  it('returns first allowed origin when request has no Origin header', async () => {
    const res = await app.request('/health');
    const corsOrigin = res.headers.get('access-control-allow-origin');
    expect(corsOrigin).toBe('http://localhost:3000');
  });

  it('handles requests when allowedOrigins is empty', async () => {
    const emptyOriginsConfig: ApiConfig = { ...testConfig, allowedOrigins: [] };
    const emptyApp = createApp({ config: emptyOriginsConfig });
    const res = await emptyApp.request('/health');
    expect(res.status).toBe(200);
  });

  it('rejects requests from disallowed origins', async () => {
    const res = await app.request('/health', {
      headers: { Origin: 'https://evil.com' },
    });
    const corsOrigin = res.headers.get('access-control-allow-origin');
    expect(corsOrigin).toBeNull();
  });
});
