import { BasePage } from "@page/base-page";
import { Locator, Page } from "@playwright/test";
import { LucidoTopBar } from "@components/lucido-top-bar";
import { BaseMemberManagementPage } from "./base-member-management-page";

export class WorkspaceMemberManagementPage extends BaseMemberManagementPage {
    private readonly topBar: Locator;

    constructor(page: Page) {
        super(page);
        this.topBar = this.page.locator("#root .fixed-top");
    }

    getPageId(): string {
        return "workspace-member-management";
    }

    getPageUrl(): string {
        return "/mm/members";
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.getPageUrl());
    }

    getLucidoTopBar(): LucidoTopBar {
        return new LucidoTopBar(this.topBar, this.page);
    }

    

    async fillEmail(email: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Email Addresses' }).fill(email);
    }

    async clickSubmit(): Promise<void> {
        await this.page.getByRole('button', { name: 'Invite' }).click();
        // Wait for the processing indicator to disappear
        await this.page.waitForSelector('.processing-indicator', { state: 'hidden' });
    }

    async searchMemberByKeyword(keyword: string): Promise<void> {
        await this.page.locator("#search-input").fill(keyword);
        await this.page.locator("#search-button").click();
    }

    async getSuccessAlert(): Promise<Locator> {
        return this.page.getByText('New members have been invited');
    }
    
}
