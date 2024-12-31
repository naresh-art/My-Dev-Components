public with sharing class csvFileUploadController {
    @AuraEnabled
    public static List<Account> insertAccounts(List<Map<String, String>> accountList, String fileName) {
        System.debug('Incoming Records: ' + accountList);
        System.debug('File Name: ' + fileName);

        if (accountList == null || accountList.isEmpty()) {
            throw new AuraHandledException('No valid data to insert.');
        }

        List<Account> accountsToInsert = new List<Account>();

        for (Map<String, String> accountData : accountList) {
            if (String.isBlank(accountData.get('Name'))) {
                throw new AuraHandledException('Name is required for all records.');
            }

            Account acc = new Account();
            acc.Name = accountData.get('Name');
            acc.Phone = accountData.get('Phone');
            acc.Industry = accountData.get('Industry');
            acc.CustomerPriority__c = accountData.get('CustomerPriority');
            acc.File_Name__c = fileName;

            String slaExpirationDateStr = accountData.get('SLAExpirationDate');
            if (!String.isBlank(slaExpirationDateStr)) {
                try {
                    acc.SLAExpirationDate__c = parseDynamicDate(slaExpirationDateStr);
                } catch (Exception e) {
                    throw new AuraHandledException('Invalid date format for SLAExpirationDate: ' + slaExpirationDateStr);
                }
            }
            if (!String.isBlank(accountData.get('Amount'))) {
                try {
                    acc.Amount__c = Decimal.valueOf(accountData.get('Amount'));
                } catch (Exception e) {
                    throw new AuraHandledException('Invalid decimal format for Amount: ' + accountData.get('Amount'));
                }
            }

            String industry = accountData.get('Industry');
            if (industry != null) {
                switch on industry {
                    when 'Electronics' {
                        acc.AC__c = parseCurrencyField(accountData.get('AC'));
                        acc.TV__c = parseCurrencyField(accountData.get('TV'));
                    }
                    when 'Communications' {
                        acc.Telephone__c = parseCurrencyField(accountData.get('Telephone'));
                        acc.Wifi__c = parseCurrencyField(accountData.get('Wifi'));
                    }
                    when 'Hospitality' {
                        acc.Food__c = parseCurrencyField(accountData.get('Food'));
                        acc.Water__c = parseCurrencyField(accountData.get('Water'));
                    }
                }
            }

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

    private static Date parseDynamicDate(String dateStr) {
        Date result;
        List<String> dateFormats = new List<String>{
            'MM/DD/YYYY', 
            'YYYY-MM-DD', 
            'DD-MM-YYYY',
            'YYYY/MM/DD',
            'DD/MM/YYYY',
            'MM-DD-YYYY'
        };

        for (String format : dateFormats) {
            try {
                if (format == 'MM/DD/YYYY') {
                    List<String> parts = dateStr.split('/');
                    result = Date.newInstance(Integer.valueOf(parts[2]), Integer.valueOf(parts[0]), Integer.valueOf(parts[1]));
                } else if (format == 'YYYY-MM-DD') {
                    List<String> parts = dateStr.split('-');
                    result = Date.newInstance(Integer.valueOf(parts[0]), Integer.valueOf(parts[1]), Integer.valueOf(parts[2]));
                } else if (format == 'DD-MM-YYYY') {
                    List<String> parts = dateStr.split('-');
                    result = Date.newInstance(Integer.valueOf(parts[2]), Integer.valueOf(parts[1]), Integer.valueOf(parts[0]));
                } else if (format == 'YYYY/MM/DD') {
                    List<String> parts = dateStr.split('/');
                    result = Date.newInstance(Integer.valueOf(parts[0]), Integer.valueOf(parts[1]), Integer.valueOf(parts[2]));
                } else if (format == 'DD/MM/YYYY') {
                    List<String> parts = dateStr.split('/');
                    result = Date.newInstance(Integer.valueOf(parts[2]), Integer.valueOf(parts[1]), Integer.valueOf(parts[0]));
                } else if (format == 'MM-DD-YYYY') {
                    List<String> parts = dateStr.split('-');
                    result = Date.newInstance(Integer.valueOf(parts[2]), Integer.valueOf(parts[0]), Integer.valueOf(parts[1]));
                }
                return result;
            } catch (Exception e) {
                // Ignore and try the next format
            }
        }
        throw new AuraHandledException('Unsupported date format: ' + dateStr);
    }

    private static Decimal parseCurrencyField(String fieldValue) {
        if (String.isBlank(fieldValue)) return null;
        try {
            return Decimal.valueOf(fieldValue);
        } catch (Exception e) {
            throw new AuraHandledException('Invalid decimal format for currency field: ' + fieldValue);
        }
    }
}
