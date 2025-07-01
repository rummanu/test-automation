import { expect, test } from "@fixture/page-fixtures";
import { GdprPage } from "@page/gdpr-page";
import { faker } from "@faker-js/faker";

test.describe("Gdpr test", (): void => {
    test.use({ storageState: ".auth/workspace-admin.json" });

    test.beforeEach(async ({ gdprPage }) => {
        await gdprPage.navigate();
    });

    test("should accept GDPR and save changes", async ({ gdprPage }) => {
        const firstName = faker.word.words(1);
        const lastName = faker.word.words(2);
        const email = faker.internet.email();
        const country = "Albania";
        
        await gdprPage.acceptGdpr();
        await gdprPage.fillFirstName(firstName);
        await gdprPage.fillLastName(lastName);
        await gdprPage.fillEmail(email);
        await gdprPage.selectCountry(country);
        await gdprPage.clickSaveChanges();

        expect(await gdprPage.hasAlertContainingText(" Success ")).toBeTruthy();

        expect(await gdprPage.getEmail()).toBe(email);
        expect(await gdprPage.getFirstName()).toBe(firstName);
        expect(await gdprPage.getLastName()).toBe(lastName);
        expect(await gdprPage.getCountry()).toBe(country);
    });
});