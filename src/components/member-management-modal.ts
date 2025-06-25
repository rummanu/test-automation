
import { WorkspaceMemberManagementPage } from "@page/workspace-member-management-page";
import { Locator, Page } from "@playwright/test";

export class MemberManagementModal {
    private readonly workspaceMemberManagementage: WorkspaceMemberManagementPage;
    private readonly emailField: Locator;
    private readonly inviteButton: Locator;

    constructor(page: Page) {

        this.emailField = page.getByRole('textbox', { name: 'Email Addresses' });
        this.inviteButton = page.getByRole('button', { name: 'Invite' });
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailField.fill(email);
    }

    async clickSubmit(): Promise<void> {
        await this.inviteButton.click();
    }

    async waitForModalToBeVisible(): Promise<void> {
        await this.emailField.waitFor({ state: 'visible' });
    }

}
