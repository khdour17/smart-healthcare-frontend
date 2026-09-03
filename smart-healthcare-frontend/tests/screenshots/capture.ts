import type { Page } from '@playwright/test';

const FOLDER = 'screenshots';
const MOBILE_VIEWPORT = { width: 414, height: 896 };
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const TALLEST_SCREEN = 2400;
const SETTLE_MILLISECONDS = 200;

async function settle(page: Page): Promise<void> {
  await page.mouse.move(0, 0);
  await page.waitForTimeout(SETTLE_MILLISECONDS);
}

async function scrollHeight(page: Page): Promise<number> {
  return page.evaluate(() => {
    const main = document.querySelector('main');
    if (main === null) return document.body.scrollHeight;

    return main.scrollHeight + (window.innerHeight - main.clientHeight);
  });
}

export async function captureScreen(page: Page, name: string): Promise<void> {
  const viewport = page.viewportSize() ?? DESKTOP_VIEWPORT;
  const height = Math.min(Math.max(await scrollHeight(page), viewport.height), TALLEST_SCREEN);

  await page.setViewportSize({ width: viewport.width, height });
  await settle(page);
  await page.screenshot({ path: `${FOLDER}/${name}.png` });
  await page.setViewportSize(viewport);
}

export async function captureOverlay(page: Page, name: string): Promise<void> {
  await settle(page);
  await page.screenshot({ path: `${FOLDER}/${name}.png` });
}

export async function useMobileScreen(page: Page): Promise<void> {
  await page.setViewportSize(MOBILE_VIEWPORT);
}

export async function useDesktopScreen(page: Page): Promise<void> {
  await page.setViewportSize(DESKTOP_VIEWPORT);
}
