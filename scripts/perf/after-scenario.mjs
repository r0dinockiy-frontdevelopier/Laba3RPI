// Сценарии замеров сборки «ПОСЛЕ»: react-router-dom + Layout + страницы.
import { openBrowser, collectConsole, paintMetrics, snapshot, sleep } from './helpers.mjs';

export async function runAfter(base) {
  const result = { version: 'after', base };

  const browser = await openBrowser();
  const page = await browser.newPage();
  const logger = collectConsole(page);
  const headerLink = (path) => `header a[href="${path}"]`;

  // ---------- 1. Главная страница ----------
  await page.goto(base + '/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('header a[href="/lecturers"]', { timeout: 30000 });
  await sleep(500);
  result.home = await paintMetrics(page);
  result.home.snapshot = await snapshot(page);
  result.home.rendersOnMount = logger.renderLines().length;
  result.home.consoleErrors = [...logger.errors];

  // ---------- 2. Переход в каталог по меню ----------
  logger.reset();
  let t0 = Date.now();
  await page.click(headerLink('/lecturers'));
  await page.waitForSelector('a[href^="/lecturers/"]', { timeout: 30000 });
  await sleep(400);
  result.navigateToLecturers = {
    ms: Date.now() - t0,
    renders: logger.renderLines().length,
    cards: await page.$$eval('a[href^="/lecturers/"]', (els) => els.length),
    snapshot: await snapshot(page),
    errors: [...logger.errors],
  };

  // ---------- 3. Ввод в строку поиска (поиск с debounce 300 мс) ----------
  result.search = {};
  const search = await page.$('input[type="search"]');
  result.search.inputFound = Boolean(search);
  if (search) {
    logger.reset();
    await search.type('Петров', { delay: 30 });

    // сразу после последнего нажатия: debounce ещё не истёк
    const duringTyping = logger.renderLines();
    await sleep(600);
    const afterDebounce = logger.renderLines();

    result.search.typedValue = await page.$eval('input[type="search"]', (el) => el.value);
    result.search.rendersDuringTyping = duringTyping.length;
    result.search.rendersAfterDebounce = afterDebounce.length - duringTyping.length;
    result.search.renderedNamesAfterDebounce = afterDebounce
      .slice(duringTyping.length)
      .map((m) => m.text.replace('Рендер карточки: ', ''));

    // очистка поля с клавиатуры — как это делает пользователь
    logger.reset();
    await page.click('input[type="search"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await sleep(600);
    result.search.clearRenders = logger.renderLines().length;
    result.search.clearedValue = await page.$eval('input[type="search"]', (el) => el.value);
  }

  // ---------- 4. Клик по карточке лектора ----------
  logger.reset();
  t0 = Date.now();
  await page.click('a[href^="/lecturers/"]');
  await sleep(600);
  result.click = {
    ms: Date.now() - t0,
    renders: logger.renderLines().length,
    snapshot: await snapshot(page),
    heading: await page.$eval('h2', (el) => el.textContent),
    errors: [...logger.errors],
  };

  // ---------- 5. Кнопка «Назад к списку» (useNavigate) ----------
  logger.reset();
  t0 = Date.now();
  await page.click('button[class*="backBtn"]');
  await sleep(500);
  result.backButton = {
    ms: Date.now() - t0,
    snapshot: await snapshot(page),
    renders: logger.renderLines().length,
    errors: [...logger.errors],
  };

  // ---------- 6. Кнопка «Назад» браузера ----------
  await page.click('a[href^="/lecturers/"]');
  await sleep(400);
  const beforeBack = await snapshot(page);
  await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
  await sleep(600);
  result.browserBack = {
    pageBeforeGoBack: beforeBack,
    pageAfterGoBack: await snapshot(page),
  };

  // ---------- 7. Прямой адрес /lecturers/3 ----------
  await page.goto(base + '/lecturers/3', { waitUntil: 'networkidle2' });
  await sleep(400);
  result.deepLink = await snapshot(page);
  result.deepLink.heading = await page.$eval('h2', (el) => el.textContent);

  // ---------- 8. Перезагрузка страницы профиля ----------
  await page.reload({ waitUntil: 'networkidle2' });
  await sleep(500);
  result.reloadOnProfile = await snapshot(page);
  result.reloadOnProfile.heading = await page.$eval('h2', (el) => el.textContent);

  // ---------- 9. Несуществующий лектор ----------
  await page.goto(base + '/lecturers/999', { waitUntil: 'networkidle2' });
  await sleep(400);
  result.unknownLecturer = await snapshot(page);
  result.unknownLecturer.heading = await page
    .$eval('h1', (el) => el.textContent)
    .catch(() => null);

  // ---------- 10. Несуществующая страница (404) ----------
  await page.goto(base + '/kakaya-to-netakaya-stranica', { waitUntil: 'networkidle2' });
  await sleep(400);
  result.notFound = await snapshot(page);
  result.notFound.heading = await page
    .$eval('h1', (el) => el.textContent)
    .catch(() => null);
  result.notFound.errors = [...logger.errors];

  // ---------- 11. Визуальный тест навигации по меню ----------
  result.menu = [];
  await page.goto(base + '/', { waitUntil: 'networkidle2' });
  for (const [path, label] of [
    ['/lecturers', 'Лекторы'],
    ['/about', 'О нас'],
    ['/', 'Главная'],
  ]) {
    logger.reset();
    t0 = Date.now();
    await page.click(headerLink(path));
    await sleep(350);
    const snap = await snapshot(page);
    result.menu.push({
      label,
      ms: Date.now() - t0,
      snapshot: snap,
      whiteScreen: snap.rootTextLength < 50,
      errors: [...logger.errors],
      activeLink: await page.$$eval('header nav a', (els) =>
        els
          .filter((el) => getComputedStyle(el).borderBottomColor !== 'rgba(0, 0, 0, 0)')
          .map((el) => el.textContent),
      ),
    });
  }

  // ---------- 12. Прямая загрузка каталога ----------
  const catalogPage = await browser.newPage();
  const catalogLogger = collectConsole(catalogPage);
  await catalogPage.goto(base + '/lecturers', { waitUntil: 'networkidle2' });
  await catalogPage.waitForSelector('a[href^="/lecturers/"]', { timeout: 30000 });
  await sleep(400);
  result.catalogDirectLoad = {
    ...(await paintMetrics(catalogPage)),
    renders: catalogLogger.renderLines().length,
    cards: await catalogPage.$$eval('a[href^="/lecturers/"]', (els) => els.length),
    errors: [...catalogLogger.errors],
  };

  await browser.close();
  return result;
}
