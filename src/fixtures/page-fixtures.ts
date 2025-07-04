
import { WorkspaceHomePage } from "@page/workspace-home-page";
import { LoginPage } from "@page/login-page";
import { test as base } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";
import { AccessRestrictionPage } from "@page/access-restriction-page";
import { SingleSignOnSettingsPage } from "@page/single-signon-settings-page";
import { GdprPage } from "@page/gdpr-page"; 
import { SocialLoginSettingsPage } from "@page/social-login-settings-page";

const envArg = process.env.ENV || 'local';
let envFile = 'credentials.env';
if (envArg === 'stage') envFile = 'credentials.stage.env';
else if (envArg === 'test1') envFile = 'credentials.test1.env';
else if (envArg === 'test2') envFile = 'credentials.test2.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

type PageFixtures = {
    workspaceHomePage: WorkspaceHomePage;
    loginPage: LoginPage;
    accessRestrictionPage: AccessRestrictionPage;
    singleSignOnSettingsPage: SingleSignOnSettingsPage;
    gdprPage: GdprPage;
    socialLoginSettingsPage: SocialLoginSettingsPage; // Optional for backward compatibility
};

export const test = base.extend<PageFixtures>({
    workspaceHomePage: async ({ page }, use) => {
        const workspaceHomePage = new WorkspaceHomePage(page);
        await use(workspaceHomePage);
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    accessRestrictionPage: async ({ page }, use) => {
        const accessRestrictionPage = new AccessRestrictionPage(page);
        await use(accessRestrictionPage);
    },

    singleSignOnSettingsPage: async ({ page }, use) => {
        const singleSignOnSettingsPage = new SingleSignOnSettingsPage(page);
        await use(singleSignOnSettingsPage);
    },

    gdprPage: async ({ page }, use) => {
        const gdprPage = new GdprPage(page);
        await use(gdprPage);
    },

    socialLoginSettingsPage: async ({ page }, use) => {
        const socialLoginSettingsPage = new SocialLoginSettingsPage(page);
        await use(socialLoginSettingsPage);
    }
});

export { expect } from "@playwright/test";