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

    test('should fail to save changes with html inut', async ({ gdprPage }) => {
        const firstName ='<script>alert("XSS")</script>';
        const lastName = '<script>alert("XSS")</script>';
        const email = '<script>alert("XSS")</script>';
        const fieldError = "HTML tags not allowed.";
        
        await gdprPage.acceptGdpr();
        await gdprPage.fillFirstName(firstName);
        await gdprPage.fillLastName(lastName);
        await gdprPage.fillEmail(email);
        await gdprPage.clickSaveChanges();

        const firstNameInputField = await gdprPage.getFirstnameInputField();
        const lastNameInputField = await gdprPage.getLastnameInputField();
        const emailInputField = await gdprPage.getEmailInputField();

        const hasFirstNameError = await firstNameInputField.hasFieldErrorWith(fieldError);
        expect(hasFirstNameError).toBe(true);

        const hasLastNameError = await lastNameInputField.hasFieldErrorWith(fieldError);
        expect(hasLastNameError).toBe(true);

        const hasEmailError = await emailInputField.hasFieldErrorWith(fieldError);
        expect(hasEmailError).toBe(true);
    });

    test('save gdpr with invalid email should fail', async ({ gdprPage }) => {
        const firstName = faker.word.words(1);
        const lastName = faker.word.words(2);
        const email = faker.word.words(1); // Invalid email
        const fieldError = "Email is invalid.";
        
        await gdprPage.acceptGdpr();
        await gdprPage.fillFirstName(firstName);
        await gdprPage.fillLastName(lastName);
        await gdprPage.fillEmail(email);
        await gdprPage.clickSaveChanges();

        const emailInputField = await gdprPage.getEmailInputField();
        const hasEmailError = await emailInputField.hasFieldErrorWith(fieldError);
        expect(hasEmailError).toBe(true);
    });
});