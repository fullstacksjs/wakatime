import puppeteer from 'puppeteer';

import { container } from '../../config/container.js';

async function waitForAllImages() {
  const images = document.getElementsByTagName('img');
  console.log({ images });

  await Promise.all(
    Array.from(images, image => {
      console.log(image.complete);
      if (image.complete) return Promise.resolve(true);

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.log('TIMED OUT');
          resolve(true);
        }, 10000);
        image.addEventListener('load', () => {
          console.log('LOADED');
          clearTimeout(timeout);
          resolve(true);
        });
        image.addEventListener('error', () => {
          console.log('ERROR');
          clearTimeout(timeout);
          reject();
        });
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
  page.on('console', message =>
    console.log(`${message.type().substring(0, 3).toUpperCase()} ${message.text()}`),
  );
  await page.goto(config.webpageUrl, { waitUntil: 'networkidle0' });
  await page.evaluate(waitForAllImages);
  await page.setViewport({ width: 1000, height: 1280, deviceScaleFactor: 2 });
  const screenshot = await page.screenshot({ fullPage: true, encoding: 'binary', type: 'png' });
  await browser.close();

  return screenshot;
}
