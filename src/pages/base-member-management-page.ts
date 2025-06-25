import { MemberManagementModal } from "@components/member-management-modal";
import { BaseMemberAndGroupManagementPage } from "@page/base-member-and-group-management-page";
import { expect, Locator, Page } from "@playwright/test";

export abstract class BaseMemberManagementPage extends BaseMemberAndGroupManagementPage {
    protected constructor(page: Page) {
        super(page);
      }


    async clickAddMemberButton(): Promise<MemberManagementModal> {
        const addMemberButton: Locator = this.page.getByRole('button', { name: 'Add Member' });
        await expect(addMemberButton).toBeVisible();
        await addMemberButton.click();
        return new MemberManagementModal(this.page);
    }
    
}