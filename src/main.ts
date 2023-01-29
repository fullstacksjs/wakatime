import 'dotenv/config';

import { App } from './App.js';
import { initContainer } from './config/initContainer.js';

const container = await initContainer();
new App(container).start();
