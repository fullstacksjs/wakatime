import type { Browser, Page } from 'puppeteer';

import puppeteer from 'puppeteer';

import { container } from '../../config/container.js';

async function waitForAllImages() {
  const images = document.getElementsByTagName('img');

  await Promise.all(
    Array.from(images, image => {
      if (image.complete) return Promise.resolve(true);

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.log('TIMED OUT');
          resolve(true);
        }, 20000);
        image.addEventListener('load', () => {
          console.log('LOADED');
          clearTimeout(timeout);
          resolve(true);
        });
        image.addEventListener('error', () => {
          console.log('ERROR');
          clearTimeout(timeout);
          reject(Error('Cannot load image'));
        });
      });
    }),
  );
}

export async function createBrowser() {
  const config = container.cradle.config;

  return puppeteer.launch({
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--deterministic-fetch',
      '--disable-features=IsolateOrigins',
      '--disable-site-isolation-trials',
    ],
    executablePath: config.puppeteerExecPath,
    headless: 'new',
  });
}

export async function openPage(browser: Browser, url: string) {
  const page = await browser.newPage();
  page.on('console', message =>
    console.log(`Puppeteer ${message.type().substring(0, 3)}: ${message.text()}`),
  );
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: 1000, height: 1280, deviceScaleFactor: 2 });
  await page.evaluate(waitForAllImages);

  return page;
}

export function getScreenshot(page: Page) {
  return page.screenshot({ fullPage: true, encoding: 'binary', type: 'png' });
}
