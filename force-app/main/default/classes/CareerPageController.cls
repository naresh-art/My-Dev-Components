public without sharing class CareerPageController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, Phone, Experience__c,Job_Loaction__c, Job_Description__c, Rating FROM Account WHERE Experience__c!=null ORDER BY CreatedDate DESC LIMIT 5];
    }

    @AuraEnabled
    public static Contact createContact(Contact contacts, String accountId) {
        contacts.AccountId = accountId;
        insert contacts;
        return contacts;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getPicklistValues(String objectName, String fieldName) {
        Schema.DescribeFieldResult fieldResult = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get(fieldName).getDescribe();
        List<String> picklistValues = new List<String>();
        for(Schema.PicklistEntry entry : fieldResult.getPicklistValues()) {
            picklistValues.add(entry.getValue());
        }
        return picklistValues;
    }

    @AuraEnabled
    public static void uploadFile(Id jobApplicationId, String fileName, String fileBody) {
        Blob fileBlob = EncodingUtil.base64Decode(fileBody); // Decode Base64 to Blob
        ContentVersion cv = new ContentVersion();
        cv.Title = fileName;
        cv.PathOnClient = fileName;
        cv.VersionData = fileBlob;
        insert cv;

        // Link ContentDocument to the Job Application
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.LinkedEntityId = jobApplicationId;
        cdl.ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id].ContentDocumentId;
        cdl.ShareType = 'I'; // Internal use only
        insert cdl;

        // // Get ContentVersion for sending the file as an email attachment
        // ContentVersion fileContent = [SELECT VersionData FROM ContentVersion WHERE Id = :cv.Id LIMIT 1];
        // sendEmailWithAttachment(fileName, fileContent.VersionData, jobApplicationId);
    }

    // // Method to send email with attachment
    // public static void sendEmailWithAttachment(String fileName, Blob fileBody, Id jobApplicationId) {
    //     // Query Job Application information for the email body
    //     Contact jobApplication = [SELECT Quokka__Email__c, Quokka__FirstName__c, Quokka__LastName__c FROM Contact WHERE Id = :jobApplicationId LIMIT 1];

    //     // Define email addresses
    //     String fromEmail = jobApplication.Quokka__Email__c;  // From the job application email field
    //     String toEmail = 'nareshpunagani316@gmail.com';  // HR email

    //     // Create the email object
    //     Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    //     mail.setToAddresses(new String[] { toEmail });
    //     mail.setReplyTo(fromEmail);
    //     mail.setSenderDisplayName('Career Portal');
    //     mail.setSubject('New Job Application Submitted');
        
    //     // Construct the email body
    //     // String emailBody = 'A new job application has been submitted by ' + jobApplication.Quokka__FirstName__c + ' ' + jobApplication.Quokka__LastName__c + '.\n\n';
    //     // emailBody += 'Please find the attached resume for review.';
    //     // mail.setPlainTextBody(emailBody);

    //     // Construct the HTML email body
    //     String emailBody = '<html>' +
    //                        '<body>' +
    //                        '<p>Dear HR Team,</p>' +
    //                        '<p>A new job application has been submitted by <strong>' + jobApplication.Quokka__FirstName__c + ' ' + jobApplication.Quokka__LastName__c + '</strong>.</p>' +
    //                        '<p>Please find the attached resume for review.</p>' +
    //                        '<p>Best regards,</p>' +
    //                        '<p>The Career Portal Team</p>' +
    //                        '</body>' +
    //                        '</html>';

    //     // Set the email body as HTML
    //     mail.setHtmlBody(emailBody);

    //     // Create the email attachment
    //     Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
    //     attachment.setFileName(fileName);
    //     attachment.setBody(fileBody);
    //     mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attachment });

    //     // Send the email
    //     Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    // }
}

