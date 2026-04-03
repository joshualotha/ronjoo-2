const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.log('CRASH STACK TRACE:', error.message);
    console.log(error.stack);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  console.log('Navigating to Destination page...');
  await page.goto('http://localhost:8000/destinations/serengeti', { waitUntil: 'networkidle2' });
  
  console.log('Waiting 3 seconds...');
  await new Promise(r => setTimeout(r, 3000));
  
  const content = await page.content();
  if (content.includes('Cannot read properties of null')) {
    console.log('Error still present on page visually!');
  } else {
    console.log('Page loaded without the fatal error mapping string.');
  }

  await browser.close();
})();
