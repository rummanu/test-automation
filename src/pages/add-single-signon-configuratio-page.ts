import { BasePage } from "./base-page";
import { Page, Locator } from "@playwright/test";
import { SinglesignonType } from "@enums/single-signon-type";
import { SingleSignonConfigurationPage } from "./single-signon-configuration-page";
import { Select } from "@components/select";

export class AddSingleSignonConfigurationPage extends SingleSignonConfigurationPage {
    constructor(page: Page) {
        super(page);
    }

    getPageId(): string {
        return "workspace-single-sign-on-configuration";
    }

    getPageUrl(): string {
        return "/a/workspace-admin/security/single-signon/configuration";
    }

    async selectSingleSignonType(type: SinglesignonType): Promise<void> {
        const select = new Select(this.page, 'role=textbox[name="Select Single Signon Type"]');
        await select.selectOption(type);
        await this.page.waitForLoadState('networkidle'); // Ensure the page is fully loaded after selection
    }





}