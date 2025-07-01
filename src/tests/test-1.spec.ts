import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name' }).fill('afore consequentlyre');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('Reilly.McClure@yahoo.com');
  await page.getByRole('combobox', { name: '----' }).click();
  await page.getByRole('searchbox').click();
  await page.getByRole('searchbox').fill('armenia');
  await page.getByRole('option', { name: 'Armenia' }).click();
  await page.getByRole('button', { name: 'Save Changes' }).click();
});