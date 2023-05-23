public without sharing   class ChatHomeController 
{
    // @AuraEnabled(cacheable=true)
    // public static List<User> getGroupList(){
    //     return [SELECT Id, Name,Email FROM User];
    // }
      
//Gruoup class
@AuraEnabled(cacheable=true)
public static List<User> getGroupList(){
    return [SELECT Id, Name, Email FROM User];
}
@AuraEnabled
public static Id groupRec(String grpNames, List<String> checkdata) {
try {
    List<User> selectedUsers = [SELECT Id, Name, Email FROM User WHERE Id IN :checkdata];

    // Create a new custom object record to Group__c custom object 
    Chat_Group__c groups = new Chat_Group__c();
    groups.Name = grpNames;
    insert groups;

    List<User> selected = [SELECT Id, Name, Email FROM User WHERE Id IN :checkdata];
    List<String> selectedUserNames = new List<String>();
    for(User u : selected){
        selectedUserNames.add(u.Id);
    }

    // transfer selected checkbox records to custom field member__c 
//     Chat_Group_Member__c newRecord = new Chat_Group_Member__c();    
//            newRecord.Chat_Group__c = groups.Id;
//    // newRecord.member__c = String.join(selectedUserNames, ',');
//     insert newRecord;

List<Chat_Group_Member__c> groupMembers = new List<Chat_Group_Member__c>();
for (String userId : checkdata) {
    Chat_Group_Member__c member = new Chat_Group_Member__c();
    member.Chat_Group__c = groups.Id;
    member.User__c = userId;
    groupMembers.add(member);
}
insert groupMembers;

    System.debug(groupMembers);
    return groups.Id;

  } 
     catch(Exception ex) {
     System.debug('An Exception: ' + ex);
    return null;
}
}
    @AuraEnabled(cacheable=true)
    public static String getAllUsersAndGroups(){
        try {
            // List <AuthSession> lstAuth =[Select UsersId, UserType, SourceIp, SessionType, SessionSecurityLevel, 
            //         ParentId, NumSecondsValid, LogoutUrl, LoginType, LoginHistoryId, 
            //         LastModifiedDate, Id, CreatedDate 
            //         From AuthSession 
            //         Where LoginType = 'Application' and SessionType = 'UI' order by LastModifiedDate DESC];
            // List<Id> onlineUsersId= new List<Id>();

            // for(AuthSession AuS:lstAuth){
            //     onlineUsersId.add(AuS.UsersId);
            // }

            List<UserWrapper> userAndGroupList=new List<UserWrapper>();
            UserWrapper usrWrap;
            // for(User usr:[SELECT Id, Name, MediumPhotoUrl, Last_Logout__c,LastLoginDate FROM User WHERE isActive=true AND Id !=:UserInfo.getUserId() AND IsPortalEnabled = true ORDER BY NAME])

            for(User usr:[SELECT Id, Name, MediumPhotoUrl, Last_Logout__c,LastLoginDate FROM User WHERE isActive=true AND Id !=:UserInfo.getUserId() ORDER BY NAME])
            {
                usrWrap=new UserWrapper();
                usrWrap.userName=usr.Name;
                usrWrap.userId=usr.Id;
                usrWrap.proPicURL=usr.MediumPhotoUrl  ;
                usrWrap.lastseenTime= String.valueOf( usr.Last_Logout__c ) ;
                usrWrap.loginTime= String.valueOf( usr.LastLoginDate) ;
                userAndGroupList.add(usrWrap);
            }
            for(Chat_Group_Member__c chatGrp:[SELECT Id, Chat_Group__c,Chat_Group__r.Name FROM Chat_Group_Member__c
                                              WHERE User__c =:UserInfo.getUserId() ORDER BY Chat_Group__r.Name])
            {
                usrWrap=new UserWrapper();
                usrWrap.userName=chatGrp.Chat_Group__r.Name;
                usrWrap.userId=chatGrp.Chat_Group__c;
                userAndGroupList.add(usrWrap);
            }
            return JSON.serialize(userAndGroupList);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static String getCurrentUsersAndGroups(){
        try {
            // List <AuthSession> lstAuth =[Select UsersId, UserType, SourceIp, SessionType, SessionSecurityLevel, 
            //         ParentId, NumSecondsValid, LogoutUrl, LoginType, LoginHistoryId, 
            //         LastModifiedDate, Id, CreatedDate 
            //         From AuthSession 
            //         Where LoginType = 'Application' and SessionType = 'UI' order by LastModifiedDate DESC];
            // List<Id> onlineUsersId= new List<Id>();

            // for(AuthSession AuS:lstAuth){
            //     onlineUsersId.add(AuS.UsersId);
            // }

            List<UserWrapper> userAndGroupList=new List<UserWrapper>();
            UserWrapper usrWrap;
            // for(User usr:[SELECT Id, Name, MediumPhotoUrl, Last_Logout__c,LastLoginDate FROM User WHERE isActive=true AND Id !=:UserInfo.getUserId() AND IsPortalEnabled = true ORDER BY NAME])

            for(User usr:[SELECT Id, Name, MediumPhotoUrl, Last_Logout__c,LastLoginDate FROM User WHERE isActive=true AND Id =:UserInfo.getUserId() ORDER BY NAME])
            {
                usrWrap=new UserWrapper();
                usrWrap.userName=usr.Name;
                usrWrap.userId=usr.Id;
                usrWrap.proPicURL=usr.MediumPhotoUrl  ;
                usrWrap.lastseenTime= String.valueOf( usr.Last_Logout__c ) ;
                usrWrap.loginTime= String.valueOf( usr.LastLoginDate) ;
                userAndGroupList.add(usrWrap);
            }
           
            return JSON.serialize(userAndGroupList);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static String getSingleUser(String toUserOrGroupId){
        try {
            // List <AuthSession> lstAuth =[Select UsersId, UserType, SourceIp, SessionType, SessionSecurityLevel, 
            //         ParentId, NumSecondsValid, LogoutUrl, LoginType, LoginHistoryId, 
            //         LastModifiedDate, Id, CreatedDate 
            //         From AuthSession 
            //         Where LoginType = 'Application' and SessionType = 'UI' order by LastModifiedDate DESC];
            // List<Id> onlineUsersId= new List<Id>();

            // for(AuthSession AuS:lstAuth){
            //     onlineUsersId.add(AuS.UsersId);
            // }

            List<UserWrapper> userAndGroupList=new List<UserWrapper>();
            UserWrapper usrWrap;
            // for(User usr:[SELECT Id, Name, MediumPhotoUrl, Last_Logout__c,LastLoginDate FROM User WHERE isActive=true AND Id !=:UserInfo.getUserId() AND IsPortalEnabled = true ORDER BY NAME])

            for(User usr:[SELECT Id, Name, MediumPhotoUrl, Last_Logout__c,LastLoginDate FROM User WHERE isActive=true AND Id =:toUserOrGroupId ORDER BY NAME])
            {
                usrWrap=new UserWrapper();
                usrWrap.userName=usr.Name;
                usrWrap.userId=usr.Id;
                usrWrap.proPicURL=usr.MediumPhotoUrl  ;
                usrWrap.lastseenTime= String.valueOf( usr.Last_Logout__c ) ;
                usrWrap.loginTime= String.valueOf( usr.LastLoginDate) ;
                userAndGroupList.add(usrWrap);
            }
           
            return JSON.serialize(userAndGroupList);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Chat_Message__c> getTodayMessages(String fromUser,String toUserOrGroupId) {
        system.debug('toUserOrGroupId'+toUserOrGroupId);
        system.debug('comUrl sfdsf'+URL.getSalesforceBaseUrl().toExternalForm() );
         system.debug('fromUser'+fromUser);
        List<Chat_Message__c> messageList;
        try {
            if(toUserOrGroupId.startsWith('005'))
            {
                messageList = [
                    SELECT Id, Content__c, CreatedDate, User__r.Name, User__r.MediumPhotoUrl,User__r.Last_Logout__c,User__r.LastLoginDate,ContentVersionId__c,isMediaMessage__c,fileName__c,CreatedById,LastModifiedDate
                    FROM Chat_Message__c 
                    WHERE 
                   (((User__c =:fromUser AND To_User__c=:toUserOrGroupId) 
                    OR
                    (User__c =:toUserOrGroupId AND To_User__c=:fromUser)) ) AND User__c != null 
                    ORDER BY CreatedDate DESC
                ];
            system.debug('messageList'+messageList);
           // system.debug('messageListUser');

            }
            else
                messageList = [
                    SELECT Id, Content__c, CreatedDate, User__r.Name, User__r.MediumPhotoUrl,User__r.Last_Logout__c,User__r.LastLoginDate,ContentVersionId__c,isMediaMessage__c,fileName__c,CreatedById,LastModifiedDate 
                    FROM Chat_Message__c 
                    WHERE Chat_Group__c=:toUserOrGroupId
                    ORDER BY CreatedDate DESC
                ];
                system.debug('messageListgroup'+messageList);
               // system.debug('messageListgroup');
        } catch(Exception e) {
            System.debug(e.getMessage());
            return null;
        }
        List<String> msgIdList = new List<String>();
        for(Chat_Message__c chMSG : messageList){
            if(chMSG.isMediaMessage__c == true){
                msgIdList.add(chMSG.id);
            }
            
        }
        Map<String,wrapper> mediaDocIdMap = new Map<String,wrapper>();
        if(msgIdList.size() > 0)
        {
             mediaDocIdMap = getFileMedeia(msgIdList);
        }      
        system.debug('mediaDocIdMap'+mediaDocIdMap);
        for(Chat_Message__c chMSG : messageList){
            if(chMSG.isMediaMessage__c == true && mediaDocIdMap.containsKey(chMSG.id)){
                chMSG.ContentVersionId__c = mediaDocIdMap.get(chMSG.id).Id;
                chMSG.fileName__c = mediaDocIdMap.get(chMSG.id).name;
            }
            
        }
        return messageList;
    }

    public class UserWrapper
    {
        @AuraEnabled
        public String userName {get; set;} 
        @AuraEnabled
        public String userId {get; set;} 
        @AuraEnabled
        public String proPicURL {get; set;} 
        @AuraEnabled
        public String lastseenTime {get; set;} 
        @AuraEnabled
        public String loginTime {get; set;} 


    }
    // @AuraEnabled(cacheable=true)
    // public static void  deleteMethoddd(String messagegId){
        
    //     Chat_message__c msgData = new Chat_message__c();
    //     msgData.Id = messagegId;
    //     Delete msgData;
        
    // }
    @AuraEnabled
    public static string saveContact(Chat_message__c contactRec, string file, string fileName) {
        string msgId;
      try{ 
            Chat_message__c msgData = contactRec;
            String base64File = EncodingUtil.urlDecode(file, 'UTF-8');
            
            ContentVersion contentVersionRec = new ContentVersion();
            contentVersionRec.Title = fileName;
            contentVersionRec.PathOnClient = '/' + fileName;
          //  contentVersionRecc.FirstPublishLocationId = msgData.id;  

            contentVersionRec.VersionData = EncodingUtil.base64Decode(base64File);
            contentVersionRec.IsMajorVersion = true;
    
            if (contentVersionRec.Title != null && contentVersionRec.VersionData != null && contentVersionRec.VersionData.size() > 0) {
                msgData.isMediaMessage__c = true;
            }
            
            if (msgData.Content__c != null) {
                upsert msgData;
            } else {
                insert msgData;
            }
            
            msgId = msgData.Id;
           // contentVersionRecc.FirstPublishLocationId = msgData.id;  

            
            if (contentVersionRec.Title != null && contentVersionRec.VersionData != null && contentVersionRec.VersionData.size() > 0) {
                insert contentVersionRec;
                
                contentVersionRec = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id = :contentVersionRec.Id LIMIT 1];
                
                ContentDocumentLink cdl = new ContentDocumentLink();
                cdl.ContentDocumentId = contentVersionRec.ContentDocumentId;
                cdl.LinkedEntityId = msgId;
                cdl.ShareType = 'V';
                cdl.Visibility = 'AllUsers';
                insert cdl;
            }
            
            system.debug(contentVersionRec);
        } catch(Exception ex) {
            system.debug('Exception ===> ' + ex.getMessage());
        }
        return msgId;
    }
     

    @AuraEnabled
    public static string updateMessages(id messagegId, string msgvalue){

        Chat_message__c messageupdate = new Chat_message__c();
        messageupdate.id = messagegId;
        messageupdate.Content__c= msgvalue;
        update messageupdate;
        return null;


    }


    @AuraEnabled
    public static string deleteMessage(id messagegIddelete){

        Chat_message__c messageupdate = new Chat_message__c();
        messageupdate.id = messagegIddelete;
        delete messageupdate;
        return null;


    }
   
    
    public static Map<String,wrapper> getFileMedeia(List<String> mssgIdList){
      List<ContentVersion> ListofChatmessagesMedia = new List<ContentVersion>();
      
      Map<String,wrapper> magVsContVIdMap = new Map<String,wrapper>();
      Map<String,Id> mapmsgIdwithContentDocument = new Map<String,Id>();
      
      List<ContentDocumentLink> files=[SELECT ContentDocumentId,LinkedEntityId from ContentDocumentLink Where LinkedEntityId IN:mssgIdList];
      
      for(ContentDocumentLink docLink : files){
        mapmsgIdwithContentDocument.put(docLink.ContentDocumentId,docLink.LinkedEntityId);
      }
      ListofChatmessagesMedia =[SELECT id,ContentDocumentId,ContentDocument.Title,CreatedDate from ContentVersion 
                            Where ContentDocumentId IN :mapmsgIdwithContentDocument.keyset()  ];
      if(ListofChatmessagesMedia.size()>0){
        for(ContentVersion cV:ListofChatmessagesMedia ){
            if(cV.Id!=null && cV.ContentDocumentId!=null && mapmsgIdwithContentDocument.containsKey(cV.ContentDocumentId)){
                wrapper wrp = new wrapper();
                wrp.Id = cV.ContentDocumentId;
                wrp.Name = cV.ContentDocument.Title;
                magVsContVIdMap.put(mapmsgIdwithContentDocument.get(cV.ContentDocumentId),wrp);
            }
        }
      }
      return magVsContVIdMap;
    }
    @AuraEnabled
    public static list<user> logoutTime( string userId){
        list<user> outTime  = [SELECT Id, Last_Logout__c FROM User];
        return outTime;
      }

    
     public class wrapper{
        public string id;
        public string name;
    }
    
    
}