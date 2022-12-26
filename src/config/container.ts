import { createContainer, InjectionMode } from 'awilix';

import type { Container } from './initContainer';

export const container = createContainer<Container>({
  injectionMode: InjectionMode.PROXY,
});
