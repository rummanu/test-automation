import { Locator, Page } from "@playwright/test";

export class UserProfileMenu {
    private readonly page: Page;
    private readonly userprofileMenu: Locator;

    constructor(page: Page, userProfileMenuLocator: Locator) {
        this.page = page;
        this.userprofileMenu = userProfileMenuLocator;
    }

    async hasInviteMembersLink(): Promise<boolean> {
        const inviteMembersLink = this.page.getByTestId('workspace-profile-invite-friend');
        return await inviteMembersLink.isVisible();
    }

    async clickLogout(): Promise<void> {
        const logoutButton = this.userprofileMenu.getByTestId('logout-link');
        await logoutButton.click();
    }

}
