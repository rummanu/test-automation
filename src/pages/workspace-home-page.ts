import {BasePage} from "./base-page";
import { Locator, Page } from "@playwright/test";
import { LucidoTopBar } from "@components/lucido-top-bar";

export class WorkspaceHomePage extends BasePage {
    private readonly topBar: Locator;

    constructor(page: Page) {
        super(page);
        this.topBar = this.page.locator("#root .workspace-header");
    }

    getPageId(): string {
        return "workspace-home";
    }

    getPageUrl(): string {
        return "/c";
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.getPageUrl());
    }

    getLucidoTopBar(): LucidoTopBar {
        return new LucidoTopBar(this.topBar, this.page);
    }
}