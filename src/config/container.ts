import awilix from 'awilix';

export const container = awilix.createContainer<Container>({
  injectionMode: awilix.InjectionMode.PROXY,
});
