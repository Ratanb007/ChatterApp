trigger LoginInfo on LogoutEventStream (after insert) {
    List <User> userList= new List <User>();

for( LogoutEventStream les:Trigger.new)

{

  for(User userInfo: [Select ID,login__c From User where ID =: les.UserID] ) 

  {  

  userInfo.Login__c=System.now();

  userList.add(userInfo);  

  } 

}

     update userList;
}