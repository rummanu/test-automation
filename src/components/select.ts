import { Locator, Page, expect } from "@playwright/test";

export class Select {
    private readonly page: Page;
    private readonly select: Locator;

    constructor(page: Page, selectLocator: string) {
        this.page = page;
        this.select = page.locator(selectLocator);
    }

    // Select option by visible text (works for native, Select2, and React select)
    async selectOption(option: string, waitForSuggestions = true): Promise<void> {
        if (await this.isReactSelect()) {
            await this.selectReact(option, waitForSuggestions);
        } else {
            await this.selectSelect2(option);
        }  
    }

    // Get the currently selected option's text
    async getSelectedOption(): Promise<string> {
        if (await this.isReactSelect()) {
            return this.select.locator(".ideascale-select__single-value").textContent() ?? "";
        } else {
            return this.select.locator(".selection .select2-selection__rendered").textContent() ?? "";
        }
    }

    private async isReactSelect(): Promise<boolean> {
        return await this.page.locator(".ideascale-select").count() > 0;
    }

    private async selectSelect2(option: string): Promise<void> {
        if (await this.page.locator(".select2-results").count() === 0) {
            await this.select.click();
        }
        await this.page.waitForSelector(".select2-results");
        const searchField = this.select.locator(".selection .select2-search__field");
        if (await searchField.count()) {
            await searchField.fill(option);
        } else {
            await this.page.locator(".select2-search__field").fill(option);
        }
        const highlighted = this.page.locator(".select2-results__option--highlighted");
        await expect(highlighted).toBeVisible();
        await highlighted.click();
    }

    private async selectReact(option: string, waitForSuggestions: boolean): Promise<void> {
        const trigger = this.select.locator(".ideascale-select__control");
        await trigger.click();
        const input = this.page.locator(".ideascale-select__input input");
        await input.fill(option);
        if (waitForSuggestions) {
            const focused = this.page.locator(".ideascale-select-menu .option-focused");
            await expect(focused).toBeVisible({ timeout: 15000 });
            await focused.click();
        } else {
            await input.press("Enter");
        }
    }
}