public without sharing class ConsultantController {
    @AuraEnabled
    public static Id createConsultantRecord(Map<String, Object> formData) {
        Consultant__c consultant = new Consultant__c();

        try {
            consultant.First_Name__c = (String) formData.get('firstName');
            consultant.Last_Name__c = (String) formData.get('lastName');
            
            // Convert string to Date
            if (formData.containsKey('birthdate')) {
                consultant.Birthdate__c = Date.valueOf((String) formData.get('birthdate'));
            }
            consultant.Gender__c = (String) formData.get('gender');
            consultant.Email_Address__c = (String) formData.get('email');
            consultant.Primary_Contact_Number__c = (String) formData.get('primaryContact');
            consultant.Present_Location__c = (String) formData.get('presentLocation');
            consultant.Willing_to_Relocate__c = (String) formData.get('willingToRelocate');
            consultant.Can_Drive__c = (String) formData.get('canDrive');
            consultant.International_Student__c = (String) formData.get('internationalStudent');
            consultant.Country_of_Citizenship__c = (String) formData.get('citizenship');
            consultant.Current_Status__c = (String) formData.get('currentStatus');
            consultant.Other_Status__c = (String) formData.get('otherStatus');
            
            if (formData.containsKey('visaIssueDate')) {
                consultant.Visa_Issue_Date__c = Date.valueOf((String) formData.get('visaIssueDate'));
            }
            if (formData.containsKey('visaExpiryDate')) {
                consultant.Visa_Expiry_Date__c = Date.valueOf((String) formData.get('visaExpiryDate'));
            }
            
            consultant.Visa_Status__c = (String) formData.get('visaStatus');
            consultant.Years_of_Experience__c = (String) formData.get('experience');
            consultant.Experience_in_India__c = (String) formData.get('experienceInIndia');
            consultant.Experience_in_USA__c = (String) formData.get('experienceInUSA');
            consultant.Technology_Expertise__c = (String) formData.get('technology');
            consultant.Other_Technology__c = (String) formData.get('otherTechnology');
            consultant.Approval_Status__c = 'Pending Approval From HR';
            insert consultant;
            // Send email to HR
            //sendEmailToHR(consultant);
            return consultant.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error while creating Consultant record: ' + e.getMessage());
        }
    }

    public static void sendEmailToHR(Consultant__c consultant) {
        try {
            String hrEmail = 'nareshp@sprintpark.com'; // Replace with HR email
            String subject = 'New Consultant Registration: ' + consultant.First_Name__c + ' ' + consultant.Last_Name__c;
            // HTML email body
            String body = '<html><body>' +
                '<h2 style="color: #2C3E50;">New Consultant Registration</h2>' +
                '<p style="font-size: 14px; color: #555;">A new consultant has registered with the following details:</p>' +
                '<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Name:</td><td style="padding: 8px; border: 1px solid #ddd;">' + consultant.First_Name__c + ' ' + consultant.Last_Name__c + '</td></tr>' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Birthdate:</td><td style="padding: 8px; border: 1px solid #ddd;">' + String.valueOf(consultant.Birthdate__c) + '</td></tr>' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Gender:</td><td style="padding: 8px; border: 1px solid #ddd;">' + consultant.Gender__c + '</td></tr>' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Email:</td><td style="padding: 8px; border: 1px solid #ddd;">' + consultant.Email_Address__c + '</td></tr>' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Phone:</td><td style="padding: 8px; border: 1px solid #ddd;">' + consultant.Primary_Contact_Number__c + '</td></tr>' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Location:</td><td style="padding: 8px; border: 1px solid #ddd;">' + consultant.Present_Location__c + '</td></tr>' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Willing to Relocate:</td><td style="padding: 8px; border: 1px solid #ddd;">' + consultant.Willing_to_Relocate__c + '</td></tr>' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Can Drive:</td><td style="padding: 8px; border: 1px solid #ddd;">' + consultant.Can_Drive__c + '</td></tr>' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Visa Status:</td><td style="padding: 8px; border: 1px solid #ddd;">' + consultant.Visa_Status__c + '</td></tr>' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Years of Experience:</td><td style="padding: 8px; border: 1px solid #ddd;">' + consultant.Years_of_Experience__c + '</td></tr>' +
                '<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Technology Expertise:</td><td style="padding: 8px; border: 1px solid #ddd;">' + consultant.Technology_Expertise__c + '</td></tr>' +
                '</table>' +
                '<p style="font-size: 12px; color: #555; margin-top: 20px;">Please review the details and take the necessary actions.</p>' +
                '</body></html>';
    
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[] { hrEmail });
            email.setSubject(subject);
            email.setHtmlBody(body); // Use the HTML body for a professional format
    
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
        } catch (Exception e) {
            System.debug('Error sending email to HR: ' + e.getMessage());
        }
    }
    

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getPicklistValues(String objectName, String fieldName) {
        List<Map<String, String>> picklistValues = new List<Map<String, String>>();
        try {
            // Retrieve describe result for the specified object
            Schema.SObjectType objectType = Schema.getGlobalDescribe().get(objectName);
            Schema.DescribeSObjectResult describeSObjectResult = objectType.getDescribe();
            
            // Retrieve the field describe result
            Schema.DescribeFieldResult fieldResult = describeSObjectResult.fields.getMap().get(fieldName).getDescribe();
            
            // Loop through picklist values
            for (Schema.PicklistEntry entry : fieldResult.getPicklistValues()) {
                Map<String, String> picklistEntry = new Map<String, String>();
                picklistEntry.put('label', entry.getLabel());
                picklistEntry.put('value', entry.getValue());
                picklistValues.add(picklistEntry);
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching picklist values: ' + e.getMessage());
        }
        return picklistValues;
    }
    
}
