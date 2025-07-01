import { EditSingleSignOnConfigurationPage } from '@page/edit-single-signon-configuration-page';
import { SingleSignOnSettingsPage } from '@page/single-signon-settings-page';
import { Locator, Page } from '@playwright/test';

export class SingleSignOnConfiguration {
    private readonly page: Page;
    private readonly ssoConfiguration: Locator;

    constructor(page: Page, ssoConfigurationLocator: Locator) {
        this.page = page;
        this.ssoConfiguration = ssoConfigurationLocator;
    }

    async delete(): Promise<void> {
        const deleteButton = this.page.locator("a[href$='single-signon/delete']").first();
        const dialogPromise = this.page.waitForEvent('dialog').then(dialog => dialog.accept());
        await deleteButton.click();
        await dialogPromise;
        await this.page.waitForLoadState('networkidle');
    }

    async getEntityName(): Promise<string> {
        const entityName = await this.ssoConfiguration.locator('td:nth-child(2)').textContent();
        return entityName ? entityName.trim() : '';
    }

    async getName(): Promise<string> {
        const name = await this.ssoConfiguration.locator('td:nth-child(1)').textContent();
        return name ? name.trim() : '';
    }

    async clickEdit(): Promise<EditSingleSignOnConfigurationPage> {
        const editButton = this.ssoConfiguration.locator("a[href*='/single-signon/edit/']").first();
        await editButton.click();
        await this.page.waitForLoadState('networkidle');
        return new EditSingleSignOnConfigurationPage(this.page);
    }

    async clickMakeDefault(): Promise<void> {
        const locator: Locator = this.page.getByRole('link', { name: 'Make Default' }).first();
        await locator.click();
        // wait for the alert displayed
        await this.page.waitForSelector('.alert', { state: 'visible' });

    }

    async isMakeDefaultDisabled(): Promise<boolean> {
        return await this.ssoConfiguration.locator('td span.text-muted').count() > 0;
    }

    async clickMapAttributes(): Promise<SingleSignOnSettingsPage> {
        const locator: Locator = this.page.getByRole('link', { name: 'Map Attributes' }).first();
        await locator.click();
        await this.page.waitForLoadState('networkidle');
        return new SingleSignOnSettingsPage(this.page);
    }

    async clickLoginConditionAttribute(): Promise<SingleSignOnSettingsPage> {
        const locator: Locator = this.page.getByRole('link', { name: 'Login Condition Attributes' }).first();
        await locator.click();
        await this.page.waitForLoadState('networkidle');
        return new SingleSignOnSettingsPage(this.page);
    }
}
