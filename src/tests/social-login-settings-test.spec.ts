import {test, expect} from "@fixture/page-fixtures";
import { SocialLoginSettingsPage } from "@page/social-login-settings-page";
import { Toggle } from "@enums/toggle";
import { LoginPage } from "@page/login-page";

test.describe("Social Login Settings test", (): void => {
    test.use({ storageState: ".auth/workspace-admin.json" });

    test.beforeEach(async ({ socialLoginSettingsPage }) => {
        await socialLoginSettingsPage.navigate();
    });

    test("view social login options on login page", async ({ socialLoginSettingsPage , loginPage }) => {
        await socialLoginSettingsPage.googleAuth(Toggle.ON);
        await socialLoginSettingsPage.linkedInAuth(Toggle.ON);
        await socialLoginSettingsPage.microsoftAuth(Toggle.ON);
        await socialLoginSettingsPage.appleAuth(Toggle.ON);  
        await socialLoginSettingsPage.clickSaveChanges();

        const topbar = await socialLoginSettingsPage.getTopbar();
        const usermenu = await topbar.getUserProfileMenu();
        await usermenu.clickLogout();

       await loginPage.navigate();
       expect(await loginPage.hasSocialAuth()).toBeTruthy();
       expect(await loginPage.hasgoogleAuth()).toBeTruthy();
    
    });

    test("verify social login options are not showing in the login page", async ({ socialLoginSettingsPage, loginPage }) => {
        await socialLoginSettingsPage.googleAuth(Toggle.OFF);
        await socialLoginSettingsPage.linkedInAuth(Toggle.OFF);
        await socialLoginSettingsPage.microsoftAuth(Toggle.OFF);
        await socialLoginSettingsPage.appleAuth(Toggle.OFF);  
        await socialLoginSettingsPage.clickSaveChanges();

        const topbar = await socialLoginSettingsPage.getTopbar();
        const usermenu = await topbar.getUserProfileMenu();
        await usermenu.clickLogout();

        await loginPage.navigate();
        expect(await loginPage.hasSocialAuth()).toBeFalsy();
    });
});