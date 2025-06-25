import { test, expect } from "@fixture/page-fixtures";

import { AccessRestrictionPage } from "@page/access-restriction-page";
import { faker } from "@faker-js/faker";

test.describe("Access Restriction Test", (): void => {
    test.use({ storageState: ".auth/workspace-admin.json" });

    async function deleteAllBlacklistedDomains(accessRestrictionPage: AccessRestrictionPage) {
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        const blockedDomainList = await emailBasedAccessControl.getBlockedDomainList();
        const domainsToDelete = await blockedDomainList.getDomainNames();
        for (const domainName of domainsToDelete) {
            const domainObj = await blockedDomainList.findDomainByName(domainName);
            if (domainObj && typeof domainObj.clickDelete === 'function') {
                await domainObj.clickDelete();
            }

        }
    }

    async function deleteAllAutoApprovedDomains(accessRestrictionPage: AccessRestrictionPage) {
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        const autoApprovedList = await emailBasedAccessControl.getAutoApprovedList();
        const domainsToDelete = await autoApprovedList.getDomainNames();
        for (const domainName of domainsToDelete) {
            const domainObj = await autoApprovedList.findDomainByName(domainName);
            if (domainObj && typeof domainObj.clickDelete === 'function') {
                await domainObj.clickDelete();
            }
        }
    }

    async function deleteAllInvitedMembersWhiteList(accessRestrictionPage) {
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        const inviteMembersWhiteList = await emailBasedAccessControl.getInviteMembersWhiteList();
        const domainsToDelete = await inviteMembersWhiteList.getDomainNames();
        for (const domainName of domainsToDelete) {
            const domainObj = await inviteMembersWhiteList.findDomainByName(domainName);
            if (domainObj && typeof domainObj.clickDelete === 'function') {
                await domainObj.clickDelete();
            }
        }
    }

    test("add blocklisted domain with valid domain should succeed", async ({ accessRestrictionPage }) => {
        // Generate a valid random domain with '@'
        const validDomain = "@" + faker.internet.domainName();

        // Navigate to the access restriction page

        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        // Delete all existing blocklisted domains
        await deleteAllBlacklistedDomains(accessRestrictionPage);

        // Get the EmailBasedAccessControl component
        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        // Get the BlockedDomainList component
        const blockedDomainList = await emailBasedAccessControl.getBlockedDomainList();

        // Always re-fetch the count after deletion to ensure accuracy
        const domainCountBefore = await blockedDomainList.getDomainCount();
        expect(domainCountBefore).toBe(0); // Ensure there are no domains before adding

        // Fill the domain name and add it
        await blockedDomainList.fillDomainName(validDomain);
        await blockedDomainList.addDomain();

        // Wait for the domain to appear in the table (robustness for async UI update)
        let domainCountAfter = await blockedDomainList.getDomainCount();
        expect(domainCountAfter).toBe(1); // Ensure one domain is added

        // Verify the domain was added successfully
        const firstDomain = await blockedDomainList.getFirstDomain();
        expect(firstDomain).not.toBeNull();
        if (firstDomain) {
            const name = await firstDomain.getName();
            expect(name).toBe(validDomain);
        }

        await accessRestrictionPage.navigate(); // Navigate again to ensure the page is refreshed
        await deleteAllBlacklistedDomains(accessRestrictionPage);
        //close the browser to clean up after test
        //  await accessRestrictionPage.close();

    });


    test("add blocklisted domain with invalid domain should fail", async ({ accessRestrictionPage }) => {
        // Generate an invalid random domain without '@'
        const invalidDomain = faker.internet.domainName();
        const alertMessage = "Invalid email domain.";

        // Navigate to the access restriction page
        //const accessRestrictionPage = new AccessRestrictionPage(page);
        await accessRestrictionPage.navigate();
        // wait for the page to load

        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        // Delete all existing blocklisted domains
        await deleteAllBlacklistedDomains(accessRestrictionPage);

        // Get the EmailBasedAccessControl component
        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        // Get the BlockedDomainList component
        const blockedDomainList = await emailBasedAccessControl.getBlockedDomainList();

        // Fill the domain name and attempt to add it
        await blockedDomainList.fillDomainName(invalidDomain);
        await blockedDomainList.addDomain();

        // Assert that the alert containing the expected message is present using hasAlertContainingText from BasePage
        const hasAlert = await accessRestrictionPage.hasAlertContainingText(alertMessage);
        expect(hasAlert).toBe(true);
    });

    test("add blocklisted domain with empty domain should fail", async ({ page }) => {
        const alertMessage = "Address mask can not be empty.";
        const emptyDomain = "";

        // Navigate to the access restriction page
        const accessRestrictionPage = new AccessRestrictionPage(page);
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        // Delete all existing blocklisted domains
        await deleteAllBlacklistedDomains(accessRestrictionPage);

        // Get the EmailBasedAccessControl component
        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        // Get the BlockedDomainList component
        const blockedDomainList = await emailBasedAccessControl.getBlockedDomainList();

        // Attempt to add an empty domain
        await blockedDomainList.fillDomainName(emptyDomain);
        await blockedDomainList.addDomain();

        // Assert that the alert containing the expected message is present using hasAlertContainingText from BasePage
        const hasAlert = await accessRestrictionPage.hasAlertContainingText(alertMessage);
        expect(hasAlert).toBe(true);
    });

    test("add blocklisted domain with Html Tag should fail", async ({ page }) => {
        const htmlDomain = "<script>alert('XSS');</script>";

        // Navigate to the access restriction page
        const accessRestrictionPage = new AccessRestrictionPage(page);
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        // Delete all existing blocklisted domains
        await deleteAllBlacklistedDomains(accessRestrictionPage);

        // Get the EmailBasedAccessControl component
        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        // Get the BlockedDomainList component
        const blockedDomainList = await emailBasedAccessControl.getBlockedDomainList();

        // Attempt to add a domain with HTML tags
        await blockedDomainList.fillDomainName(htmlDomain);
        await blockedDomainList.addDomain();

        // Assert that the alert containing the expected message is present using hasAlertContainingText from BasePage
        expect(await accessRestrictionPage.hasHtmlTagsNotAllowedAlert()).toBe(true);
    });

    test("add multiple blocklisted domain should succeed", async ({ page }) => {
        const numberOfDomains = 2; // Number of domains to add
        const domainsToAdd = Array.from({ length: numberOfDomains }, () => "@" + faker.internet.domainName());
        // Navigate to the access restriction page
        const accessRestrictionPage = new AccessRestrictionPage(page);
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();
        // Delete all existing blocklisted domains
        await deleteAllBlacklistedDomains(accessRestrictionPage);
        // Get the EmailBasedAccessControl component
        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        // Get the BlockedDomainList component
        const blockedDomainList = await emailBasedAccessControl.getBlockedDomainList();
        // Always re-fetch the count after deletion to ensure accuracy
        const domainCountBefore = await blockedDomainList.getDomainCount();
        expect(domainCountBefore).toBe(0);

        for (const domain of domainsToAdd) {
            await blockedDomainList.fillDomainName(domain);
            await blockedDomainList.addDomain();
        }

        const domainCountAfter = await blockedDomainList.getDomainCount();
        expect(domainCountAfter).toBe(numberOfDomains);

        await deleteAllBlacklistedDomains(accessRestrictionPage);
    }
    );

    test("should add auto approved domain with valid domain should succeed", async ({ page }) => {
        const validDomain = "@" + faker.internet.domainName();

        const accessRestrictionPage = new AccessRestrictionPage(page);
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        await deleteAllAutoApprovedDomains(accessRestrictionPage);

        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        let autoApprovedList = await emailBasedAccessControl.getAutoApprovedList();

        const domainCountBefore = await autoApprovedList.getDomainCount();
        expect(domainCountBefore).toBe(0);

        await autoApprovedList.fillDomainName(validDomain);
        await autoApprovedList.addDomain();

        autoApprovedList = await emailBasedAccessControl.getAutoApprovedList();

        const firstDomain = await autoApprovedList.getFirstDomain();
        expect(firstDomain).not.toBeNull();
        if (firstDomain) {
            const name = await firstDomain.getName();
            expect(name).toBe(validDomain);
        }

        const domainCountAfter = await autoApprovedList.getDomainCount();
        expect(domainCountAfter).toBe(1); // Ensure one domain is added

        await deleteAllAutoApprovedDomains(accessRestrictionPage);
    });

    test("should add auto approved domain with invalid domain should fail", async ({ page }) => {
        // Generate an invalid random domain without '@'
        const invalidDomain = faker.internet.domainName();
        const alertMessage = "Invalid email domain.";

        // Navigate to the access restriction page
        const accessRestrictionPage = new AccessRestrictionPage(page);
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        // Delete all existing auto approved domains
        await deleteAllAutoApprovedDomains(accessRestrictionPage);

        // Get the EmailBasedAccessControl component
        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        // Get the AutoApprovedList component
        const autoApprovedList = await emailBasedAccessControl.getAutoApprovedList();

        // Fill the domain name and attempt to add it
        await autoApprovedList.fillDomainName(invalidDomain);
        await autoApprovedList.addDomain();

        // Assert that the alert containing the expected message is present using hasAlertContainingText from BasePage
        const hasAlert = await accessRestrictionPage.hasAlertContainingText(alertMessage);
        expect(hasAlert).toBe(true);
    }
    );

    test("should add auto approved domain with empty domain should fail", async ({ page }) => {
        const alertMessage = "Address mask can not be empty.";
        const emptyDomain = "";

        // Navigate to the access restriction page
        const accessRestrictionPage = new AccessRestrictionPage(page);
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        // Delete all existing auto approved domains
        await deleteAllAutoApprovedDomains(accessRestrictionPage);

        // Get the EmailBasedAccessControl component
        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        // Get the AutoApprovedList component
        const autoApprovedList = await emailBasedAccessControl.getAutoApprovedList();

        // Attempt to add an empty domain
        await autoApprovedList.fillDomainName(emptyDomain);
        await autoApprovedList.addDomain();

        // Assert that the alert containing the expected message is present using hasAlertContainingText from BasePage
        const hasAlert = await accessRestrictionPage.hasAlertContainingText(alertMessage);
        expect(hasAlert).toBe(true);
    });

    test("should add auto approved domain with Html Tag should fail", async ({ page }) => {
        const htmlDomain = "<script>alert('XSS');</script>";

        // Navigate to the access restriction page
        const accessRestrictionPage = new AccessRestrictionPage(page);
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        // Delete all existing auto approved domains
        await deleteAllAutoApprovedDomains(accessRestrictionPage);

        // Get the EmailBasedAccessControl component
        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        // Get the AutoApprovedList component
        const autoApprovedList = await emailBasedAccessControl.getAutoApprovedList();

        // Attempt to add a domain with HTML tags
        await autoApprovedList.fillDomainName(htmlDomain);
        await autoApprovedList.addDomain();

        // Assert that the alert containing the expected message is present using hasAlertContainingText from BasePage
        expect(await accessRestrictionPage.hasHtmlTagsNotAllowedAlert()).toBe(true);
    });

    test("should add multiple auto approved domain should succeed", async ({ page }) => {
        const numberOfDomains = 2; // Number of domains to add
        const domainsToAdd = Array.from({ length: numberOfDomains }, () => "@" + faker.internet.domainName());
        // Navigate to the access restriction page
        const accessRestrictionPage = new AccessRestrictionPage(page);
        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();
        // Delete all existing auto approved domains
        await deleteAllAutoApprovedDomains(accessRestrictionPage);
        // Get the EmailBasedAccessControl component
        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        // Get the AutoApprovedList component
        const autoApprovedList = await emailBasedAccessControl.getAutoApprovedList();
        // Always re-fetch the count after deletion to ensure accuracy
        const domainCountBefore = await autoApprovedList.getDomainCount();
        expect(domainCountBefore).toBe(0);

        for (const domain of domainsToAdd) {
            await autoApprovedList.fillDomainName(domain);
            await autoApprovedList.addDomain();
        }

        const domainCountAfter = await autoApprovedList.getDomainCount();
        expect(domainCountAfter).toBe(numberOfDomains);

        await deleteAllAutoApprovedDomains(accessRestrictionPage);
    });

    test('verify invite members switch functionality should succeed', async ({ accessRestrictionPage, workspaceHomePage }) => {
        await accessRestrictionPage.navigate();
        const emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();

        if (await emailBasedAccessControl.isInviteMembersEnabled() === false) {
            await emailBasedAccessControl.enableInviteMembers(true);
        }

        await workspaceHomePage.navigate();

        let userProfileMenu = await workspaceHomePage.getLucidoTopBar().getUserProfileMenu();
        let hasInviteLink = await userProfileMenu.hasInviteMembersLink();
        expect(hasInviteLink).toBe(true);

        await accessRestrictionPage.navigate();
        await emailBasedAccessControl.enableInviteMembers(false);

        await workspaceHomePage.navigate();
        userProfileMenu = await workspaceHomePage.getLucidoTopBar().getUserProfileMenu();
        hasInviteLink = await userProfileMenu.hasInviteMembersLink();
        expect(hasInviteLink).toBe(false);
    });

    test('add domain to auto approved list for invite members with HTML injection should fail', async ({ accessRestrictionPage }) => {
        const domain = "<script>alert('XSS')</script>";

        await accessRestrictionPage.navigate();
        let emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();

        if (await emailBasedAccessControl.isInviteMembersEnabled() === false) {
            await emailBasedAccessControl.enableInviteMembers(true);
        }

        await accessRestrictionPage.navigate();


        emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        const inviteMembersWhitelist = await emailBasedAccessControl.getInviteMembersWhiteList();
        await inviteMembersWhitelist.fillDomainName(domain);
        await inviteMembersWhitelist.addDomain();

        expect(await accessRestrictionPage.hasHtmlTagsNotAllowedAlert()).toBe(true);
    });

    test('add domain to auto approved list for invite members with valid domain should succeed', async ({ accessRestrictionPage }) => {
        const validDomain = "@" + faker.internet.domainName();

        await accessRestrictionPage.navigate();
        let emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();

        if (await emailBasedAccessControl.isInviteMembersEnabled() === false) {
            await emailBasedAccessControl.enableInviteMembers(true);
        }

        await accessRestrictionPage.navigate();
        await deleteAllInvitedMembersWhiteList(accessRestrictionPage);

        emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        const inviteMembersWhitelist = await emailBasedAccessControl.getInviteMembersWhiteList();
        await inviteMembersWhitelist.fillDomainName(validDomain);
        await inviteMembersWhitelist.addDomain();

        const firstDomain = await inviteMembersWhitelist.getFirstDomain();
        expect(firstDomain).not.toBeNull();
        if (firstDomain) {
            const name = await firstDomain.getName();
            expect(name).toBe(validDomain);
        }

        await deleteAllInvitedMembersWhiteList(accessRestrictionPage);
    }
    );

    test('add domain to auto approved list for invite members with invalid domain should fail', async ({ accessRestrictionPage }) => {
        const invalidDomain = faker.internet.domainName();
        const alertMessage = "Invalid email domain.";

        await accessRestrictionPage.navigate();
        let emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();

        if (await emailBasedAccessControl.isInviteMembersEnabled() === false) {
            await emailBasedAccessControl.enableInviteMembers(true);
        }

        emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        const inviteMembersWhitelist = await emailBasedAccessControl.getInviteMembersWhiteList();
        await inviteMembersWhitelist.fillDomainName(invalidDomain);
        await inviteMembersWhitelist.addDomain();

        const hasAlert = await accessRestrictionPage.hasAlertContainingText(alertMessage);
        expect(hasAlert).toBe(true);
    });

    test('add domain to auto approved list for invite members with empty domain should fail', async ({ accessRestrictionPage }) => {
        const alertMessage = "Address mask can not be empty.";
        const emptyDomain = "";

        await accessRestrictionPage.navigate();
        let emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();

        if (await emailBasedAccessControl.isInviteMembersEnabled() === false) {
            await emailBasedAccessControl.enableInviteMembers(true);
        }

        emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        const inviteMembersWhitelist = await emailBasedAccessControl.getInviteMembersWhiteList();
        await inviteMembersWhitelist.fillDomainName(emptyDomain);
        await inviteMembersWhitelist.addDomain();

        const hasAlert = await accessRestrictionPage.hasAlertContainingText(alertMessage);
        expect(hasAlert).toBe(true);
    });

    test('add domain to auto approved list for invite members with multiple domains should succeed', async ({ accessRestrictionPage }) => {
        const numberOfDomains = 2; // Number of domains to add
        const domainsToAdd = Array.from({ length: numberOfDomains }, () => "@" + faker.internet.domainName());

        await accessRestrictionPage.navigate();
        let emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();

        if (await emailBasedAccessControl.isInviteMembersEnabled() === false) {
            await emailBasedAccessControl.enableInviteMembers(true);
        }

        await accessRestrictionPage.navigate();
        await deleteAllInvitedMembersWhiteList(accessRestrictionPage);

        emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        const inviteMembersWhitelist = await emailBasedAccessControl.getInviteMembersWhiteList();

        for (const domain of domainsToAdd) {
            await inviteMembersWhitelist.fillDomainName(domain);
            await inviteMembersWhitelist.addDomain();
        }

        const domainCountAfter = await inviteMembersWhitelist.getDomainCount();
        expect(domainCountAfter).toBe(numberOfDomains);

        await deleteAllInvitedMembersWhiteList(accessRestrictionPage);
    }
    );

    test("add domain to auto approved list for invite members with blocklisted domain should fail", async ({ accessRestrictionPage }) => {
        const blocklistedDomain = "@" + faker.internet.domainName();
        const alertMessage = "Unable to add email domains that are on the Blocklist.";

        await accessRestrictionPage.navigate();
        await deleteAllBlacklistedDomains(accessRestrictionPage);

        let emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        let blockedDomainList = await emailBasedAccessControl.getBlockedDomainList();

        await blockedDomainList.fillDomainName(blocklistedDomain);
        await blockedDomainList.addDomain();

        emailBasedAccessControl = await accessRestrictionPage.getEmailBasedAccessControl();
        if (await emailBasedAccessControl.isInviteMembersEnabled() === false) {
            await emailBasedAccessControl.enableInviteMembers(true);
        }

        const inviteMembersWhiteList = await emailBasedAccessControl.getInviteMembersWhiteList();
        await inviteMembersWhiteList.fillDomainName(blocklistedDomain);
        await inviteMembersWhiteList.addDomain();

        const hasAlert = await accessRestrictionPage.hasAlertContainingText(alertMessage);
        expect(hasAlert).toBe(true);

        await deleteAllBlacklistedDomains(accessRestrictionPage); // Clean up after test
    }
    );

    test("add IP-based access restriction with Html Injection should fail", async ({ accessRestrictionPage }) => {
        const htmlIp = "<script>alert('XSS');</script>";

        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        const ipBasedAccessrestrictionSection = await accessRestrictionPage.getIpBasedAccessRestrictionSection();

        await ipBasedAccessrestrictionSection.fillIpAddress(htmlIp);
        await ipBasedAccessrestrictionSection.clickSaveChanges();

        expect(await accessRestrictionPage.hasHtmlTagsNotAllowedAlert()).toBe(true);
    }
    );

    test("add curse word should succeed", async ({ accessRestrictionPage }) => {
        const sampleWord = faker.lorem.word();
        const emojiString = faker.internet.emoji();

        await accessRestrictionPage.navigate();
        const curseFilteringSection = await accessRestrictionPage.getCurseFilteringSection();

        if (!(await curseFilteringSection.isCurseFilteringEnabled())) {
            await curseFilteringSection.enableCurseFiltering(true);
        }
        await curseFilteringSection.clickSaveChanges();

        await curseFilteringSection.fillKeywords(sampleWord);
        await curseFilteringSection.clickSaveChanges();

        const keywords = await curseFilteringSection.getKeywords();
        expect(keywords).toContain(sampleWord);

        await curseFilteringSection.fillEmoji(emojiString);
        await curseFilteringSection.clickSaveChanges();

        const emojis = await curseFilteringSection.getEmoji();
        expect(emojis).toContain(emojiString);

    });

    test("add curse word with Html Injection should fail", async ({ accessRestrictionPage }) => {
        const htmlWord = "<script>alert('XSS');</script>";

        await accessRestrictionPage.navigate();
        await expect(accessRestrictionPage.isAtPage()).resolves.toBeTruthy();

        const curseFilteringSection = await accessRestrictionPage.getCurseFilteringSection();

        if (!(await curseFilteringSection.isCurseFilteringEnabled())) {
            await curseFilteringSection.enableCurseFiltering(true);
        }

        await curseFilteringSection.fillKeywords(htmlWord);
        await curseFilteringSection.clickSaveChanges();

        expect(await accessRestrictionPage.hasHtmlTagsNotAllowedAlert()).toBe(true);
    });

});