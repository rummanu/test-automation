import { Page, Locator } from '@playwright/test';
import { SingleSignonConfigurationPage } from '@page/single-signon-configuration-page';

export class EditSingleSignOnConfigurationPage extends SingleSignonConfigurationPage {
    constructor(page: Page) {
        super(page);
    }

    getPageId(): string {
        return "workspace-single-sign-on-edit";
    }

    getPageUrl(): string {
        return "/a/workspace-admin/security/single-signon/edit";
    }
}