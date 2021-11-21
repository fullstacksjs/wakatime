import { Container } from 'typescript-ioc';
import { App } from './App.js';
import { container } from './config/IocConfig.js';

Container.configure(...container);

new App().start();
