import puppeteer from 'puppeteer';

import { container } from '../../config/container';

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
  });
  const page = await browser.newPage();
  await page.goto(config.webpageUrl);
  await page.waitForTimeout(2000);
  await page.setViewport({ width: 815, height: 700, deviceScaleFactor: 2 });
  const screenshot = await page.screenshot({ fullPage: true, encoding: 'binary', type: 'png' });
  await browser.close();

  return screenshot as Buffer;
}
