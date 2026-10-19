// Статический сервер с SPA-fallback: используется только для замеров,
// чтобы отдавать собранный dist/ (и эталонную сборку «ДО») без vite preview.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [, , rootArg, portArg] = process.argv;
const root = path.resolve(rootArg);
const port = Number(portArg ?? 4180);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const candidate = path.join(root, urlPath);
  const inside = candidate.startsWith(root);
  const isFile = inside && fs.existsSync(candidate) && fs.statSync(candidate).isFile();
  const file = isFile ? candidate : path.join(root, 'index.html');
  const ext = path.extname(file).toLowerCase();

  res.writeHead(200, {
    'Content-Type': mime[ext] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`serving ${root} on http://127.0.0.1:${port}`);
});
