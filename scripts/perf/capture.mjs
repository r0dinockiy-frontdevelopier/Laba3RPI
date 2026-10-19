// Скриншоты страниц для отчёта: собираются в docs/screens.
import fs from 'node:fs';
import path from 'node:path';
import { SCREENS } from './paths.mjs';
import { openBrowser } from './helpers.mjs';

const AFTER = process.env.AFTER_URL ?? 'http://127.0.0.1:4180';
const BEFORE = process.env.BEFORE_URL ?? 'http://127.0.0.1:4182';

const outDir = SCREENS;
fs.mkdirSync(outDir, { recursive: true });

const browser = await openBrowser();

const shots = [
  ['after-home', AFTER + '/'],
  ['after-lecturers', AFTER + '/lecturers'],
  ['after-lecturer-detail', AFTER + '/lecturers/1'],
  ['after-about', AFTER + '/about'],
  ['after-404', AFTER + '/net-takoy-stranicy'],
  ['before-home', BEFORE + '/'],
];

for (const [name, url] of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise((resolve) => setTimeout(resolve, 900));
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log('saved', file);
  await page.close();
}

// Профиль лектора в версии «ДО» — без прямого адреса, только кликом
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
await page.goto(BEFORE + '/', { waitUntil: 'networkidle2' });
await page.click('#lecturers div[class*="card"]');
await new Promise((resolve) => setTimeout(resolve, 900));
await page.screenshot({ path: path.join(outDir, 'before-lecturer-profile.png'), fullPage: true });
console.log('saved before-lecturer-profile.png');

await browser.close();
