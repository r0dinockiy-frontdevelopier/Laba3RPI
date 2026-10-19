// Запуск браузера (Microsoft Edge) без захвата stdout/stderr:
// браузер стартует с --remote-debugging-port=0, порт читаем из файла
// DevToolsActivePort, дальше подключаемся по CDP (puppeteer.connect).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

export const EDGE =
  process.env.BROWSER_PATH ??
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function launchEdge({ userDataDir, flags = [] } = {}) {
  const profileDir = userDataDir ?? path.join(os.tmpdir(), `zoomagazin-edge-${Date.now()}`);
  fs.mkdirSync(profileDir, { recursive: true });

  const child = spawn(
    EDGE,
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--disable-extensions',
      '--remote-debugging-port=0',
      `--user-data-dir=${profileDir}`,
      '--window-size=412,915',
      '--lang=ru-RU',
      ...flags,
      'about:blank',
    ],
    { stdio: 'ignore', windowsHide: true },
  );

  const portFile = path.join(profileDir, 'DevToolsActivePort');
  let port = null;
  for (let i = 0; i < 200; i += 1) {
    if (fs.existsSync(portFile)) {
      const content = fs.readFileSync(portFile, 'utf8').split('\n');
      if (content[0]) {
        port = Number(content[0].trim());
        break;
      }
    }
    await sleep(100);
  }

  if (!port) {
    child.kill();
    throw new Error('Не удалось получить порт DevTools от браузера');
  }

  return {
    port,
    process: child,
    kill() {
      try {
        child.kill();
      } catch {
        /* уже остановлен */
      }
    },
  };
}

export async function openBrowser() {
  const edge = await launchEdge();
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${edge.port}`,
    defaultViewport: { width: 412, height: 915, deviceScaleFactor: 2, isMobile: true },
  });

  browser.on('disconnected', () => edge.kill());
  const originalClose = browser.close.bind(browser);
  browser.close = async () => {
    await originalClose().catch(() => {});
    edge.kill();
  };
  return browser;
}
