import { AccessRestrictionPage } from '@page/access-restriction-page';
import { Locator, Page } from '@playwright/test';

export class IpBasedAccessRestrictionSection {
    private readonly page: Page;
    private readonly ipBasedAccessrestriction: Locator;

    constructor(page: Page, ipBasedAccessRestrictionLocator: Locator) {
        this.page = page;
        this.ipBasedAccessrestriction =  ipBasedAccessRestrictionLocator;
    }

    async fillIpAddress(ipAddress: string): Promise<void> {
        const ipInput = this.page.locator('#allowed-ip-ranges');
        await ipInput.fill(ipAddress);
    }

    async clickSaveChanges(): Promise<void> {
        await this.ipBasedAccessrestriction.locator("[data-test-element-id='allowed-ip-save-changes']").click();
        // Wait for the save action to complete, e.g., by waiting for a success message or the page to reload
        await this.page.waitForTimeout(1000); 
        
    }   
}