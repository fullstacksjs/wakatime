import { createContainer, InjectionMode } from 'awilix';

import type { Container } from './initContainer.js';

export const container = createContainer<Container>({
  injectionMode: InjectionMode.PROXY,
});
