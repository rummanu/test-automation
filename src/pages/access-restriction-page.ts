import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";
import { EmailBasedAccessControl } from "@components/email-based-access-control";
import { IpBasedAccessRestrictionSection } from "@components/ip-based-access-restriction-section";
import { CurseFiltering } from "@components/curse-filtering";

export class AccessRestrictionPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    getPageId(): string {
        return "access-restrictions";
    }

    getPageUrl(): string {
        return "/a/workspace-admin/security/access-restrictions";
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.getPageUrl());
    }

    async getEmailBasedAccessControl(): Promise<EmailBasedAccessControl> {
        const emailBasedAccessControlLocator: Locator = this.page.locator('.email-based-access-control');
        return new EmailBasedAccessControl(this.page, emailBasedAccessControlLocator);
    }

    async getIpBasedAccessRestrictionSection(): Promise<IpBasedAccessRestrictionSection> {
        const ipBasedAccessRestrictionLocator: Locator = this.page.getByTestId('access-restriction');
        return new IpBasedAccessRestrictionSection(this.page, ipBasedAccessRestrictionLocator);
    }

    async getCurseFilteringSection(): Promise<CurseFiltering> {
        const curseFilteringLocator: Locator = this.page.getByTestId('curse-filtering');
        return new CurseFiltering(this.page, curseFilteringLocator);
    }
}