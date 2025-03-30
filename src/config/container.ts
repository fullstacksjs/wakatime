import { createContainer, InjectionMode } from 'awilix';

import type { Container } from './initContainer.ts';

export const container = createContainer<Container>({
  injectionMode: InjectionMode.PROXY,
});
