public with sharing class FilePreviewController {
    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getVersionFiles(Id recordId) {
        try {
            Set<Id> relatedEntityIds = new Set<Id>();
            relatedEntityIds.add(recordId); // Add Case Id to the set
            if (recordId.getSObjectType().getDescribe().getName() == 'Account') {
                List<EmailMessage> caseEmails = [SELECT Id FROM EmailMessage WHERE ParentId = :recordId];
                for (EmailMessage email : caseEmails) {
                    relatedEntityIds.add(email.Id);
                }
            }

            // Query ContentDocumentLink records where LinkedEntityId is either the Case or EmailMessages
            List<ContentDocumentLink> contentLinks = [
                SELECT ContentDocumentId
                FROM ContentDocumentLink
                WHERE LinkedEntityId IN :relatedEntityIds
            ];

            // Collect ContentDocumentIds
            Set<Id> contentDocumentIds = new Set<Id>();
            for (ContentDocumentLink link : contentLinks) {
                contentDocumentIds.add(link.ContentDocumentId);
            }

            // Query ContentVersion records based on ContentDocumentIds
            List<ContentVersion> contentVersions = [
                SELECT
                    Id,
                    Title,
                    ContentDocumentId,
                    FileType,
                    ContentSize,
                    FileExtension,
                    VersionNumber,
                    CreatedDate,
                    VersionData
                FROM ContentVersion
                WHERE ContentDocumentId IN :contentDocumentIds AND IsLatest = TRUE
                ORDER BY CreatedDate DESC
            ];

            return contentVersions;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}