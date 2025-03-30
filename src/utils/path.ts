import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const toAbsolutePath = (filename: string) =>
  join(dirname(fileURLToPath(import.meta.url)), '..', filename);
