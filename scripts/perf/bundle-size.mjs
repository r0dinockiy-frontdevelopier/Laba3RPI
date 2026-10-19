// Замер размеров сборок: raw / gzip / brotli по каждому файлу.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { BUILDS, METRICS } from './paths.mjs';

const builds = {
  before: BUILDS.before,
  after: BUILDS.after,
};

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const measure = (dir) => {
  if (!fs.existsSync(dir)) return null;
  const files = walk(dir).map((file) => {
    const buffer = fs.readFileSync(file);
    return {
      file: path.relative(dir, file).replace(/\\/g, '/'),
      raw: buffer.length,
      gzip: zlib.gzipSync(buffer, { level: 9 }).length,
      brotli: zlib.brotliCompressSync(buffer).length,
    };
  });
  const sum = (list, key) => list.reduce((acc, item) => acc + item[key], 0);
  const js = files.filter((f) => f.file.endsWith('.js'));
  const css = files.filter((f) => f.file.endsWith('.css'));
  const images = files.filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f.file));
  return {
    dir,
    files,
    js: { raw: sum(js, 'raw'), gzip: sum(js, 'gzip'), brotli: sum(js, 'brotli') },
    css: { raw: sum(css, 'raw'), gzip: sum(css, 'gzip'), brotli: sum(css, 'brotli') },
    images: { raw: sum(images, 'raw') },
    totalRaw: sum(files, 'raw'),
    totalGzip: sum(files, 'gzip'),
  };
};

const result = {
  timestamp: new Date().toISOString(),
  before: measure(builds.before),
  after: measure(builds.after),
};

const delta = (key, sub) => {
  const b = result.before?.[key]?.[sub] ?? 0;
  const a = result.after?.[key]?.[sub] ?? 0;
  return {
    before: b,
    after: a,
    diff: a - b,
    diffPercent: b ? Math.round(((a - b) / b) * 1000) / 10 : null,
  };
};

result.delta = {
  jsRaw: delta('js', 'raw'),
  jsGzip: delta('js', 'gzip'),
  cssRaw: delta('css', 'raw'),
  totalRaw: {
    before: result.before?.totalRaw ?? 0,
    after: result.after?.totalRaw ?? 0,
    diff: (result.after?.totalRaw ?? 0) - (result.before?.totalRaw ?? 0),
  },
  totalGzip: {
    before: result.before?.totalGzip ?? 0,
    after: result.after?.totalGzip ?? 0,
    diff: (result.after?.totalGzip ?? 0) - (result.before?.totalGzip ?? 0),
  },
  totalKb: { before: Math.round((result.before?.totalRaw ?? 0) / 1024) },
};

fs.writeFileSync(
  path.join(METRICS, 'bundle.json'),
  JSON.stringify(result, null, 2),
  'utf8',
);
console.log(JSON.stringify(result.delta, null, 2));
