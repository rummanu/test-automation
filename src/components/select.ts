import { Locator, Page, expect } from "@playwright/test";

export class Select {
    private readonly page: Page;
    private readonly select: Locator;

    constructor(page: Page, selectLocator: string | Locator) {
        this.page = page;
        this.select = typeof selectLocator === "string"
            ? page.locator(selectLocator)
            : selectLocator;
    }

    async selectOption(option: string, waitForSuggestions = true): Promise<void> {
       if (await this.page.locator(".select2-results").count() === 0) {
            await this.select.click();
       }
        await this.page.locator(".select2-search__field").fill(option);

        const highlighted = this.page.locator(".select2-results__option--highlighted");
        await expect(highlighted).toBeVisible();
        await highlighted.click();
    }
}