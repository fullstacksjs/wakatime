import path from 'path';
import { fileURLToPath } from 'url';

// TODO: we don't need this toAbsolutePath does exactly this
export const getDirname = () => {
  const filename = fileURLToPath(import.meta.url);
  return path.dirname(filename);
};
