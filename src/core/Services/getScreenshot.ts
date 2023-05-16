import { joinPath } from '@fullstacksjs/toolbox';
import puppeteer from 'puppeteer';

import { container } from '../../config/container';

export async function getScreenshot(type: 'day' | 'week'): Promise<Buffer> {
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
  await page.goto(joinPath(config.webpageUrl, type));
  await page.waitForSelector('#social-media');
  await page.setViewport({ width: 1000, height: 1280, deviceScaleFactor: 2 });
  const screenshot = await page.screenshot({ fullPage: true, encoding: 'binary', type: 'png' });
  await browser.close();

  return screenshot;
}
