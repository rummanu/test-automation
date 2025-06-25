import { LoginPage } from "@page/login-page";
import { test as setup } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "node:path";

const envArg = process.env.ENV || 'local';
let envFile = 'credentials.env';
if (envArg === 'stage') envFile = 'credentials.stage.env';
else if (envArg === 'test1') envFile = 'credentials.test1.env';
else if (envArg === 'test2') envFile = 'credentials.test2.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

const workspaceAdminAuthFile = path.join(
    process.cwd(),
    ".auth/workspace-admin.json"
);

setup("authenticate workspace admin user", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
        process.env["MEMBER_MANAGEMENT_WORKSPACE_ADMIN_EMAIL"],
        process.env["MEMBER_MANAGEMENT_WORKSPACE_ADMIN_PASSWORD"]
    );
    await page.waitForLoadState("load");

    await page.context().storageState({ path: workspaceAdminAuthFile });
});


