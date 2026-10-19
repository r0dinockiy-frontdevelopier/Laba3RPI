// Пути проекта: ROOT — корень репозитория, METRICS — каталог с результатами замеров.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Корень проекта (scripts/perf/../..) */
export const ROOT = path.resolve(here, '..', '..');

/** Результаты замеров — коммитятся в репозиторий */
export const METRICS = path.join(ROOT, 'docs', 'metrics');

/** Скриншоты для отчёта */
export const SCREENS = path.join(ROOT, 'docs', 'screens');

/** Собранные версии приложения */
export const BUILDS = {
  before: path.join(ROOT, 'baseline', 'dist-before'),
  beforeInstrumented: path.join(ROOT, 'baseline', 'dist-before-instrumented'),
  after: path.join(ROOT, 'dist'),
};
