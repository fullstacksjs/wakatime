/**
 * Get a WakaTime OAuth access token with the read_private_leaderboards scope.
 *
 * Usage: pnpm run wakatime:token
 *
 * Values are read from .env (or the environment) when set, otherwise you are prompted:
 *   WAKATIME_CLIENT_ID, WAKATIME_CLIENT_SECRET
 * WAKATIME_REDIRECT_URI is optional and defaults to https://wakatime.com/oauth/test.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline';

const AUTHORIZE_URL = 'https://wakatime.com/oauth/authorize';
const TOKEN_URL = 'https://wakatime.com/oauth/token';
const SCOPE = 'read_private_leaderboards';
const DEFAULT_REDIRECT_URI = 'https://wakatime.com/oauth/test';
const ENV_FILE = '.env';
const ENV_KEY = 'WAKATIME_ACCESS_TOKEN';

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
  error_description?: string;
}

const rl = createInterface({ input, terminal: Boolean(input.isTTY) });
// Reading lines one by one keeps piped input working: rl.question() drops buffered lines.
const lines = rl[Symbol.asyncIterator]();

async function ask(question: string, fallback?: string): Promise<string> {
  const suffix = fallback ? ` [${fallback}]` : '';
  output.write(`${question}${suffix}: `);
  const next = await lines.next();
  if (next.done) throw new Error('Input closed before an answer was given.');
  const answer = next.value.trim();

  return answer || fallback || '';
}

function env(name: string): string | undefined {
  // eslint-disable-next-line n/no-process-env
  return process.env[name]?.trim() || undefined;
}

async function value(envName: string, question: string, fallback?: string): Promise<string> {
  const fromEnv = env(envName);
  if (fromEnv) return fromEnv;
  const answer = await ask(question, fallback);
  if (!answer) throw new Error(`${question} is required.`);
  return answer;
}

/** Accepts either the bare code or the full redirect URL that contains ?code=... */
function extractCode(raw: string): string {
  try {
    return new URL(raw).searchParams.get('code') ?? raw;
  } catch {
    return raw;
  }
}

function saveToEnv(token: string) {
  const line = `${ENV_KEY}=${token}`;
  const current = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8') : '';
  const pattern = new RegExp(`^${ENV_KEY}=.*$`, 'm');
  const next = pattern.test(current)
    ? current.replace(pattern, line)
    : `${current}${current && !current.endsWith('\n') ? '\n' : ''}${line}\n`;
  writeFileSync(ENV_FILE, next);
}

async function main() {
  const redirectUri = env('WAKATIME_REDIRECT_URI') ?? DEFAULT_REDIRECT_URI;

  console.log('Create an app at https://wakatime.com/apps first.');
  console.log(`Its authorized redirect URLs must include ${redirectUri}\n`);

  const clientId = await value('WAKATIME_CLIENT_ID', 'Client ID');
  const clientSecret = await value('WAKATIME_CLIENT_SECRET', 'Client secret');

  const authorizeUrl = new URL(AUTHORIZE_URL);
  authorizeUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SCOPE,
  }).toString();

  console.log(`\nOpen this URL in your browser and approve access:\n\n  ${authorizeUrl}\n`);
  const code = extractCode(await ask('Paste the code (or the full redirect URL)'));
  if (!code) throw new Error('Code is required.');

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as TokenResponse;

  if (!response.ok || !data.access_token) {
    const reason = data.error_description ?? data.error ?? response.statusText;
    throw new Error(`Token request failed (${response.status}): ${reason}`);
  }

  const days = data.expires_in ? Math.round(data.expires_in / 86400) : undefined;
  console.log(`\nAccess token: ${data.access_token}`);
  console.log(`Scope: ${data.scope ?? 'unknown'}`);
  if (days !== undefined)
    console.log(`Expires in: ${days} days (~${Math.round(days / 365)} years)`);

  if (!data.scope?.includes(SCOPE)) {
    console.warn(`\nWarning: the token is missing the ${SCOPE} scope.`);
  }

  const save = await ask(`\nWrite ${ENV_KEY} to ${ENV_FILE}? (y/N)`, 'n');

  if (save.toLowerCase().startsWith('y')) {
    saveToEnv(data.access_token);
    console.log(`Saved ${ENV_KEY} to ${ENV_FILE}.`);
  }
}

try {
  await main();
} catch (error) {
  console.error(`\nError: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
