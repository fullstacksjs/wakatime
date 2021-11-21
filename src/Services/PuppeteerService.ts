import puppeteer from 'puppeteer-core';

export type Encoding = 'base64' | 'binary';
export type ImageType = 'jpeg' | 'png' | 'webp';
interface Options {
  url: string;
  puppeteerExecutablePath: string;
  encoding: Encoding;
  type: ImageType;
  width: number;
  height: number;
  deviceScaleFactor: number;
  timeout: number;
}

export class PuppeteerService {
  async getScreenshot({
    url,
    puppeteerExecutablePath,
    type,
    encoding,
    width,
    height,
    deviceScaleFactor,
    timeout,
  }: Options) {
    const browser = await puppeteer.launch({
      executablePath: puppeteerExecutablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- this one doesn't works in Windows
        '--disable-gpu',
      ],
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(timeout);
    await page.setViewport({ width, height, deviceScaleFactor });
    const screenshot = await page.screenshot({ fullPage: true, encoding, type });
    await browser.close();
    return screenshot as unknown as Promise<Buffer | string>;
  }
}
