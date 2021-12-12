import puppeteer from 'puppeteer';

export type Encoding = 'base64' | 'binary';
export type ImageType = 'jpeg' | 'png' | 'webp';
export type EncodingResult<T extends Encoding> = T extends 'base64' ? Buffer : string;

interface Options<T extends Encoding> {
  url: string;
  encoding?: T;
  type?: ImageType;
  width: number;
  height: number;
  deviceScaleFactor: number;
  timeout?: number;
}

export class PuppeteerService {
  async getScreenshot(opts: Options<'binary'>): Promise<Buffer>;
  async getScreenshot(opts: Options<'base64'>): Promise<string>;
  async getScreenshot<T extends Encoding = 'binary'>({
    url,
    width,
    height,
    deviceScaleFactor,
    type = 'png',
    encoding = 'binary' as T,
    timeout = 2000,
  }: Options<T>) {
    const browser = await puppeteer.launch({
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
    return screenshot;
  }
}
