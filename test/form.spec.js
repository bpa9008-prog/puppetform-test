import puppeteer from 'puppeteer';
import ffmpegPath from 'ffmpeg-static';
import { isDebugging } from '../testingInit.js';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';

const APP = 'https://kodaktor.ru/g/puppetform';
const lead = {
  name: 'Павел',
  email: 'paw9.9@yandex.ru',
  phone: '+79650019070',
  message: 'Здравствуйте! Хочу заказать консультацию по автоматизации тестирования.',
};
const width = 1920, height = 1080;
const debug = process.env.NODE_ENV === 'debug';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
let browser, page, recorder;

// Плашка с результатом прямо в окне браузера (для скринкаста)
const banner = (text, color) => page.evaluate((text, color) => {
  const d = document.createElement('div');
  d.textContent = text;
  d.style.cssText = `position:fixed;left:0;right:0;top:40%;padding:40px;z-index:99999;
    font:bold 32px system-ui;text-align:center;color:#fff;background:${color};animation:pulse 0.5s infinite alternate`;
  const st = document.createElement('style');
  st.textContent = '@keyframes pulse{from{opacity:.75}to{opacity:1}}';
  document.head.append(st);
  document.body.append(d);
}, text, color);

beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging().puppeteer);
  page = await browser.newPage();
  await page.setViewport({ width, height });
});
afterAll(async () => {
  if (recorder) await recorder.stop();
  await browser.close();
}, 60000);

describe('Contact form', () => {
  test('lead can submit a contact request', async () => {
    await page.goto(APP, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('[data-test=contact-form]');
    // запись начинается, когда страница уже загружена
    if (debug) { recorder = await page.screencast({ path: 'out/screencast.webm', ffmpegPath }); await pause(1500); }
    await page.click('input[name=name]');
    await page.type('input[name=name]', lead.name);
    await page.click('input[name=email]');
    await page.type('input[name=email]', lead.email);
    await page.click('input[name=tel]');
    await page.type('input[name=tel]', lead.phone);
    await page.click('textarea[name=message]');
    await page.type('textarea[name=message]', lead.message);
    await page.click('input[type=checkbox]');
    await page.click('button[type=submit]');
    await page.waitForSelector('.modal', { visible: true });
    const text = await page.$eval('.modal .title', (el) => el.textContent);
    expect(text).toContain('Спасибо');
    if (debug) {
      await banner('✓ PASS: lead can submit a contact request', '#23a55a');
      await pause(5000);
    }
  }, isDebugging().jasmine);

  test('assert that <title> is correct', async () => {
    expect(await page.title()).toBe('Для тестирования формы с Puppetter');
  });
});
