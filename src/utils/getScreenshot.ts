import puppeteer from 'puppeteer-core';

export type Encoding = 'base64' | 'binary';
export type ImageType = 'jpeg' | 'png' | 'webp';

export const getScreenshot = async ({
  url,
  puppeteerExecutablePath,
  type,
  encoding,
  width,
  height,
  deviceScaleFactor,
  timeout,
}: {
  url: string;
  puppeteerExecutablePath: string;
  encoding: Encoding;
  type: ImageType;
  width: number;
  height: number;
  deviceScaleFactor: number;
  timeout: number;
}) => {
  const browser = await puppeteer.launch({
    executablePath: puppeteerExecutablePath,
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForTimeout(timeout);
  await page.setViewport({ width, height, deviceScaleFactor });
  const screenshot = await page.screenshot({ fullPage: true, encoding, type });
  await browser.close();
  return screenshot as unknown as Promise<Buffer | string>;
};
