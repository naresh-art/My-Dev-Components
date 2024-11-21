public with sharing class csvFileUploadController {
    @AuraEnabled
    public static List<Account> insertAccounts(List<Map<String, String>> accountList) {
        // Debug logs for incoming data
        System.debug('Incoming Records: ' + accountList);

        if (accountList == null || accountList.isEmpty()) {
            throw new AuraHandledException('No valid data to insert.');
        }

        List<Account> accountsToInsert = new List<Account>();

        for (Map<String, String> accountData : accountList) {
            // Ensure mandatory fields are present
            if (String.isBlank(accountData.get('Name'))) {
                throw new AuraHandledException('Name is required for all records.');
            }

            Account acc = new Account();
            acc.Name = accountData.get('Name');
            acc.Phone = accountData.get('Phone');
            acc.Industry = accountData.get('Industry');
            accountsToInsert.add(acc);
        }

        try {
            if (!accountsToInsert.isEmpty()) {
                insert accountsToInsert;
            }
        } catch (Exception ex) {
            throw new AuraHandledException('Error inserting accounts: ' + ex.getMessage());
        }

        return accountsToInsert;
    }
}
