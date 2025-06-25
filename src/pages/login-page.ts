
import { Page } from "@playwright/test";
import {BasePage} from "@page/base-page";
import {WorkspaceHomePage} from "@page/workspace-home-page";

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    getPageId(): string {
        return "login-page";
    }

    getPageUrl(): string {
        return "/a/workspace/login";
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.getPageUrl());
    }

    async fillEmail(email: string): Promise<void> {
        const emailField = this.page.getByRole("textbox", { name: "Email" });
        await emailField.click();
        await emailField.fill(email);
    }

    async fillPassword(password: string): Promise<void> {
        const passwordField = this.page.getByRole("textbox", { name: "Password" });
        await passwordField.click();
        await passwordField.fill(password);
    }

    async waitForLoginComplete(timeout = 30000): Promise<void> {
        // Wait for URL to change to workspace home page URL
        const workspaceHomePage = new WorkspaceHomePage(this.page);
        const homePageUrl = workspaceHomePage.getPageUrl();

        // Wait for URL to include the workspace home page URL
        await this.page.waitForURL(url => url.pathname.includes(homePageUrl), { timeout });

        // Verify we're on the workspace home page by checking the page ID
        await workspaceHomePage.isAtPage();
    }

    async login(email: string, password: string): Promise<void> {
        await this.acceptCookiesIfVisible();
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.page.getByRole("button", { name: "Log in" }).click();
        await this.waitForLoginComplete();
    }
}
