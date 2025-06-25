import { Locator, Page, } from '@playwright/test';
import { BlockedDomainList } from './blocked-domain-list';
import { AutoApprovedList } from './auto-approved-list';
import { InviteMembersWhiteList } from './invite-members-white-list';
import { IpBasedAccessRestrictionSection } from './ip-based-access-restriction-section';

export class EmailBasedAccessControl {
    private readonly page: Page;
    private readonly emailBasedAccessControl: Locator;


    constructor(page: Page, emailBasedAccessControlLocator: Locator) {
        this.page = page;
        this.emailBasedAccessControl = emailBasedAccessControlLocator;
    }

    async getBlockedDomainList(): Promise<BlockedDomainList> {
        return new BlockedDomainList(
            this.page,
            this.emailBasedAccessControl.locator('.black-list-domain')
        );
    }

    async getAutoApprovedList(): Promise<AutoApprovedList> {
        return new AutoApprovedList(
            this.page,
            this.emailBasedAccessControl.locator('.white-list-domain')
        );
    }

    async isInviteMembersEnabled(): Promise<boolean> {
        const switchLocator = this.emailBasedAccessControl.locator('i');
        return await switchLocator.isChecked();
    }

    async getInviteMembersWhiteList(): Promise<InviteMembersWhiteList> {
        return new InviteMembersWhiteList(
            this.page,
            this.emailBasedAccessControl.locator('.invite-friends .whitelist')
        );
    }

    /**
     * Enable or disable the invite members switch.
     * @param enable true to enable, false to disable
     */
    async enableInviteMembers(enable: boolean): Promise<void> {
        await this.emailBasedAccessControl.locator('label[for="enable-invite-friend"]').click();
        await this.page.waitForSelector('.invite-friends .whitelist', { state: enable ? 'visible' : 'hidden' });
    }
}