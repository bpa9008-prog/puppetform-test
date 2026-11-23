# Тест формы: Jest + Puppeteer

Тест формы https://web-scriptor.ru/g/puppetform по инструкции https://web-scriptor.ru/g/puppetform.man

- `npm install` — установка (Puppeteer скачает Chromium; если скрипты установки отключены, запустите `node node_modules/puppeteer/install.mjs`)
- `npm test` — прогон без окна
- `npm run test:debug` — видимый браузер (`headless: false`, `slowMo: 80`) и запись `out/screencast.webm`

Готовая запись: `screencast.mp4`, вывод Jest: `jest-output.txt`.
