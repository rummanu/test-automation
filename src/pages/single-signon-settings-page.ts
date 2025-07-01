import { Page, Locator } from '@playwright/test';
import { BasePage } from '@page/base-page';
import { Switch } from '@components/switch';
import { Toggle } from '@enums/toggle';
import { AddSingleSignonConfigurationPage } from './add-single-signon-configuratio-page';
import { SinglesignonType } from '@enums/single-signon-type';
import { SingleSignOnConfiguration } from '@components/single-signon-configuration';

export class SingleSignOnSettingsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    getPageId(): string {
        return "workspace-single-signon-settings";
    }

    getPageUrl(): string {
        return "/a/workspace-admin/security/single-signon";
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.getPageUrl());
    }

    async toggleSingleSignonSettings(toggle: Toggle): Promise<void> {
        const switchLocator = this.page.locator('#single-signon-settings-switch');
        const switchComponent = new Switch(this.page, switchLocator);
        await switchComponent.switchState(toggle);
    }

    async hasSingleSignonConfigurationButton(): Promise<boolean> {
        return this.page.locator('.btn[href$="single-signon/configuration"]').isVisible();
    }

    async clickAddNew(): Promise<AddSingleSignonConfigurationPage> {
        const addNewConfigurationButton: Locator = this.page.locator('.sso-configs .btn-primary');
        await addNewConfigurationButton.click();
        return new AddSingleSignonConfigurationPage(this.page);
    }

    async getSingleSignonConfigurations(): Promise<Locator> {
        return this.page.locator('.sso-configs tbody tr');
    }

    async getSsoConfigBySsoType(type: SinglesignonType): Promise<SingleSignOnConfiguration> {
        const ssoConfigLocator = this.page.locator(`.sso-configs tbody tr:has-text("${type}")`);
        if (await ssoConfigLocator.count() === 0) {
            throw new Error(`No SSO configuration found for type: ${type}`);
        }
        return new SingleSignOnConfiguration(this.page, ssoConfigLocator);
    }

    async getAllSingleSignonConfigurationNames(): Promise<string[]> {
        const configurations = await this.getSingleSignonConfigurations();
        const names: string[] = [];
        for (let i = 0; i < await configurations.count(); i++) {
            const name = await configurations.nth(i).locator('td:first-child').textContent();
            if (name) {
                names.push(name.trim());
            }
        }
        return names;
    }

    async getSingleSignonConfigurationByName(name: string): Promise<SingleSignOnConfiguration> {
        const ssoConfigLocator = this.page.locator(`.sso-configs tbody tr:has-text("${name}")`);
        if (await ssoConfigLocator.count() === 0) {
            throw new Error(`No SSO configuration found for name: ${name}`);
        }
        return new SingleSignOnConfiguration(this.page, ssoConfigLocator);
    }

    async getFirstConfigWithMakeDefaultEnabled(): Promise<SingleSignOnConfiguration | null> {
        const configurations = await this.getSingleSignonConfigurations();
        const count = await configurations.count();
        for (let i = 0; i < count; i++) {
            const configRow = configurations.nth(i);
            const config = new SingleSignOnConfiguration(this.page, configRow);
            if (!(await config.isMakeDefaultDisabled())) {
                return config;
            }
        }
        return null;
    }

    async fillEmail(email: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="mail"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(email);
        return this;
    }

    async fillDisplayName(displayName: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="displayName"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(displayName);
        return this;
    }

    async fillAvatar(avatar: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="avatar"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(avatar);
        return this;
    }

    async fillLanguage(language: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="language"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(language);
        return this;
    }

    async fillLang(lang: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="lang"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(lang);
        return this;
    }

    async fillGroups(groups: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="groups"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(groups);
        return this;
    }

    async fillPreferredLanguage(preferredLanguage: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="preferredLanguage"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(preferredLanguage);
        return this;
    }

    async fillUsername(username: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="username"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(username);
        return this;
    }

    async fillAttributeName(attributeName: string): Promise<this> {
        const inputSelector = this.page.getByRole('textbox', { name: 'Attribute Name' });
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(attributeName);
        return this;
    }

    async fillAttributeValue(attributeValue: string): Promise<this> {
        const inputSelector = this.page.getByRole('textbox', { name: 'Attribute Value' });
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(attributeValue);
        return this;
    }

    async clickAdd(): Promise<void> {
        const addButton = this.page.getByRole('button', { name: 'Add' });
        await addButton.click();
        // Wait for the page to reload or for the add action to complete
        await this.page.waitForLoadState('networkidle');
    }

    async isAttributeMapingTableVisible(): Promise<boolean> {
        const tableLocator = this.page.getByRole('table', { name: 'Attribute Mapping' });
        return await tableLocator.isVisible();
    }

    async getAttributeMappingTable(): Promise<Locator> {
        return this.page.getByRole('table', { name: 'Attribute Mapping' });
    }

    async getFirstAttributeMappingRow(): Promise<this> {
        const table = await this.getAttributeMappingTable();
        const firstRow = table.locator('tbody tr').first();
        if (await firstRow.count() === 0) {
            throw new Error('No attribute mapping rows found');
        }
        return this;
    }

    async getAttributeName(): Promise<string> {
        const row = await this.getAttributeMappingTable();
        const attributeName = await row.locator('td:nth-child(1)').textContent();
        return attributeName ? attributeName.trim() : '';
    }

    async getAttributeValue(): Promise<string> {
        const row = await this.getAttributeMappingTable();
        const attributeValue = await row.locator('td:nth-child(2)').textContent();
        return attributeValue ? attributeValue.trim() : '';
    }

    async clickDelete(): Promise<void> {
        const deleteButton = this.page.getByRole('link', { name: 'Delete' });
        const dialogPromise = this.page.waitForEvent('dialog').then(dialog => dialog.accept());
        await deleteButton.click();
        await dialogPromise;
        // Wait for the page to reload or for the delete action to complete
        await this.page.waitForLoadState('networkidle');
    }

    async setAllMatchRules(): Promise<void> {
        const allConditions = this.page.getByText('All Conditions');
        await allConditions.click();
    }

    async clickSaveChanges(): Promise<void> {
        const saveButton = this.page.getByRole('button', { name: 'Save Changes' });
        await saveButton.click();
        // Wait for the page to reload or for the save action to complete
        await this.page.waitForLoadState('networkidle');
    }
}