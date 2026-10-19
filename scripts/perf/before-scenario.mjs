// Сценарии замеров эталонной сборки «ДО»: одностраничный лендинг с useState.
import { openBrowser, collectConsole, paintMetrics, snapshot, sleep } from './helpers.mjs';

export async function runBefore(base) {
  const result = { version: 'before', base };

  const browser = await openBrowser();
  const page = await browser.newPage();
  const logger = collectConsole(page);

  // ---------- 1. Первая загрузка главной ----------
  await page.goto(base + '/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#lecturers div[class*="card"]', { timeout: 30000 });
  await sleep(500);

  result.home = await paintMetrics(page);
  result.home.rendersOnMount = logger.renderLines().length;
  result.home.cards = await page.$$eval('#lecturers div[class*="card"]', (els) => els.length);
  result.home.snapshot = await snapshot(page);
  result.home.consoleErrors = [...logger.errors];

  // ---------- 2. Клик по первой карточке ----------
  logger.reset();
  let t0 = Date.now();
  await page.click('#lecturers div[class*="card"]');
  await sleep(700);
  result.click = {
    ms: Date.now() - t0,
    renders: logger.renderLines().length,
    consoleErrors: [...logger.errors],
    snapshot: await snapshot(page),
    heading: await page.$eval('h2', (el) => el.textContent),
  };

  // ---------- 3. Кнопка «Назад к списку» ----------
  logger.reset();
  t0 = Date.now();
  const backBtn = await page.$('button[class*="backBtn"]');
  result.backButton = { found: Boolean(backBtn) };
  if (backBtn) {
    await backBtn.click();
    await sleep(600);
    result.backButton.ms = Date.now() - t0;
    result.backButton.snapshot = await snapshot(page);
    result.backButton.renders = logger.renderLines().length;
  }

  // ---------- 4. Кнопка «Назад» браузера после открытия профиля ----------
  await page.click('#lecturers div[class*="card"]');
  await sleep(600);
  const beforeHistory = await snapshot(page);
  await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
  await sleep(800);
  result.browserBack = {
    pageBeforeGoBack: beforeHistory,
    pageAfterGoBack: await snapshot(page),
  };

  // ---------- 5. Прямой адрес профиля лектора ----------
  await page.goto(base + '/lecturers/3', { waitUntil: 'networkidle2' });
  await sleep(600);
  result.deepLink = await snapshot(page);
  result.deepLink.headings = await page.$$eval('h2', (els) => els.map((el) => el.textContent));

  // ---------- 6. Перезагрузка страницы профиля ----------
  await page.goto(base + '/', { waitUntil: 'networkidle2' });
  await page.click('#lecturers div[class*="card"]');
  await sleep(500);
  await page.reload({ waitUntil: 'networkidle2' });
  await sleep(600);
  result.reloadOnProfile = await snapshot(page);

  // ---------- 7. Переходы по меню (якорные ссылки) ----------
  result.menu = [];
  await page.goto(base + '/', { waitUntil: 'networkidle2' });
  for (const [href, label] of [
    ['#partners', 'Партнеры'],
    ['#about', 'О нас'],
    ['#lecturers', 'Лекторы'],
    ['#home', 'Главная'],
  ]) {
    logger.reset();
    const link = await page.$(`header a[href="${href}"]`);
    if (!link) {
      result.menu.push({ label, found: false });
      continue;
    }
    await link.click();
    await sleep(500);
    const snap = await snapshot(page);
    result.menu.push({
      label,
      found: true,
      snapshot: snap,
      whiteScreen: snap.rootTextLength < 50,
      errors: [...logger.errors],
    });
  }

  await browser.close();
  return result;
}
