import { WorkspaceMemberManagementPage } from "@page/workspace-member-management-page";
import { WorkspaceHomePage } from "@page/workspace-home-page";
import { LoginPage } from "@page/login-page";
import { test as base } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";
import { AccessRestrictionPage } from "@page/access-restriction-page";

const envArg = process.env.ENV || 'local';
let envFile = 'credentials.env';
if (envArg === 'stage') envFile = 'credentials.stage.env';
else if (envArg === 'test1') envFile = 'credentials.test1.env';
else if (envArg === 'test2') envFile = 'credentials.test2.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

type PageFixtures = {
    workspaceMemberManagementPage: WorkspaceMemberManagementPage;
    workspaceHomePage: WorkspaceHomePage;
    loginPage: LoginPage;
    accessRestrictionPage: AccessRestrictionPage;
};

export const test = base.extend<PageFixtures>({

    workspaceMemberManagementPage: async ({ page }, use) => {
        const workspaceMemberManagementPage = new WorkspaceMemberManagementPage(page);
        await use(workspaceMemberManagementPage);
    },

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
});




export { expect } from "@playwright/test";
