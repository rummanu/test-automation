import { BasePage } from '@page/base-page';
import { Page } from '@playwright/test';

export abstract class BaseAuthenticationPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
    
    async hasSocialAuth(): Promise<boolean> {
        return this.page.locator('.social-auth-widget-placeholder').isVisible();
    }   

    async hasgoogleAuth(): Promise<boolean> {
        return this.page.locator('a[data-social-auth-provider="googleplus"]').isVisible();
    }
}