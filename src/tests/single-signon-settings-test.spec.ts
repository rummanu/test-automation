import { test, expect } from '@fixture/page-fixtures';
import { SingleSignOnSettingsPage } from '@page/single-signon-settings-page';
import { Toggle } from '@enums/toggle';
import { SinglesignonType } from '@enums/single-signon-type';
import { faker } from '@faker-js/faker';

test.describe("Single SignOn Settings Test", (): void => {
    test.use({ storageState: ".auth/workspace-admin.json" });
    let singleSignOnSettingsPage: SingleSignOnSettingsPage;

    test.beforeEach(async ({ page }) => {
        singleSignOnSettingsPage = new SingleSignOnSettingsPage(page);
        await singleSignOnSettingsPage.navigate();
    });

    async function deleteAllSingleSignonConfigurations() {
        if ((await (await singleSignOnSettingsPage.getSingleSignonConfigurations()).count()) > 0) {
            const configurations = await singleSignOnSettingsPage.getAllSingleSignonConfigurationNames();
            for (const configName of configurations) {
                const config = await singleSignOnSettingsPage.getSingleSignonConfigurationByName(configName);
                await config.delete();
            }
        }
    }

    test('should toggle Single Sign-On settings', async () => {
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);
        expect(await singleSignOnSettingsPage.hasSingleSignonConfigurationButton()).toBeTruthy();

        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
        expect(await singleSignOnSettingsPage.hasSingleSignonConfigurationButton()).toBeFalsy();

    });

    test('Add GoogleApps domain should fail with html injection', async () => {
        const domainName = '<script>alert("XSS")</script>';
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_GOOGLEAPPS);
        await addSingleSignonConfigurationPage.fillGoogleAppsDomainName(domainName);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        expect(await singleSignOnSettingsPage.hasHtmlTagsNotAllowedAlert()).toBe(true);

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);

    });

    test('Add GoogleApps domain should succeed with valid domain', async () => {
        const domainName = faker.internet.domainName();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_GOOGLEAPPS);
        await addSingleSignonConfigurationPage.fillGoogleAppsDomainName(domainName);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const ssoConfig = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_GOOGLE);
        expect(ssoConfig).not.toBeNull();

        const lastConfiguration = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_GOOGLE);
        const savedDomainName = await lastConfiguration.getEntityName();
        expect(savedDomainName).toBe(domainName);

        const lastConfig = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_GOOGLE);
        await lastConfig.delete();

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    });

    test("update GoogleApps domain should succeed with valid domain", async () => {
        const domainName = faker.internet.domainName();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);

        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_GOOGLEAPPS);
        await addSingleSignonConfigurationPage.fillGoogleAppsDomainName(domainName);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const ssoConfig = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_GOOGLE);
        expect(ssoConfig).not.toBeNull();

        const lastConfiguration = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_GOOGLE);
        const savedDomainName = await lastConfiguration.getEntityName();
        expect(savedDomainName).toBe(domainName);

        await lastConfiguration.clickEdit();
        await addSingleSignonConfigurationPage.fillGoogleAppsDomainName(domainName);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const updatedDomainName = await lastConfiguration.getEntityName();
        expect(updatedDomainName).toBe(domainName);

        await deleteAllSingleSignonConfigurations();

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    });

    test('add GoogleApps domain should fail with empty domain', async () => {
        const domainName = '';
        const alertMessage = 'Required Fields Missing';
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_GOOGLEAPPS);
        await addSingleSignonConfigurationPage.fillGoogleAppsDomainName('');
        await addSingleSignonConfigurationPage.clickSaveChanges();

        expect(await singleSignOnSettingsPage.hasAlertContainingText(alertMessage)).toBe(true);

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    }
    );

    test('add GoogleApps domain should fail with invalid domain', async () => {
        const domainName = faker.word.words(1);
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_GOOGLEAPPS);
        await addSingleSignonConfigurationPage.fillGoogleAppsDomainName(domainName);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const domainNameField = await addSingleSignonConfigurationPage.getGoogleAppsDomainNameField();
        const hasError = await domainNameField.hasFieldErrorWith("Google Apps domain name is invalid");
        expect(hasError).toBe(true);

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    }
    );

    test('add GoogleApps domain should fail with invalid email', async () => {
        const domainName = faker.internet.domainName();
        const email = faker.word.words(1);
        const fieldError = "Invalid Email address. Please check the format of your email.";

        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_GOOGLEAPPS);
        await addSingleSignonConfigurationPage.fillGoogleAppsDomainName(domainName);
        await addSingleSignonConfigurationPage.fillAdminEmail(email);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const emailField = await addSingleSignonConfigurationPage.getAdminEmailField();
        const hasError = await emailField.hasFieldErrorWith(fieldError);
        expect(hasError).toBe(true);

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    }
    );

    test('add GoogleApps domain should fail with invalid blocklisted domain', async () => {
        const domainName = faker.internet.domainName();
        const blockedDomains = faker.word.words(1);
        const fieldError = "invalid email domain:";

        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_GOOGLEAPPS);
        await addSingleSignonConfigurationPage.fillGoogleAppsDomainName(domainName);
        await addSingleSignonConfigurationPage.fillBlockedDomains(blockedDomains);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const blockedDomainsField = await addSingleSignonConfigurationPage.getBlockedDomainsField();
        const hasErrorText = await blockedDomainsField.hasFieldErrorWith(fieldError);
        expect(hasErrorText).toBe(true);

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    });

    test('create multipass token should succeed', async () => {
        const displayName = faker.word.words(2);
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);
        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_MULTIPASS_TOKEN);
        await addSingleSignonConfigurationPage.fillDisplayName(displayName);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const ssoConfig = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_MULTIPASS);
        expect(ssoConfig).not.toBeNull();

        const lastConfiguration = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_MULTIPASS);
        const name = await lastConfiguration.getName();
        expect(name).toBe(displayName);

        await deleteAllSingleSignonConfigurations();

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    });

    test('create multipass token should fail with empty display name', async () => {
        const displayName = '';
        const alertMessage = ' Required Fields Missing ';
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);

        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_MULTIPASS_TOKEN);
        await addSingleSignonConfigurationPage.fillDisplayName(displayName);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        expect(await singleSignOnSettingsPage.hasAlertContainingText(alertMessage)).toBe(true);

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    });

    test('create multipass token should fail with html injection in display name', async () => {
        const displayName = '<script>alert("XSS")</script>';
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);

        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_MULTIPASS_TOKEN);
        await addSingleSignonConfigurationPage.fillDisplayName(displayName);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        expect(await singleSignOnSettingsPage.hasHtmlTagsNotAllowedAlert()).toBe(true);

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    });

    test('create SAML configuration should succeed', async () => {
        const displayNmae = faker.word.words(2);
        const entityId = faker.word.words(1);
        const metadata = faker.lorem.paragraphs(1);

        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);
        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_SAML_2);
        await addSingleSignonConfigurationPage.fillDisplayName(displayNmae);
        await addSingleSignonConfigurationPage.fillEntityId(entityId);
        await addSingleSignonConfigurationPage.fillMetaData(metadata);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const ssoConfig = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_SAML);
        expect(ssoConfig).not.toBeNull();

        const lastConfiguration = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_SAML);
        const savedEntityId = await lastConfiguration.getEntityName();
        expect(savedEntityId).toBe(entityId);

        await deleteAllSingleSignonConfigurations();

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    });

    test('make sso configuartation default should succeed', async () => {

        const domainName = faker.lorem.word(5) + '.com';
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);
        await deleteAllSingleSignonConfigurations();

        const singleSignonConfiguratinsBefore = await (await singleSignOnSettingsPage.getSingleSignonConfigurations()).count();

        if (singleSignonConfiguratinsBefore < 2) {
            // Create enough configurations to ensure there are at least two
            for (let i = singleSignonConfiguratinsBefore; i < 2; i++) {
                const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
                await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_GOOGLEAPPS);
                await addSingleSignonConfigurationPage.fillGoogleAppsDomainName(domainName);
                await addSingleSignonConfigurationPage.clickSaveChanges();
            }
        }
        const singleSignonConfiguratinsAfter = await (await singleSignOnSettingsPage.getSingleSignonConfigurations()).count();
        expect(singleSignonConfiguratinsAfter).toBeGreaterThanOrEqual(2);

        // Use the new method to get a config where Make Default is enabled
        const configToMakeDefault = await singleSignOnSettingsPage.getFirstConfigWithMakeDefaultEnabled();
        expect(configToMakeDefault).not.toBeNull();
        await configToMakeDefault!.clickMakeDefault();

        expect(await configToMakeDefault!.isMakeDefaultDisabled()).toBeTruthy();

        await deleteAllSingleSignonConfigurations();

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    });

    test('should fail to create SAML configuration with html injection', async () => {
        const displayName = '<script>alert("XSS")</script>';
        const entityId = '<script>alert("XSS")</script>';
        const metadata = '<script>alert("XSS")</script>';

        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);
        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_SAML_2);
        await addSingleSignonConfigurationPage.fillDisplayName(displayName);
        await addSingleSignonConfigurationPage.fillEntityId(entityId);
        await addSingleSignonConfigurationPage.fillMetaData(metadata);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        expect(await singleSignOnSettingsPage.hasHtmlTagsNotAllowedAlert()).toBe(true);

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    }
    );

    test('should succeed to create map attributes', async () => {
        const displayName = faker.word.words(2);
        const email = faker.internet.email();
        const username = faker.word.words(1);
        const avatar = faker.image.avatar();
        const groups = faker.word.words(2);
        const entityId = faker.word.words(1);
        const metadata = faker.lorem.paragraphs(1);

        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);
        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_SAML_2);
        await addSingleSignonConfigurationPage.fillDisplayName(displayName);
        await addSingleSignonConfigurationPage.fillEntityId(entityId);
        await addSingleSignonConfigurationPage.fillMetaData(metadata);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const ssoConfig = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_SAML);
        expect(ssoConfig).not.toBeNull();

        const mapAttributesPage = await ssoConfig.clickMapAttributes();
        await mapAttributesPage.fillDisplayName(displayName);
        await mapAttributesPage.fillEmail(email);
        await mapAttributesPage.fillAvatar(avatar);
        await mapAttributesPage.fillLanguage(username);
        await mapAttributesPage.fillLang(username);
        await mapAttributesPage.fillGroups(groups);
        await mapAttributesPage.fillPreferredLanguage(username);
        await mapAttributesPage.clickSaveChanges();

        expect(await mapAttributesPage.hasAlertContainingText(' IdeaScale single sign-on attribute mapping saved ')).toBe(true);
        await deleteAllSingleSignonConfigurations();

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    }
    );

    test('should fail to create map attributes with html injection', async () => {
        const attributeName = '<script>alert("XSS")</script>';
        const email = '<script>alert("XSS")</script>';
        const username = '<script>alert("XSS")</script>';
        const avatar = '<script>alert("XSS")</script>';
        const groups = '<script>alert("XSS")</script>';
        const displayName = faker.word.words(2);
        const entityId = faker.word.words(1);
        const metadata = faker.lorem.paragraphs(1);

        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);
        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_SAML_2);
        await addSingleSignonConfigurationPage.fillDisplayName(displayName);
        await addSingleSignonConfigurationPage.fillEntityId(entityId);
        await addSingleSignonConfigurationPage.fillMetaData(metadata);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const ssoConfig = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_SAML);
        expect(ssoConfig).not.toBeNull();

        const mapAttributesPage = await ssoConfig.clickMapAttributes();
        await mapAttributesPage.fillDisplayName(attributeName);
        await mapAttributesPage.fillEmail(email);
        await mapAttributesPage.fillAvatar(avatar);
        await mapAttributesPage.fillLanguage(username);
        await mapAttributesPage.fillLang(username);
        await mapAttributesPage.fillGroups(groups);
        await mapAttributesPage.fillPreferredLanguage(username);
        await mapAttributesPage.clickSaveChanges();

        expect(await singleSignOnSettingsPage.hasHtmlTagsNotAllowedAlert()).toBe(true);

        await deleteAllSingleSignonConfigurations();

        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    });

    test('should create login condition attributes with any mathing rule', async ({ page }) => {
        const displayName = faker.word.words(2);
        const entityId = faker.word.words(1);
        const metadata = faker.lorem.paragraphs(1);
        const attributeName = faker.word.words(1);
        const attributeValue = faker.word.words(1);

        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);
        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_SAML_2);
        await addSingleSignonConfigurationPage.fillDisplayName(displayName);
        await addSingleSignonConfigurationPage.fillEntityId(entityId);
        await addSingleSignonConfigurationPage.fillMetaData(metadata);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const ssoConfig = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_SAML);
        expect(ssoConfig).not.toBeNull();

        const loginConditionAttributePage = await ssoConfig.clickLoginConditionAttribute();
        await loginConditionAttributePage.fillAttributeName(attributeName);
        await loginConditionAttributePage.fillAttributeValue(attributeValue);
        await loginConditionAttributePage.clickAdd();

        expect(await loginConditionAttributePage.isAttributeMapingTableVisible()).toBe(true);

        await loginConditionAttributePage.clickSaveChanges();
        expect(await loginConditionAttributePage.hasAlertContainingText(' Matching rules set ')).toBe(true);

        await deleteAllSingleSignonConfigurations();
        await singleSignOnSettingsPage.navigate();
        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.OFF);
    });

    test('should delete login condition attributes', async ({ page }) => {
        const displayName = faker.word.words(2);
        const entityId = faker.word.words(1);
        const metadata = faker.lorem.paragraphs(1);
        const attributeName = faker.word.words(1);
        const attributeValue = faker.word.words(1);

        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);
        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_SAML_2);
        await addSingleSignonConfigurationPage.fillDisplayName(displayName);
        await addSingleSignonConfigurationPage.fillEntityId(entityId);
        await addSingleSignonConfigurationPage.fillMetaData(metadata);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const ssoConfig = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_SAML);
        expect(ssoConfig).not.toBeNull();

        const loginConditionAttributePage = await ssoConfig.clickLoginConditionAttribute();
        await loginConditionAttributePage.fillAttributeName(attributeName);
        await loginConditionAttributePage.fillAttributeValue(attributeValue);
        await loginConditionAttributePage.clickAdd();

        expect(await loginConditionAttributePage.isAttributeMapingTableVisible()).toBe(true);
        expect(await loginConditionAttributePage.getAttributeName()).toBe(attributeName);
        expect(await loginConditionAttributePage.getAttributeValue()).toBe(attributeValue);

        const firstAttributeRow = await loginConditionAttributePage.getFirstAttributeMappingRow();
        await firstAttributeRow.clickDelete();
        expect(await loginConditionAttributePage.isAttributeMapingTableVisible()).toBe(false);
    });

    test('craete login condition attributes setting all matches rule', async ({ page }) => {
        const displayName = faker.word.words(2);
        const entityId = faker.word.words(1);
        const metadata = faker.lorem.paragraphs(1);
        const attributeName = faker.word.words(1);
        const attributeValue = faker.word.words(1);

        await singleSignOnSettingsPage.toggleSingleSignonSettings(Toggle.ON);
        await deleteAllSingleSignonConfigurations();

        const addSingleSignonConfigurationPage = await singleSignOnSettingsPage.clickAddNew();
        await addSingleSignonConfigurationPage.selectSingleSignonType(SinglesignonType.SSO_SAML_2);
        await addSingleSignonConfigurationPage.fillDisplayName(displayName);
        await addSingleSignonConfigurationPage.fillEntityId(entityId);
        await addSingleSignonConfigurationPage.fillMetaData(metadata);
        await addSingleSignonConfigurationPage.clickSaveChanges();

        const ssoConfig = await singleSignOnSettingsPage.getSsoConfigBySsoType(SinglesignonType.SSO_SAML);
        expect(ssoConfig).not.toBeNull();

        const loginConditionAttributePage = await ssoConfig.clickLoginConditionAttribute();
        await loginConditionAttributePage.fillAttributeName(attributeName);
        await loginConditionAttributePage.fillAttributeValue(attributeValue);
        await loginConditionAttributePage.clickAdd();

        expect(await loginConditionAttributePage.isAttributeMapingTableVisible()).toBe(true);
        expect(await loginConditionAttributePage.getAttributeName()).toBe(attributeName);
        expect(await loginConditionAttributePage.getAttributeValue()).toBe(attributeValue);

        loginConditionAttributePage.setAllMatchRules();
        await loginConditionAttributePage.clickSaveChanges();

        expect(await loginConditionAttributePage.hasAlertContainingText(' Matching rules set ')).toBe(true);

    }
    );
});