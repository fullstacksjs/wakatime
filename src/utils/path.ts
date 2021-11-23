import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const toAbsolutePath = (filename: string) =>
  join(dirname(fileURLToPath(import.meta.url)), '..', filename);
