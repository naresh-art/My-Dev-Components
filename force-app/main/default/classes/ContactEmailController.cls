// public with sharing class ContactEmailController {
//     @AuraEnabled
//     public static void createContactAndSendEmail(String firstName, String lastName, String email) {
//         if (String.isBlank(firstName) || String.isBlank(lastName) || String.isBlank(email)) {
//             throw new AuraHandledException('All fields are required.');
//         }

//         // Create Contact record
//         Contact newContact = new Contact(
//             FirstName = firstName,
//             LastName = lastName,
//             Email = email
//         );
//         insert newContact;

//         // Send email using template
//         sendEmailUsingTemplate(newContact);
//     }

//     private static void sendEmailUsingTemplate(Contact contact) {
//         // Query the email template by Name
//         EmailTemplate emailTemplate = [SELECT Id, Subject, HtmlValue, Body FROM EmailTemplate WHERE Name = 'Sample Email1' LIMIT 1];

//         // Replace merge fields in Subject
//         String emailSubject = emailTemplate.Subject;
//         emailSubject = emailSubject.replace('{!Contact.FirstName}', contact.FirstName)
//                                    .replace('{!Contact.LastName}', contact.LastName);

//         // Replace merge fields in Body (both HTML and Plain Text)
//         String emailBody = emailTemplate.HtmlValue != null ? emailTemplate.HtmlValue : emailTemplate.Body;
//         emailBody = emailBody.replace('{!Contact.FirstName}', contact.FirstName)
//                              .replace('{!Contact.LastName}', contact.LastName);

//         // Send Email
//         Messaging.SingleEmailMessage emailMessage = new Messaging.SingleEmailMessage();
//         emailMessage.setTargetObjectId(contact.Id);
//         emailMessage.setSaveAsActivity(true);
//         emailMessage.setSenderDisplayName('Your Company Name');
//         emailMessage.setSubject(emailSubject);
//         emailMessage.setHtmlBody(emailBody);
//         emailMessage.setToAddresses(new String[]{contact.Email});

//         Messaging.SendEmailResult[] sendResults = Messaging.sendEmail(new Messaging.SingleEmailMessage[]{emailMessage});
//         if (!sendResults[0].isSuccess()) {
//             throw new AuraHandledException('Error sending email: ' + sendResults[0].getErrors()[0].getMessage());
//         }
//     }
// }



// public with sharing class ContactEmailController {
//     @AuraEnabled
//     public static void createContactAndSendEmail(String firstName, String lastName, String email) {
//         if (String.isBlank(firstName) || String.isBlank(lastName) || String.isBlank(email)) {
//             throw new AuraHandledException('All fields are required.');
//         }

//         // Create Contact record
//         Contact newContact = new Contact(
//             FirstName = firstName,
//             LastName = lastName,
//             Email = email
//         );
//         insert newContact;

//         // Send email using template
//         sendEmailUsingTemplate(newContact);
//     }

//     private static void sendEmailUsingTemplate(Contact contact) {
//         // Query Email Template by Name
//         EmailTemplate emailTemplate = [SELECT Id,HtmlValue FROM EmailTemplate WHERE Name = 'Sample Email1' LIMIT 1];

//         if (emailTemplate == null) {
//             throw new AuraHandledException('Email template not found.');
//         }

//         // Prepare Email
//         Messaging.SingleEmailMessage emailMessage = new Messaging.SingleEmailMessage();
//         emailMessage.setTargetObjectId(contact.Id); // Automatically merges fields
//         emailMessage.setTemplateId(emailTemplate.Id); // Uses the template
//         emailMessage.setSaveAsActivity(true);
//         emailMessage.setUseSignature(true); // Ensures Salesforce signatures are included
//         emailMessage.setBccSender(false);
//         emailMessage.setToAddresses(new String[]{contact.Email});
//         emailMessage.setOrgWideEmailAddressId(getOrgWideEmailAddress()); // Ensures images work

//         // Replace merge fields in Body (both HTML and Plain Text)
//         String emailBody = emailTemplate.HtmlValue != null ? emailTemplate.HtmlValue : emailTemplate.Body;
//         emailBody = emailBody.replace('{!Contact.FirstName}', contact.LastName)
//                                 .replace('{!Contact.LastName}', contact.LastName);
//         emailMessage.setHtmlBody(emailBody);
//         // Send Email
//         Messaging.SendEmailResult[] sendResults = Messaging.sendEmail(new Messaging.SingleEmailMessage[]{emailMessage});
//         if (!sendResults[0].isSuccess()) {
//             throw new AuraHandledException('Error sending email: ' + sendResults[0].getErrors()[0].getMessage());
//         }
//     }

//     private static Id getOrgWideEmailAddress() {
//         OrgWideEmailAddress[] orgWideEmails = [SELECT Id FROM OrgWideEmailAddress LIMIT 1];
//         return orgWideEmails.isEmpty() ? null : orgWideEmails[0].Id;
//     }
// }


public with sharing class ContactEmailController {
    @AuraEnabled
    public static void createContactAndSendEmail(String firstName, String lastName, String email) {
        if (String.isBlank(firstName) || String.isBlank(lastName) || String.isBlank(email)) {
            throw new AuraHandledException('All fields are required.');
        }

        // Create Contact record
        Contact newContact = new Contact(
            FirstName = firstName,
            LastName = lastName,
            Email = email
        );
        insert newContact;

        // Send email using template
        sendEmailUsingTemplate(newContact);
    }

    private static void sendEmailUsingTemplate(Contact contact) {
        // Query Email Template by Name
        EmailTemplate emailTemplate = [SELECT Id,HtmlValue FROM EmailTemplate WHERE Name = 'Test Lightning Template' LIMIT 1];

        if (emailTemplate == null) {
            throw new AuraHandledException('Email template not found.');
        }

        // Prepare Email
        Messaging.SingleEmailMessage emailMessage = new Messaging.SingleEmailMessage();
        emailMessage.setTargetObjectId(contact.Id); // Automatically merges fields
        emailMessage.setTemplateId(emailTemplate.Id); // Uses the template
        emailMessage.setSaveAsActivity(true);
        emailMessage.setUseSignature(true); // Ensures Salesforce signatures are included
        emailMessage.setBccSender(false);
        emailMessage.setToAddresses(new String[]{contact.Email});
        emailMessage.setOrgWideEmailAddressId(getOrgWideEmailAddress()); // Ensures images work

        // Replace merge fields in Body (both HTML and Plain Text)
        String emailBody = emailTemplate.HtmlValue != null ? emailTemplate.HtmlValue : emailTemplate.Body;
        emailBody = emailBody.replace('{{{Contact.FirstName}}}', contact.LastName)
                                .replace('{{{Contact.LastName}}}', contact.LastName);
        emailMessage.setHtmlBody(emailBody);
        // Send Email
        Messaging.SendEmailResult[] sendResults = Messaging.sendEmail(new Messaging.SingleEmailMessage[]{emailMessage});
        if (!sendResults[0].isSuccess()) {
            throw new AuraHandledException('Error sending email: ' + sendResults[0].getErrors()[0].getMessage());
        }
    }

    private static Id getOrgWideEmailAddress() {
        OrgWideEmailAddress[] orgWideEmails = [SELECT Id FROM OrgWideEmailAddress LIMIT 1];
        return orgWideEmails.isEmpty() ? null : orgWideEmails[0].Id;
    }
}
