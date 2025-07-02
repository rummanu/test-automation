import { U } from '@faker-js/faker/dist/airline-BUL6NtOJ';
import { Locator, Page } from '@playwright/test';
import { UserProfileMenu } from './user-profile-menu';

export class TopBar {
    private readonly page: Page;
    private readonly topBarLocator: Locator;

    constructor(page: Page, topBar: Locator) {
        this.page = page;
        this.topBarLocator = topBar; ;
    }

    async getUserProfileMenu(): Promise<UserProfileMenu> {
        await this.page.locator('#utb-profile-dropdown').click();
        await this.page.waitForSelector('.show > #utb-user-menu', { state: 'visible' });
        return new UserProfileMenu(
            this.page,
            this.topBarLocator.locator('.show > #utb-user-menu')
        );
    }
}