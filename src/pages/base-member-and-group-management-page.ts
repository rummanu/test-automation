import { AdvancedSearch } from "@components/advanced-search";
import { BasePage } from "@page/base-page";
import { Locator, Page } from "@playwright/test";

export abstract class BaseMemberAndGroupManagementPage extends BasePage {
    
    protected constructor(page: Page) {
        super(page);
      }

      async getAdvancedSearch (): Promise<AdvancedSearch> {
        return this.page.locator(".advance-search-box");
         
}
}