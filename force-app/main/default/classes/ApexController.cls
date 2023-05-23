public with sharing class ApexController {
    @AuraEnabled(cacheable=true)
    public static List<Account> displayAccounts(){
        List<Account> acclist=[select Id,Name from Account];
        return acclist;
    }
}