# Развёртывание на виртуальном хостинге Beget

Эта папка содержит только конфигурацию для Beget. В продакшн-репозитории не
хранятся ни SSH-пароли, ни SMTP-пароли.

## Структура на хостинге

```text
~/kinkali/                 # приложение, закрытый файл .env и node_modules
~/kinkali.ru/              # каталог сайта, созданный в панели Beget
~/kinkali.ru/public_html -> ~/kinkali/dist
```

`public_html` должен указывать только на `dist`. Поэтому `.env` остаётся вне
публичного каталога и не может быть отдан веб-сервером.

## Конфигурация окружения

Создайте `~/kinkali/.env` по образцу `.env.example`. Для основного домена
укажите:

```env
NODE_ENV=production
TRUST_PROXY=true
ALLOWED_ORIGINS=https://kinkali.ru,https://www.kinkali.ru
```

Укажите реальные `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`,
`SMTP_PASSWORD` и `SMTP_FROM`. Не добавляйте `.env` в Git и не размещайте его
в `public_html`.

## Passenger

Passenger запускает `passenger.cjs`, который загружает основной ES-модуль
`server.js`.

После сборки нужно скопировать `.htaccess.template` в `dist/.htaccess` и
подставить абсолютные пути `PassengerNodejs` и `PassengerAppRoot`.
Затем создать `~/kinkali/tmp/restart.txt`, чтобы Passenger перезапустил
приложение.

В панели Beget привяжите `kinkali.ru` к каталогу `~/kinkali.ru/public_html`,
включите бесплатный SSL-сертификат и его автоматическое продление. Конфигурация
перенаправляет HTTP и `www.kinkali.ru` на `https://kinkali.ru`.

Конфигурация поддерживает API заказов и бронирований, а также клиентские
маршруты документов (`/offer`, `/privacy` и другие).
