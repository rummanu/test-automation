import { Page, Locator } from '@playwright/test';

export class CurseFiltering {
    private readonly page: Page;
    private readonly curseFiltering: Locator;

    constructor(page: Page, curseFilteringLocator: Locator) {
        this.page = page;
        this.curseFiltering = curseFilteringLocator;
    }

    async enableCurseFiltering(enable: boolean): Promise<void> {
        await this.page.locator('label[for="enable-curse-filtering"]').click();
    }

    async isCurseFilteringEnabled(): Promise<boolean> {
        const switchLocator = this.curseFiltering.locator('i');
        return await switchLocator.isChecked();
    }

    async clickSaveChanges(): Promise<void> {
        await this.curseFiltering.locator("[data-test-element-id='curse-filtering-save-changes']").click();
        // Wait for the save action to complete, e.g., by waiting for a success message or the page to reload
        await this.page.waitForTimeout(1000); 
    }

    async fillKeywords(keywords: string): Promise<void> {
        const keywordsInput = this.curseFiltering.locator('textarea[name="auto-moderation-keywords"]');
        await keywordsInput.fill(keywords);
    }

    async getKeywords(): Promise<string> {
        const keywordsInput = this.curseFiltering.locator('textarea[name="auto-moderation-keywords"]');
        return await keywordsInput.inputValue();
    }

    async fillEmoji(emoji: string): Promise<void> {
        const emojisInput = this.curseFiltering.locator('#enable-emoji-curse-filtering');
        await emojisInput.fill(emoji);
    }

    async getEmoji(): Promise<string> {
        const emojisInput = this.curseFiltering.locator('#enable-emoji-curse-filtering');
        return await emojisInput.inputValue();
    }

    async getEmojiStringAtIndex(index: number): Promise<string> {
        const emojisInput = this.curseFiltering.locator('#enable-emoji-curse-filtering');
        const emojisValue = await emojisInput.inputValue();
        const emojisArray = emojisValue.split(',').map(emoji => emoji.trim());
        return emojisArray[index] || '';
    }
}