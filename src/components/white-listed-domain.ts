import { Page, Locator } from '@playwright/test';

export class WhitelistedDomain {
    private readonly domain: string;
    private readonly locator: Locator;
    private readonly page: Page;

    constructor(locator: Locator, domain: string, page: Page) {
        this.locator = locator;
        this.domain = domain;
        this.page = page;
    }

    async getName(): Promise<string> {
        // Returns the text content of the first cell (domain name)
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