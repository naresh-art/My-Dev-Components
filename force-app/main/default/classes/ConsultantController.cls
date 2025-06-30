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
            System.debug('Consultant Record: ' + consultant);

            return consultant.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error while creating Consultant record: ' + e.getMessage());
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
