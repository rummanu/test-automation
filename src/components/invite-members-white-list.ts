import { Locator, Page } from '@playwright/test';
import { WhitelistedDomain } from '@components/white-listed-domain';

export class InviteMembersWhiteList {
    private readonly page: Page;
    private readonly inviteMembersWhiteList: Locator;

    private readonly domainNameField: Locator;
    private readonly addButton: Locator;
    private readonly tableRows: Locator;
    private readonly firstChild: Locator;
    private readonly alertLocator: Locator;

    constructor(page: Page, inviteMembersWhiteListLocator: Locator) {
        this.page = page;
        this.inviteMembersWhiteList = inviteMembersWhiteListLocator;

        this.domainNameField = this.page.locator('#domainAddressMask');
        this.addButton = this.page.locator('button[name=add-invite-friend-white-list]');
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

    async findDomainByName(domainName: string): Promise<WhitelistedDomain | null> {
        // Searches for a blocked domain by name and returns it as a BlacklistedDomain instance, or null if not found
        const domainRows = this.tableRows;
        const count = await domainRows.count();
        for (let i = 0; i < count; i++) {
            const row = domainRows.nth(i);
            const name = await this.firstChild.nth(i).textContent();
            if (name && name.trim() === domainName) {
                return new WhitelistedDomain(row, name.trim(), this.page);
            }
        }
        return null;
    }

    async getDomains(): Promise<WhitelistedDomain[]> {
        // Returns all blocked domains as an array of BlacklistedDomain instances
        const domainRows = this.tableRows;
        const domains: WhitelistedDomain[] = [];
        const count = await domainRows.count();
        for (let i = 0; i < count; i++) {
            const row = domainRows.nth(i);
            const name = await this.firstChild.nth(i).textContent();
            if (name) {
                domains.push(new WhitelistedDomain(row, name.trim(), this.page));
            }
        }
        return domains;
    }

    async getFirstDomain(): Promise<WhitelistedDomain> {
        // Returns the first blocked domain as a BlacklistedDomain instance
        const firstRow = this.tableRows.first();
        const name = await this.firstChild.first().textContent();
        if (name) {
            return new WhitelistedDomain(firstRow, name.trim(), this.page);
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