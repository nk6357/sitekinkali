#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const outputDirectory = path.join(projectRoot, 'dist');
const mainHtmlPath = path.join(outputDirectory, 'index.html');

const routes = [
  ['legal-details', 'Реквизиты ресторана «Кинкали»', 'Реквизиты владельца сайта и ресторана «Кинкали» в Перми.'],
  ['offer', 'Публичная оферта — ресторан «Кинкали»', 'Условия оформления и получения заказа в ресторане «Кинкали».'],
  ['privacy', 'Политика конфиденциальности — «Кинкали»', 'Правила обработки и защиты персональных данных рестораном «Кинкали».'],
  ['personal-data-consent', 'Согласие на обработку данных — «Кинкали»', 'Условия согласия на обработку персональных данных при заказе и бронировании.'],
  ['terms', 'Пользовательское соглашение — «Кинкали»', 'Правила использования сайта ресторана «Кинкали».'],
  ['cookies', 'Уведомление о cookies — «Кинкали»', 'Сведения о cookies и локальном хранилище сайта ресторана «Кинкали».'],
  ['call', 'Позвонить в ресторан «Кинкали»', 'Переход к звонку в ресторан «Кинкали» в Перми.'],
];

if (!fs.existsSync(mainHtmlPath)) {
  throw new Error('dist/index.html not found. Run the Vite build first.');
}

const mainHtml = fs.readFileSync(mainHtmlPath, 'utf8');

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

for (const [route, title, description] of routes) {
  const canonicalUrl = `https://kinkali.ru/${route}`;
  const routeHtml = mainHtml
    .replace(/<title>[^<]*<\/title>/u, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/u,
      `<meta name="description" content="${escapeAttribute(description)}" />`,
    )
    .replace(
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/u,
      '<meta name="robots" content="noindex, follow" />',
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/u,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/u,
      `<meta property="og:url" content="${canonicalUrl}" />`,
    );

  const routeDirectory = path.join(outputDirectory, route);
  fs.mkdirSync(routeDirectory, { recursive: true });
  fs.writeFileSync(path.join(routeDirectory, 'index.html'), routeHtml, 'utf8');
}

const notFoundHtml = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Страница не найдена — «Кинкали»</title>
    <link rel="icon" type="image/png" href="/brandbook/аватар.png" />
    <style>
      @font-face{font-family:Acari;src:url('/fonts/Acari-Sans-SemiBold.ttf.woff') format('woff');font-display:swap}
      *{box-sizing:border-box}body{margin:0;background:#f5f3ed;color:#302e2b;font-family:Acari,Arial,sans-serif}
      main{min-height:100vh;display:grid;place-items:center;padding:24px;text-align:center}img{width:112px;height:112px;object-fit:contain}
      h1{font-size:clamp(32px,7vw,64px);margin:24px 0 12px}p{font:20px/1.5 Arial,sans-serif;color:#6b6761}
      a{display:inline-block;margin-top:24px;padding:14px 24px;border-radius:10px;background:#302e2b;color:#fff;text-decoration:none}
    </style>
  </head>
  <body><main><div><img src="/brandbook/аватар.png" alt="Логотип Кинкали" /><h1>Страница не найдена</h1><p>Вернитесь на главную страницу ресторана.</p><a href="/">На главную</a></div></main></body>
</html>`;

fs.writeFileSync(path.join(outputDirectory, '404.html'), notFoundHtml, 'utf8');
console.log(`Generated ${routes.length} SEO route pages and 404.html`);
