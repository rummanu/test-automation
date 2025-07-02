import { TopBar } from "@components/topbar";
import { Page } from "@playwright/test";

export abstract class BasePage {
    readonly page: Page;

    protected constructor(page: Page) {
        this.page = page;
    }

    abstract getPageId(): string;

    abstract getPageUrl(): string;

    protected async acceptCookiesIfVisible(): Promise<void> {
        try {
            const cookieBanner = this.page.locator(".cookie-consent-modal");
            if (await cookieBanner.isVisible()) {
                await this.page.locator('button[data-action-url$="accept"]').click();
            }
        } catch (error) {
            console.log("Cookie banner check failed, page might be navigating");
        }
    }

    async getCurrentPageId(timeout = 30000): Promise<string> {
        const bodyElement = this.page.locator("body");
        await bodyElement.waitFor({ state: "attached", timeout });

        const pageId = await this.page.waitForFunction(
            () => document.body.getAttribute("data-test-element-id") || null,
            { timeout }
        );

        return pageId?.toString() || "";
    }

    async isAtPage(): Promise<boolean> {
        const currentPageId = await this.getCurrentPageId();
        const expectedPageId = this.getPageId();

        return currentPageId === expectedPageId;
    }

    // method for hasAlertContainningText
    async hasAlertContainingText(text: string): Promise<boolean> {
        const alert = this.page.locator('.alert:has-text("' + text + '")');
        return await alert.isVisible();
    }

    async hasHtmlTagsNotAllowedAlert(): Promise<boolean> {
        return this.hasAlertContaining("HTML");
    }

    async hasAlertContaining(message: string): Promise<boolean> {
        const alertLocator = this.page.locator('.alert, .alert-popup');
        // Wait for any alert to be visible (if present)
        if (await alertLocator.count() === 0) return false;
        await alertLocator.first().waitFor({ state: 'visible', timeout: 5000 });
        const texts = await alertLocator.allTextContents();
        return texts.some(s => s.includes(message));
    }

    async hasFieldErrorWith(text: string): Promise<boolean> {
    const errorLocators = this.page.locator('.invalid-feedback'); // Replace with your INVALID_FEEDBACK selector if different
    const count = await errorLocators.count();
    if (count === 0) return false;
    const texts = await errorLocators.allTextContents();
    return texts.some(s => s.includes(text));
}

async getTopbar(): Promise<TopBar> {
    // Returns the text content of the topbar
    const topbar = this.page.locator('#universal-top-bar');
    await topbar.waitFor({ state: 'visible' });
    return new TopBar(this.page, topbar);
}
}