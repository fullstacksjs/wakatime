import puppeteer from 'puppeteer-core';

export type Encoding = 'base64' | 'binary';
export type ImageType = 'jpeg' | 'png' | 'webp';

export const getScreenshot = async ({
  url,
  puppeteerExecutablePath,
  type,
  encoding,
}: {
  url: string;
  puppeteerExecutablePath: string;
  encoding: Encoding;
  type: ImageType;
}) => {
  const browser = await puppeteer.launch({
    executablePath: puppeteerExecutablePath,
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForTimeout(2000);
  await page.setViewport({ width: 815, height: 700, deviceScaleFactor: 2 });
  const screenshot = await page.screenshot({ fullPage: true, encoding, type });
  await browser.close();
  return screenshot as unknown as Promise<Buffer | string>;
};
