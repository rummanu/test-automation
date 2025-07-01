import { Toggle } from "@enums/toggle";
import { expect, Locator, Page } from "@playwright/test";

export class Switch {
    private readonly page: Page;
    private readonly switch: Locator;

    constructor(page: Page, swicthLocator: Locator) {
        this.page = page;
        this.switch = swicthLocator;
    }

    private async turnOn() {
        if (!await this.switch.isChecked()) {
            await this.switch.locator('+ label').click({ force: true });
            await expect(this.switch).toBeChecked();
        }
    }

    private async turnOff() {
        if (await this.switch.isChecked()) {
            await this.switch.locator('+ label').click({ force: true });
            await expect(this.switch).not.toBeChecked();
        }
    }

    async switchState(toggle: Toggle): Promise<void> {
    if (toggle === Toggle.ON) {
        await this.turnOn();
    } else if (toggle === Toggle.OFF) {
        const dialogPromise = this.page.waitForEvent('dialog', { timeout: 1000 }).then(dialog => dialog.accept());
        await this.turnOff();
        await dialogPromise.catch(() => { /* No dialog appeared, ignore */ });
    }
}
}



