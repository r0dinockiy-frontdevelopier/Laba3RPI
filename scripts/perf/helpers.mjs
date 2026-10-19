// Общие помощники для замеров в браузере (CDP + Microsoft Edge).
export { openBrowser, launchEdge, EDGE } from './browser.mjs';

export function collectConsole(page) {
  const messages = [];
  const errors = [];
  page.on('console', (msg) => {
    messages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  return {
    messages,
    errors,
    renderLines: () => messages.filter((m) => m.text.startsWith('Рендер карточки:')),
    reset() {
      messages.length = 0;
      errors.length = 0;
    },
  };
}

export async function paintMetrics(page) {
  return page.evaluate(() => {
    const paints = performance.getEntriesByType('paint');
    const nav = performance.getEntriesByType('navigation')[0];
    const fcp = paints.find((p) => p.name === 'first-contentful-paint');
    return {
      fcp: fcp ? Math.round(fcp.startTime) : null,
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      loadEvent: nav ? Math.round(nav.loadEventEnd) : null,
      jsTransferSize: nav ? nav.transferSize : null,
    };
  });
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Состояние страницы: адрес, объём текста в #root (детектор «белого экрана»). */
export async function snapshot(page) {
  return page.evaluate(() => {
    const root = document.getElementById('root');
    const text = (root?.innerText ?? '').replace(/\s+/g, ' ').trim();
    return {
      url: location.pathname,
      rootTextLength: text.length,
      firstText: text.slice(0, 80),
    };
  });
}
