// По инструкции: переключение между видимым браузером (NODE_ENV=debug) и headless
export const isDebugging = () => {
  const debugging_mode = {
    puppeteer: { headless: false, slowMo: 80, args: ['--window-size=1920,1080'] },
    jasmine: 60000,
  };
  return process.env.NODE_ENV === 'debug' ? debugging_mode : { puppeteer: {}, jasmine: 60000 };
};
