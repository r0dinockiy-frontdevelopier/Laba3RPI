// Единый прогон всех замеров: сценарии «до»/«после», FCP по 3 загрузкам и Lighthouse.
// Использование: node run-all.mjs
import fs from 'node:fs';
import path from 'node:path';
import { METRICS } from './paths.mjs';
import { runBefore } from './before-scenario.mjs';
import { runAfter } from './after-scenario.mjs';
import { runLighthouse } from './lighthouse-run.mjs';
import { openBrowser, paintMetrics, sleep } from './helpers.mjs';

const AFTER = process.env.AFTER_URL ?? 'http://127.0.0.1:4180';
const BEFORE_INSTRUMENTED = process.env.BEFORE_URL ?? 'http://127.0.0.1:4181';
const BEFORE_CLEAN = process.env.BEFORE_CLEAN_URL ?? 'http://127.0.0.1:4182';

const resultsDir = METRICS;
fs.mkdirSync(resultsDir, { recursive: true });

const write = (name, data) => {
  fs.writeFileSync(path.join(resultsDir, name), JSON.stringify(data, null, 2), 'utf8');
  console.log(`written ${name}`);
};

async function measureFcp(url, attempts = 3) {
  const browser = await openBrowser();
  const samples = [];
  for (let i = 0; i < attempts; i += 1) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await sleep(700);
    const metrics = await paintMetrics(page);
    samples.push(metrics);
    await page.close();
  }
  await browser.close();
  const fcps = samples.map((s) => s.fcp).filter((v) => typeof v === 'number').sort((a, b) => a - b);
  return {
    samples,
    medianFcp: fcps.length ? fcps[Math.floor(fcps.length / 2)] : null,
  };
}

console.log('=== сценарии «ПОСЛЕ» ===');
const after = await runAfter(AFTER);
write('scenario-after.json', after);

console.log('=== сценарии «ДО» ===');
const before = await runBefore(BEFORE_INSTRUMENTED);
write('scenario-before.json', before);

console.log('=== FCP по 3 загрузкам ===');
const fcp = {
  before: await measureFcp(BEFORE_CLEAN + '/'),
  afterHome: await measureFcp(AFTER + '/'),
  afterCatalog: await measureFcp(AFTER + '/lecturers'),
};
write('fcp-samples.json', fcp);

console.log('=== Lighthouse «ДО» ===');
const lhBefore = await runLighthouse(BEFORE_CLEAN + '/', 3);
write('lighthouse-before.json', lhBefore);

console.log('=== Lighthouse «ПОСЛЕ» (главная) ===');
const lhAfterHome = await runLighthouse(AFTER + '/', 3);
write('lighthouse-after-home.json', lhAfterHome);

console.log('=== Lighthouse «ПОСЛЕ» (каталог лекторов) ===');
const lhAfterCatalog = await runLighthouse(AFTER + '/lecturers', 3);
write('lighthouse-after-lecturers.json', lhAfterCatalog);

const summary = {
  before: { fcpMedian: fcp.before.medianFcp, lighthouse: lhBefore.median },
  afterHome: { fcpMedian: fcp.afterHome.medianFcp, lighthouse: lhAfterHome.median },
  afterCatalog: { fcpMedian: fcp.afterCatalog.medianFcp, lighthouse: lhAfterCatalog.median },
};
write('summary.json', summary);
console.log(JSON.stringify(summary, null, 2));
