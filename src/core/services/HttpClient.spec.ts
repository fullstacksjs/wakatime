import assert from 'node:assert/strict';
import test from 'node:test';

import { HttpClient, HttpError } from './HttpClient.ts';

async function withMockFetch(mock: typeof fetch, run: () => Promise<void>) {
  const originalFetch = globalThis.fetch;
  Reflect.set(globalThis, 'fetch', mock);

  try {
    await run();
  } finally {
    Reflect.set(globalThis, 'fetch', originalFetch);
  }
}

test('request rethrows HttpError without wrapping', async () => {
  await withMockFetch(
    (async () => new Response('gone', { status: 404, statusText: 'Not Found' })) as typeof fetch,
    async () => {
      const client = new HttpClient('https://example.test');
      await assert.rejects(
        () => client.get('/missing'),
        (error: unknown) => {
          assert.ok(error instanceof HttpError);
          assert.equal(error.statusCode, 404);
          assert.equal(error.statusMessage, 'Not Found');
          assert.equal(error.message, 'HTTP Error 404 for https://example.test/missing: Not Found');
          return true;
        },
      );
    },
  );
});

test('request maps network failures to HttpError 500', async () => {
  await withMockFetch(
    (async () => {
      throw new TypeError('fetch failed');
    }) as typeof fetch,
    async () => {
      const client = new HttpClient('https://example.test');
      await assert.rejects(
        () => client.get('/down'),
        (error: unknown) => {
          assert.ok(error instanceof HttpError);
          assert.equal(error.statusCode, 500);
          assert.equal(error.statusMessage, 'fetch failed');
          return true;
        },
      );
    },
  );
});
