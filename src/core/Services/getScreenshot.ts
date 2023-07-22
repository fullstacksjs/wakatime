import puppeteer from 'puppeteer';

import { container } from '../../config/container.js';
import { Env } from '@fullstacksjs/toolbox';

async function waitForAllImages() {
  document.body.scrollIntoView(false);
  const images = document.getElementsByTagName('img');

  await Promise.all(
    Array.from(images, image => {
      if (image.complete) return Promise.resolve(true);

      return new Promise((resolve, reject) => {
        if (Env.isDev)
          setTimeout(() => {
            resolve(true);
          }, 5000);
        image.addEventListener('load', resolve);
        image.addEventListener('error', reject);
      });
    }),
  );
}

export async function getScreenshot(): Promise<Buffer> {
  const config = container.cradle.config;

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- This one doesn't works in Windows
      '--disable-gpu',
    ],
    executablePath: config.puppeteerExecPath,
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.goto(config.webpageUrl, { waitUntil: 'networkidle2' });
  await page.evaluate(waitForAllImages);
  await page.setViewport({ width: 1000, height: 1280, deviceScaleFactor: 2 });
  const screenshot = await page.screenshot({ fullPage: true, encoding: 'binary', type: 'png' });
  await browser.close();

  return screenshot;
}
