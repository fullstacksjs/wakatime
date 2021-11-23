import { App } from './App.js';
import { container } from './config/container.js';
import { initContainer } from './config/initContainer.js';

initContainer(container);

const app = new App();
await app.initiate();
app.start();
