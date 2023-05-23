trigger Logoutinfo on LogoutEventStream (after insert) {

    List <User> userList= new List <User>();

for( LogoutEventStream les:Trigger.new)

{

  for(User userInfo: [Select ID,Last_Logout__c From User where ID =: les.UserID] ) 

  {  

  userInfo.Last_Logout__c=System.now();

  userList.add(userInfo);  

  } 

}

     update userList;

}