const { chromium } = require('playwright');
const path = require('path');

async function verifyFrontend() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to app...');
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });

  console.log('Taking Home screenshot...');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'home.png') });

  console.log('Navigating to Add Debt...');
  await page.locator('[data-testid="fab-add-debt"]').click();
  await page.waitForTimeout(1000);

  console.log('Filling out Add Debt form...');
  await page.locator('[data-testid="input-titulo"]').fill('Alquiler');
  await page.locator('[data-testid="input-monto"]').fill('5000');

  await page.screenshot({ path: path.join(__dirname, 'add_debt.png') });

  await page.locator('[data-testid="btn-save"]').click();
  await page.waitForTimeout(2000);

  console.log('Taking Home updated screenshot...');
  await page.screenshot({ path: path.join(__dirname, 'home_updated.png') });

  await page.locator('text=Alquiler').click();
  await page.waitForTimeout(1000);

  console.log('Taking Detail screenshot...');
  await page.screenshot({ path: path.join(__dirname, 'detail.png') });

  await browser.close();
  console.log('Done!');
}

verifyFrontend().catch(console.error);
