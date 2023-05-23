public with sharing class groupclass {

    @AuraEnabled(cacheable=true)
    public static List<User> getGroupList(){
        return [SELECT Id, Name,Email FROM User];
    }

    @AuraEnabled(cacheable=true)
    public static void createChatGroupMember(String groupName) {
        groupforTesting__c chatGroupMember = new groupforTesting__c();
        chatGroupMember.Name = groupName;
        insert chatGroupMember;
    }

}