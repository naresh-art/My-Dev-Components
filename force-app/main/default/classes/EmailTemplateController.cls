public with sharing class EmailTemplateController {

    // Get email templates based on folder Id
    @AuraEnabled(cacheable=true)
    public static List<EmailTemplate> getEmailTemplatesByFolderId(String folderId) {
        try {
            return [SELECT Id, Name, Body FROM EmailTemplate WHERE FolderId = :folderId];
        } catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    // Get body of the email template by template Id
    @AuraEnabled(cacheable=true)
    public static String getEmailTemplateBodyById(String templateId) {
        try {
            EmailTemplate template = [SELECT Body FROM EmailTemplate WHERE Id = :templateId LIMIT 1];
            return template.Body;
        } catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    /**
    * Retrieves picklist values for a specific field.
    * @param field The field for which to retrieve picklist values.
    * @return List of picklist values as strings.
    */
    public static List<String> getPicklistValues(Schema.sObjectField field) {
        List<String> picklistValues = new List<String>();
        Schema.DescribeFieldResult fieldResult = field.getDescribe();
        List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry entry : values) {
            picklistValues.add(entry.getLabel());
        }
        return picklistValues;
    }

    /**
    * Retrieves the picklist values for the 'Role__c' field on the Contact object.
    * @return List of picklist values as strings.
    */
    @AuraEnabled(cacheable=true)
    public static List<String> getLeadSourcePicklistValues() {
        return getPicklistValues(Contact.LeadSource);
    }

    /**
    * Retrieves the picklist values for the 'Role__c' field on the Contact object.
    * @return List of picklist values as strings.
    */
    @AuraEnabled(cacheable=true)
    public static List<String> getLevelPicklistValues() {
        return getPicklistValues(Contact.Level__c);
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getPDRecordsByUserId(String userId, String leadSource, String genderIdentity) {
        try {
            String finalLeadSource = String.isBlank(leadSource) ? null : leadSource; //'Web'
            String finalGenderIdentity = String.isBlank(genderIdentity) ? null : genderIdentity;
    
            String query = 'SELECT Id, FirstName, LastName, Email, Phone, AccountId, Account.Name, Account.Email__c, ' + 
                           'OwnerId, LeadSource, GenderIdentity, Level__c FROM Contact WHERE OwnerId = :userId AND Account.Email__c != null';
                           
            if (finalLeadSource != null) {
                query += ' AND LeadSource = :finalLeadSource';
            }
            if (finalGenderIdentity != null) {
                query += ' AND Level__c = :finalGenderIdentity';
            }
    
            return Database.query(query);
        } catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static void sendEmails(String templateId, List<Contact> conRecords, String customBody,
                                List<String> ccAddresses, List<String> bccAddresses) {
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        try {
            // Retrieve the email template
            EmailTemplate template = [SELECT Id, Subject FROM EmailTemplate WHERE Id = :templateId LIMIT 1];

            // List to store email attachments
            List<Messaging.EmailFileAttachment> emailAttachments = getEmailAttachments(templateId);
            System.debug('emailAttachments out Loop::'+emailAttachments);
            for (Contact conRecordObj : conRecords) {
                if (String.isBlank(conRecordObj.Email)) {
                    throw new AuraHandledException('Contact email is missing for PD Record: ' + conRecordObj.Name);
                }
                Contact conRecord =  [SELECT id, Name, firstName, lastName, Email, Phone, AccountId, Account.Name,Account.Email__c, OwnerId, 
                                    Owner.Name, Owner.Email, Owner.Phone FROM Contact WHERE Id = :conRecordObj.Id LIMIT 1];         
                Account accList = [SELECT Id, Name, Email__C FROM Account WHERE Id = :conRecord.AccountId LIMIT 1];
                String personalizedCustomBody = customBody;
                personalizedCustomBody = personalizedCustomBody.replace('{!Contact.Name}', conRecord.Name != null ? conRecord.Name : '')
                                        .replace('{!Account.Name}', accList.Name != null ? accList.Name : '');

                // Create an email message using the email template
                Messaging.SingleEmailMessage emailMessage = new Messaging.SingleEmailMessage();
                emailMessage.setToAddresses(new String[] {accList.Email__c});
                emailMessage.setTemplateId(templateId); // Use the provided email template ID
                
                // Set the target contact (to merge the {!Contact} fields)
                // emailMessage.setTargetObjectId(accList.Id);
                emailMessage.setTargetObjectId(conRecord.Id);

                // Set the "WhatId" as the PD Record (to merge the {!Professional_Development__c} fields)
                // emailMessage.setWhatId(conRecord.Id);

                emailMessage.setHtmlBody(personalizedCustomBody); // Set custom-designed email body
                emailMessage.setSubject(template.Subject); // Set subject from template
                
                // Ensure the email is saved as an activity
                emailMessage.setSaveAsActivity(true);


                 // Attach files if any are found
            if (!emailAttachments.isEmpty()) {
                emailMessage.setFileAttachments(emailAttachments);
            }
            System.debug('ccAddresses befoe if::'+ccAddresses);
            // Set CC and BCC addresses
            if (!ccAddresses.isEmpty()) {
                System.debug('ccAddresses in if::'+ccAddresses);
                emailMessage.setCcAddresses(ccAddresses);
            }
            if (!bccAddresses.isEmpty()) {
                emailMessage.setBccAddresses(bccAddresses);
            }

                emails.add(emailMessage);
            }

            if (!emails.isEmpty()) {
                Messaging.sendEmail(emails);
            } else {
                throw new AuraHandledException('No emails to send.');
            }

        } catch (EmailException e) {
            throw new AuraHandledException('Error sending email: ' + e.getMessage());
        } catch (Exception e) {
            throw new AuraHandledException('General error: ' + e.getMessage());
        }
    }

    // Get full email template including HTML with PD Record details for preview
    // @AuraEnabled(cacheable=true)
    // public static String getEmailTemplateWithData(String templateId, Id conRecordId) {
    //     try {
    //         // Query the email template
    //         EmailTemplate template = [SELECT Body, HtmlValue FROM EmailTemplate WHERE Id = :templateId LIMIT 1];
    //         Contact conRecord =  [SELECT id, Name, firstName, lastName, Email, Phone, AccountId, Account.Name,Account.Email__c, OwnerId, 
    //                                                 Owner.Name, Owner.Email, Owner.Phone FROM Contact WHERE Id = :conRecordId LIMIT 1];
            
    //         Account accList = [SELECT Id, Name, Email__C FROM Account WHERE Id = :conRecord.AccountId LIMIT 1];

    //         // Initialize the email body with the template's HTML content
    //         String emailBody = template.HtmlValue;

    //         // Safely replace placeholders with actual data or empty strings if null
    //         emailBody = emailBody.replace('{!Contact.Name}', conRecord.Name != null ? conRecord.Name : '')
    //                             .replace('{!Account.Name}', accList.Name != null ? accList.Name : '');

    //         System.debug('emailBody with letterhead Details::' + emailBody);
    //         return emailBody;

    //     } catch (Exception ex) {
    //         throw new AuraHandledException('Error processing email template with PD record data: ' + ex.getMessage());
    //     }
    // }

    @AuraEnabled(cacheable=true)
    public static String getEmailTemplateWithData(String templateId) {
        try {
            // Query the email template
            EmailTemplate template = [SELECT Body, HtmlValue FROM EmailTemplate WHERE Id = :templateId LIMIT 1];
            String emailBody = template.HtmlValue;
            return emailBody;

        } catch (Exception ex) {
            throw new AuraHandledException('Error processing email template with PD record data: ' + ex.getMessage());
        }
    }


    @AuraEnabled
    public static void sendTestEmail(String templateId, Contact conRecord, String userEmail, String customBody) {
        try {

            // Retrieve the email template
            EmailTemplate template = [SELECT Id, Subject FROM EmailTemplate WHERE Id = :templateId LIMIT 1];

            // List to store email attachments
            List<Messaging.EmailFileAttachment> emailAttachments = getEmailAttachments(templateId);

            Contact conRecordDetails =  [SELECT id, Name, firstName, lastName, Email, Phone, AccountId, Account.Name,Account.Email__c, OwnerId, 
                                Owner.Name, Owner.Email, Owner.Phone FROM Contact WHERE Id = :conRecord.Id LIMIT 1];         
            Account accList = [SELECT Id, Name, Email__C FROM Account WHERE Id = :conRecordDetails.AccountId LIMIT 1];
            String personalizedCustomBody = customBody;
            personalizedCustomBody = personalizedCustomBody.replace('{!Contact.Name}', conRecordDetails.Name != null ? conRecordDetails.Name : '')
                                        .replace('{!Account.Name}', accList.Name != null ? accList.Name : '');
            Messaging.SingleEmailMessage emailMessage = new Messaging.SingleEmailMessage();
            emailMessage.setToAddresses(new String[] {userEmail});
            emailMessage.setHtmlBody(personalizedCustomBody); // Set custom-designed email body
            emailMessage.setSaveAsActivity(false);
            emailMessage.setSubject(template.Subject); // Set subject from template

            // Attach files if any are found
            if (!emailAttachments.isEmpty()) {
                emailMessage.setFileAttachments(emailAttachments);
            }

            // Send the email
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] {emailMessage});
        } catch (Exception e) {
            throw new AuraHandledException('Error sending test email: ' + e.getMessage());
        }
    }


      // Get current user's email
    @AuraEnabled(cacheable=true)
    public static String getCurrentUserEmail() {
        return [SELECT Email FROM User WHERE Id = :UserInfo.getUserId()].Email;
    }

    @AuraEnabled(cacheable=true)
    public static String getProfile() {
        User currentUser = [SELECT Profile.Name FROM User WHERE Id = :UserInfo.getUserId()];
        return currentUser.Profile.Name;
    }

    // Helper method to retrieve email attachments related to the template
    private static List<Messaging.EmailFileAttachment> getEmailAttachments(String templateId) {
        List<Messaging.EmailFileAttachment> emailAttachments = new List<Messaging.EmailFileAttachment>();

        // Query attachments related to the Email Template
        for (Attachment att : [SELECT Id, Name, Body, ContentType FROM Attachment WHERE ParentId = :templateId]) {
            Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
            efa.setFileName(att.Name);
            efa.setBody(att.Body);
            efa.setContentType(att.ContentType);
            emailAttachments.add(efa);
        }

        // Query files (ContentDocument) related to the Email Template
        List<ContentDocumentLink> contentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :templateId];
        for (ContentDocumentLink link : contentLinks) {
            ContentVersion version = [
                SELECT Title, VersionData, FileType 
                FROM ContentVersion 
                WHERE ContentDocumentId = :link.ContentDocumentId 
                ORDER BY VersionNumber DESC 
                LIMIT 1
            ];
            Messaging.EmailFileAttachment fileAttachment = new Messaging.EmailFileAttachment();
            fileAttachment.setFileName(version.Title + '.' + version.FileType);
            fileAttachment.setBody(version.VersionData);
            fileAttachment.setContentType('application/' + version.FileType);
            emailAttachments.add(fileAttachment);
        }

        return emailAttachments;
    }
    
}