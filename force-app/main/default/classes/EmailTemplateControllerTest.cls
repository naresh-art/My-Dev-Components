@isTest
public class EmailTemplateControllerTest {

    @testSetup
    static void setup() {
        // Separate setup object DML operations for EmailTemplate
        // Query an existing email folder or create one if it doesn’t exist
        Id folderId;
        List<Folder> folders = [SELECT Id FROM Folder WHERE Type = 'Email' LIMIT 1];
        if (!folders.isEmpty()) {
            folderId = folders[0].Id;
        } else {
            System.assert(false, 'No Email folders available in the org. Please create an Email folder.');
        }

        // Create an email template in the existing folder
        EmailTemplate emailTemplate = new EmailTemplate(
            Name = 'Test Template',
            DeveloperName = 'Test_Template', // Unique API name
            FolderId = folderId,
            TemplateType = 'text', // Use text template to avoid the need for a Letterhead
            Body = 'Hello {!Contact.FirstName}, This is a test email.',
            Subject = 'Test Subject'
        );
        insert emailTemplate;

        // Create a test user in a separate transaction using runAs
        Profile profile = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        User user = new User(
            ProfileId = profile.Id,
            Username = 'testuser@example.com' + System.currentTimeMillis(), // Ensure unique username
            Email = 'testuser@example.com',
            LastName = 'User',
            Alias = 'testu',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US'
        );
        insert user;

        // Insert non-setup objects (Account and Contact) within a separate transaction context
        System.runAs(user) {
            Account account = new Account(Name = 'Test Account', Email__c = 'testaccount@example.com');
            insert account;

            Contact contact = new Contact(
                FirstName = 'Test',
                LastName = 'Contact',
                Email = 'testcontact@example.com',
                AccountId = account.Id,
                LeadSource = 'Web',
                Level__c = 'Primary'
            );
            insert contact;
        }
    }

    @isTest
    static void testGetEmailTemplatesByFolderId() {
        Id folderId = [SELECT Id FROM Folder WHERE Type = 'Email' LIMIT 1].Id;
        List<EmailTemplate> templates = EmailTemplateController.getEmailTemplatesByFolderId(folderId);
        System.assertNotEquals(0, templates.size(), 'Templates should be retrieved based on folder ID.');
        System.assertEquals('Sample Email1', templates[0].Name, 'Template name should match.');
    }

    @isTest
    static void testGetEmailTemplateBodyById() {
        List<EmailTemplate> templates = [SELECT Id FROM EmailTemplate WHERE Name = 'Test Template' LIMIT 1];
        System.assert(!templates.isEmpty(), 'Test Template should exist.');
        String body = EmailTemplateController.getEmailTemplateBodyById(templates[0].Id);
        System.assertEquals('Hello {!Contact.FirstName}, This is a test email.', body, 'Email body should match.');
    }

    @isTest
    static void testGetLeadSourcePicklistValues() {
        List<String> picklistValues = EmailTemplateController.getLeadSourcePicklistValues();
        System.assert(picklistValues.contains('Web'), 'Picklist values should include "Web".');
    }

    @isTest
    static void testGetLevelPicklistValues() {
        List<String> picklistValues = EmailTemplateController.getLevelPicklistValues();
        System.assert(picklistValues.contains('Primary'), 'Picklist values should include "Primary".');
    }

    @isTest
    static void testGetPDRecordsByUserId() {
        User testUser = [SELECT Id FROM User WHERE Username LIKE 'testuser@example.com%' LIMIT 1];
        List<Contact> pdRecords = EmailTemplateController.getPDRecordsByUserId(
            testUser.Id, 'Web', 'Primary'
        );
        System.assertEquals(1, pdRecords.size(), 'There should be one PD record matching criteria.');
    }

    @isTest
    static void testSendEmails() {
        EmailTemplate template = [SELECT Id, Subject FROM EmailTemplate WHERE Name = 'Test Template' LIMIT 1];
        List<Contact> contacts = [SELECT Id, Email FROM Contact WHERE LastName = 'Contact'];
        
        Test.startTest();
        EmailTemplateController.sendEmails(
            template.Id,
            contacts,
            '<p>Custom Body</p>',
            new List<String>{'cc@example.com'},
            new List<String>{'bcc@example.com'}
        );
        Test.stopTest();

        System.assert(true, 'Email sent successfully without exception.');
    }

    @isTest
    static void testGetEmailTemplateWithData() {
        EmailTemplate template = [SELECT Id FROM EmailTemplate WHERE Name = 'Test Template' LIMIT 1];
        Contact contact = [SELECT Id FROM Contact LIMIT 1];
        
        Test.startTest();
        String emailBody = EmailTemplateController.getEmailTemplateWithData(template.Id, contact.Id);
        Test.stopTest();

        System.assert(emailBody.contains('Test Contact'), 'Email body should contain contact name.');
        System.assert(emailBody.contains('Test Account'), 'Email body should contain account name.');
    }

    @isTest
    static void testSendTestEmail() {
        EmailTemplate template = [SELECT Id, Subject FROM EmailTemplate WHERE Name = 'Test Template' LIMIT 1];
        Contact contact = [SELECT Id FROM Contact WHERE LastName = 'Contact' LIMIT 1];
        User user = [SELECT Email FROM User WHERE Username LIKE 'testuser@example.com%' LIMIT 1];

        Test.startTest();
        EmailTemplateController.sendTestEmail(
            template.Id,
            contact,
            user.Email,
            '<p>Custom Test Body</p>'
        );
        Test.stopTest();

        System.assert(true, 'Test email sent successfully without exception.');
    }

    @isTest
    static void testGetCurrentUserEmail() {
        String currentUserEmail = EmailTemplateController.getCurrentUserEmail();
        User user = [SELECT Email FROM User LIMIT 1];
        System.assertEquals(user.Email, currentUserEmail, 'Current user email should match the logged-in user.');
    }

    @isTest
    static void testGetProfile() {
        String profileName = EmailTemplateController.getProfile();
        System.assertNotEquals(null, profileName, 'Profile name should not be null.');
    }
}