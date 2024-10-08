
public with sharing class MassDeleteContactsCls {
    public MassDeleteContactsCls() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(){
        return [
            SELECT Id, firstName,lastName, Title, Phone, Email 
            FROM Contact WHERE firstName!=null ORDER BY createdDate desc];
    }
    /*This method deletes the selecteds based on the contact ids sent from LWC */
    @AuraEnabled
    public static Void  deleteSelectedContacts(List<Id> selContactIdList){
       
        List<Contact> contactList = new List<Contact>();
        contactList = [select id from Contact where id in:selContactIdList];
        if(contactList!=null && contactList.size()>0){
            delete contactList;
        }
        
    }
}