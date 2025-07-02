import { Page } from "@playwright/test";
import { BasePage } from "./base-page";
import { Toggle } from "@enums/toggle";
import { Switch } from "@components/switch";

export class SocialLoginSettingsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    getPageId(): string {
        return "workspace-social-login-settings";
    }

    getPageUrl(): string {
        return "a/workspace-admin/security/social-login-settings";
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.getPageUrl());
    }

    async googleAuth(toggle: Toggle): Promise<void> {
        const googleAuthSwitch = this.page.locator('#google-auth-enabled');
        const switchComponent = new Switch(this.page, googleAuthSwitch);
        await switchComponent.switchState(toggle);
    }

    async linkedInAuth(toggle: Toggle): Promise<void> {
        const linkedInAuthSwitch = this.page.locator('#linkedin-auth-enabled');
        const switchComponent = new Switch(this.page, linkedInAuthSwitch);
        await switchComponent.switchState(toggle);
    }

    async microsoftAuth(toggle: Toggle): Promise<void> {
        const microsoftAuthSwitch = this.page.locator('#microsoft-auth-enabled');
        const switchComponent = new Switch(this.page, microsoftAuthSwitch);
        await switchComponent.switchState(toggle);
    }

    async appleAuth(toggle: Toggle): Promise<void> {
        const appleAuthSwitch = this.page.locator('#apple-auth-enabled');
        const switchComponent = new Switch(this.page, appleAuthSwitch);
        await switchComponent.switchState(toggle);
    }

    async clickSaveChanges(): Promise<void> {
        const saveChangesButton = this.page.getByRole('button', { name: 'Save Changes' });
        await saveChangesButton.click();
        await this.page.waitForLoadState('networkidle'); 
    }
    
}