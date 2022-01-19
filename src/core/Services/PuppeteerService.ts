import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

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
  config: Config;
  constructor(opts: Container) {
    this.config = opts.config;
    if (!this.config.isProd && this.config.puppeteerExecPath == null)
      throw Error('you need to specify PUPPETEER_EXECUTABLE_PATH env variable in development');
  }

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
    const puppeteerArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu',
    ];
    const browser = this.config.isProd
      ? await puppeteer.launch({ args: puppeteerArgs })
      : await puppeteerCore.launch({
          args: puppeteerArgs,
          executablePath: this.config.puppeteerExecPath as string,
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
