import { Locator, Page } from '@playwright/test';
import { BasePage } from '@page/base-page';
import { BlacklistedDomain } from './black-listed-domain';

export class BlockedDomainList {
    private readonly page: Page;
    private readonly blacklistSection: Locator;

    private readonly domainNameField: Locator;
    private readonly addButton: Locator;
    private readonly tableRows: Locator;
    private readonly firstChild: Locator;
    private readonly alertLocator: Locator;

    constructor(page: Page, blacklistSection: Locator) {
        this.page = page;
        this.blacklistSection = blacklistSection;
        this.domainNameField = this.page.locator('#blacklist input[name="addressMask"]');
        this.addButton = this.page.locator('button[name="add-black-list"]');
        this.tableRows = this.page.locator('.table tbody tr');
        this.firstChild = this.page.locator('td:first-child');
        this.alertLocator = this.page.locator('.alert');
    }

    async fillDomainName(domainName: string): Promise<void> {
        await this.domainNameField.click();
        await this.domainNameField.fill(domainName);
    }

    async addDomain(): Promise<void> {
        await this.addButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async findDomainByName(domainName: string): Promise<BlacklistedDomain | null> {
        const domainRows = this.tableRows;
        const count = await domainRows.count();
        for (let i = 0; i < count; i++) {
            const row = domainRows.nth(i);
            const name = (await row.locator('td:first-child').textContent())?.trim();
            if (name === domainName) {
                return new BlacklistedDomain(this.page,row, name);
            }
        }
        return null;
    }

    async getDomains(): Promise<BlacklistedDomain[]> {
        // Returns all blocked domains as an array of BlacklistedDomain instances
        const domainRows = this.tableRows;
        const domains: BlacklistedDomain[] = [];
        const count = await domainRows.count();
        for (let i = 0; i < count; i++) {
            const row = domainRows.nth(i);
            const name = await row.locator('td:first-child').textContent();
            if (name) {
                domains.push(new BlacklistedDomain(this.page,row, name.trim()));
            }
        }
        return domains;
    }

    async getFirstDomain(): Promise<BlacklistedDomain> {
        // Returns the first blocked domain as a BlacklistedDomain instance
        const firstRow = this.tableRows.first();
        const name = await firstRow.locator('td:first-child').textContent();
        if (name) {
            return new BlacklistedDomain(this.page, firstRow, name.trim());
        }
        throw new Error('No blocked domains found');
    }

    async getDomainCount(): Promise<number> {
        const domainRows = this.tableRows;
        return await domainRows.count();
    }

    async getDomainNames(): Promise<string[]> {
        // Returns an array of domain names from the blocked domain list
        const domainRows = this.tableRows;
        const names: string[] = [];
        const count = await domainRows.count();
        for (let i = 0; i < count; i++) {
            const name = await this.firstChild.nth(i).textContent();
            if (name) {
                names.push(name.trim());
            }
        }
        return names;
    }
}