import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { Toggle } from '@enums/toggle';
import { Switch } from '@components/switch';
import { Select } from '@components/select';

export class GdprPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    getPageId(): string {
        return 'workspace-gdpr';
    }

    getPageUrl(): string {
        return '/a/workspace-admin/security/gdpr';
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.getPageUrl());
    }

    async acceptGdpr(): Promise<this> {
        const switchLocator = this.page.locator('#isAccepted');
        const accepted = await switchLocator.count() === 0;
        if (!accepted) {
            const switchComponent = new Switch(this.page, switchLocator);
            await switchComponent.switchState(Toggle.ON);
        }
        return this;
    }

    async fillFirstName(firstName: string): Promise<this> {
        const firstNameInput = this.page.locator('#contactFirstName');
        await firstNameInput.click();
        await firstNameInput.fill(firstName);
        await firstNameInput.waitFor({ state: 'attached' }); 
        return this;
    }

    async fillLastName(lastName: string): Promise<this> {
        const lastNameInput = this.page.locator('#contactLastName');
        lastNameInput.click();
        await lastNameInput.fill(lastName);
        await lastNameInput.waitFor({ state: 'attached' }); 
        return this;
    }

    async fillEmail(email: string): Promise<this> {
        const emailInput = this.page.locator('#contactEmailAddress');
        await emailInput.waitFor({ state: 'visible' }); 
        await emailInput.click();
        await emailInput.fill(email);
        await emailInput.waitFor({ state: 'attached' }); 
        return this;
    }

    async getEmail(): Promise<string> {
        const emailInput = this.page.locator('#contactEmailAddress');
        return await emailInput.inputValue();
    }

    async getFirstName(): Promise<string> {
        const firstNameInput = this.page.locator('#contactFirstName');
        return await firstNameInput.inputValue();
    }

    async getLastName(): Promise<string> {
        const lastNameInput = this.page.locator('#contactLastName');
        return await lastNameInput.inputValue();
    }

    async selectCountry(country: string): Promise<GdprPage> {
        const countrySelect = this.page.locator('#select2-contactCountry-container');
        await countrySelect.waitFor({ state: 'visible' }); 

        const select = new Select(this.page, countrySelect);
        await select.selectOption(country);
        return this;
    }

    async getCountry(): Promise<string> {
        const countrySelect = this.page.locator('#select2-contactCountry-container');
        return await countrySelect.textContent() || '';
    }

    async clickSaveChanges(): Promise<void> {
        const saveButton = this.page.getByRole('button', { name: 'Save changes' });
        await saveButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}