import { Locator, Page } from "@playwright/test";
import { BasePage } from "../pages/base-page";
import { UserProfileMenu } from "./user-profile-menu";

export class LucidoTopBar {
    private readonly topBarLocator: Locator;
    private readonly page: Page;

    constructor(topBarLocator: Locator, page: Page) {
        this.topBarLocator = topBarLocator;
        this.page = page;
    }

    async clickHomeButton<T extends BasePage>(pageClass: new (page: Page) => T): Promise<T> {
        const homeButton = this.topBarLocator.locator("svg[class=' icon-house']");

        await homeButton.click();
        return new pageClass(this.page);
    }

    async getUserProfileMenu(): Promise<UserProfileMenu> {
        
        await this.page.getByTestId('btn-toggle-profile-menu').click();
        // Wait for the menu to be visible
        await this.page.waitForSelector('.show > .profile-menu', { state: 'visible' });
        // Return a new UserProfileMenu instance
        return new UserProfileMenu(
            this.page,
            this.topBarLocator.locator('.show > .profile-menu')
        );
    }
}
