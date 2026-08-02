# Развёртывание на виртуальном хостинге Beget

Эта папка содержит только конфигурацию для Beget. В продакшн-репозитории не
хранятся ни SSH-пароли, ни SMTP-пароли.

## Структура на хостинге

```text
~/kinkali/                 # приложение, закрытый файл .env и node_modules
~/walkinon.beget.tech/     # каталог сайта, созданный в панели Beget
~/walkinon.beget.tech/public_html -> ~/kinkali/dist
```

`public_html` должен указывать только на `dist`. Поэтому `.env` остаётся вне
публичного каталога и не может быть отдан веб-сервером.

## Конфигурация окружения

Создайте `~/kinkali/.env` по образцу `.env.example`. Для тестового домена
укажите:

```env
NODE_ENV=production
TRUST_PROXY=true
ALLOWED_ORIGINS=https://walkinon.beget.tech
```

Укажите реальные `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`,
`SMTP_PASSWORD` и `SMTP_FROM`. Не добавляйте `.env` в Git и не размещайте его
в `public_html`.

## Passenger

После сборки нужно скопировать `.htaccess.template` в `dist/.htaccess` и
подставить абсолютные пути `PassengerNodejs` и `PassengerAppRoot`.
Затем создать `~/kinkali/tmp/restart.txt`, чтобы Passenger перезапустил
приложение.

Конфигурация поддерживает API заказов и бронирований, а также клиентские
маршруты документов (`/offer`, `/privacy` и другие).
