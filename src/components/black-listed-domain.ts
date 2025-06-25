import { B } from '@faker-js/faker/dist/airline-BUL6NtOJ';
import { AccessRestrictionPage } from '@page/access-restriction-page';
import { Page, Locator } from '@playwright/test';

export class BlacklistedDomain {
    private readonly domain: string;
    private readonly locator: Locator;
    private readonly page: Page;

    constructor(page: Page, locator: Locator, domain: string) {
        this.page = page;
        this.locator = locator;
        this.domain = domain;
    }

    async getName(): Promise<string> {
        const name = await this.locator.locator('td:first-child').textContent();
        return name ? name.trim() : '';
    }

    async clickDelete(): Promise<void> {
    const dialogPromise = this.page.waitForEvent('dialog').then(dialog => dialog.accept());

    const deleteButton = this.locator.locator('button.btn-link').first();
    await deleteButton.click();


    await dialogPromise;
    await this.page.waitForLoadState('networkidle');
    }
   
}

