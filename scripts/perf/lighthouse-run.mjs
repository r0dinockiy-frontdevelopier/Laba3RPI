// Прогон Lighthouse (мобильный профиль, Performance) несколько раз подряд.
import lighthouse from 'lighthouse';
import { launchEdge } from './browser.mjs';

const pick = (lhr, id) => {
  const a = lhr.audits[id];
  return a ? { value: a.numericValue, display: a.displayValue, score: a.score } : null;
};

export async function runLighthouse(url, runs = 3) {
  const edge = await launchEdge();
  const results = [];

  for (let i = 0; i < runs; i += 1) {
    const runnerResult = await lighthouse(
      url,
      { port: edge.port, output: 'json', logLevel: 'error' },
      {
        extends: 'lighthouse:default',
        settings: {
          formFactor: 'mobile',
          screenEmulation: {
            mobile: true,
            width: 412,
            height: 915,
            deviceScaleFactor: 2,
            disabled: false,
          },
          throttlingMethod: 'simulate',
          onlyCategories: ['performance'],
        },
      },
    );

    const lhr = runnerResult.lhr;
    results.push({
      run: i + 1,
      performanceScore: Math.round(lhr.categories.performance.score * 100),
      fcp: pick(lhr, 'first-contentful-paint'),
      lcp: pick(lhr, 'largest-contentful-paint'),
      speedIndex: pick(lhr, 'speed-index'),
      tbt: pick(lhr, 'total-blocking-time'),
      cls: pick(lhr, 'cumulative-layout-shift'),
      interactive: pick(lhr, 'interactive'),
      totalByteWeight: pick(lhr, 'total-byte-weight'),
      bootupTime: pick(lhr, 'bootup-time'),
      mainThreadWork: pick(lhr, 'mainthread-work-breakdown'),
    });
  }

  edge.kill();

  const median = (key) => {
    const values = results
      .map((r) => (typeof r[key] === 'number' ? r[key] : r[key]?.value))
      .filter((v) => typeof v === 'number')
      .sort((a, b) => a - b);
    if (!values.length) return null;
    const mid = Math.floor(values.length / 2);
    return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  };

  return {
    url,
    runs: results,
    median: {
      performanceScore: median('performanceScore'),
      fcp: median('fcp'),
      lcp: median('lcp'),
      speedIndex: median('speedIndex'),
      tbt: median('tbt'),
      cls: median('cls'),
      interactive: median('interactive'),
      totalByteWeight: median('totalByteWeight'),
      bootupTime: median('bootupTime'),
      mainThreadWork: median('mainThreadWork'),
    },
  };
}
