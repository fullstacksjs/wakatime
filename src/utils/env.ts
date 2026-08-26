/* eslint-disable n/no-process-env */

export function optionalEnv(key: string): string | undefined;
export function optionalEnv(key: string, defaultValue: string): string;

export function optionalEnv(key: string, defaultValue?: string): string | undefined {
  const value = process.env[key];

  return value === '' || value === undefined ? defaultValue : value;
}

export function requiredEnv(key: string): string {
  const value = optionalEnv(key);

  if (value === undefined) throw new Error(`Missing required env: ${key}`);

  return value;
}
