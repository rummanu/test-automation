import { BasePage } from "./base-page";
import { Page } from "@playwright/test";
import { SingleSignOnSettingsPage } from "./single-signon-settings-page";

export abstract class SingleSignonConfigurationPage extends BasePage {
    async fillGoogleAppsDomainName(domainName: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="googleAppsDomain"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(domainName);
        return this;
    }

    async getGoogleAppsDomainNameField(): Promise<this> {
        const inputSelector = this.page.locator('input[name="googleAppsDomain"]');
        await inputSelector.waitFor({ state: 'visible' });
        return this;
    }

    async fillAdminEmail(emailDomain: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="googleAppsAdminEmail"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(emailDomain);
        return this;
    }

    async fillBlockedDomains(blockedDomains: string): Promise<this> {
        const inputSelector = this.page.locator('textarea[name="blacklistEmailMask"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(blockedDomains);
        return this;
    }

    async getBlockedDomainsField(): Promise<this> {
        const inputSelector = this.page.locator('textarea[name="blacklistEmailMask"]');
        await inputSelector.waitFor({ state: 'visible' });
        return this;
    }

    async getAdminEmailField(): Promise<this> {
        const inputSelector = this.page.locator('input[name="googleAppsAdminEmail"]');
        await inputSelector.waitFor({ state: 'visible' });
        return this;
    }

    async fillDisplayName(displayName: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="displayName"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(displayName);
        return this;
    }

    async getDisplayNameField(): Promise<this> {
        const inputSelector = this.page.locator('input[name="displayName"]');
        await inputSelector.waitFor({ state: 'visible' });
        return this;
    }

    async fillEntityId(entityId: string): Promise<this> {
        const inputSelector = this.page.locator('input[name="identifierName"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(entityId);
        return this;
    }

    async getEntityIdField(): Promise<this> {
        const inputSelector = this.page.locator('input[name="identifierName"]');
        await inputSelector.waitFor({ state: 'visible' });
        return this;
    }

    async fillMetaData(metadata: string): Promise<this> {
        const inputSelector = this.page.locator('textarea[name="_rich_content_samlIdpMetadata"]');
        await inputSelector.click({ force: true }); // Ensure the input is focused
        await inputSelector.fill(metadata);
        return this;
    }

    async getMetaDataField(): Promise<this> {
        const inputSelector = this.page.locator('textarea[name="_rich_content_samlIdpMetadata"]');
        await inputSelector.waitFor({ state: 'visible' });
        return this;
    }

    async clickSaveChanges(): Promise<SingleSignOnSettingsPage> {
        const locator = this.page.getByRole('button', { name: 'Save Changes' });
        await locator.click();
        // wait for the alert displayed
        await this.page.waitForSelector('.alert', { state: 'visible' });
        await this.page.waitForLoadState('networkidle');
        return new SingleSignOnSettingsPage(this.page);
    }
}