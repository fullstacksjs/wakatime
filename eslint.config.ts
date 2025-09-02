import type { Linter } from 'eslint';

import { defineConfig } from '@fullstacksjs/eslint-config';

const config: Linter.Config<Linter.RulesRecord>[] = defineConfig({
  node: true,
});

export default config;
