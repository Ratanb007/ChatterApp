import { LightningElement, api, wire,track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { getRecord, createRecord } from 'lightning/uiRecordApi';
import getTodayMessages from '@salesforce/apex/ChatHomeController.getTodayMessages';
import saveMsgRecord from '@salesforce/apex/ChatHomeController.saveContact';
import updateMessages from '@salesforce/apex/ChatHomeController.updateMessages';
import deleteMessage from '@salesforce/apex/ChatHomeController.deleteMessage';
import getSingleUser from '@salesforce/apex/ChatHomeController.getSingleUser';



import SOCKET_IO_JS from '@salesforce/resourceUrl/socketiojs';
import threeDot from '@salesforce/resourceUrl/threeDot';

import gallery from '@salesforce/resourceUrl/gallery';
import attachment from '@salesforce/resourceUrl/attachment';
import emoji from '@salesforce/resourceUrl/emoji';
import gif from '@salesforce/resourceUrl/gif';
import fileImg from '@salesforce/resourceUrl/fileimage';
import MESSAGE_OBJECT from '@salesforce/schema/Chat_message__c';
import CONTENT_FIELD from '@salesforce/schema/Chat_message__c.Content__c';
import USER_FIELD from '@salesforce/schema/Chat_message__c.User__c';
import TO_USER_FIELD from '@salesforce/schema/Chat_message__c.To_User__c';
import GROUP_FIELD from '@salesforce/schema/Chat_message__c.Chat_Group__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import WEBSOCKET_SERVER_URL from '@salesforce/label/c.websocket_server_url';
import { refreshApex } from '@salesforce/apex';
import TIME_ZONE  from '@salesforce/i18n/timeZone';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';
const MAX_FILE_SIZE = 100000000; // 10mb

export default class ChatMessages extends LightningElement 
{
    // handleMouseOver(event) {
    //     const threedotIcon = event.target.querySelector('threedotIcon');
    //     if (threedotIcon) {
    //       threedotIcon.style.display = 'block';
    //     }
    //   }
      
    //   handleMouseOut(event) {
    //     const threedotIcon = event.target.querySelector('threedotIcon');
    //     if (threedotIcon) {
    //       threedotIcon.style.display = 'none';
    //     }
    //   }
      
      


    // @track listVisible = false;

    // get listVisibleClass() {
    //   return this.listVisible ? 'show' : 'hide';
    // }
    
    // handleImageClick() {
    //     this.listVisible = !this.listVisible;
    //   }


    
    threedotIcon=threeDot;

    imageicon=gallery;
    attachmenticon=attachment;
    emoji=emoji;
    gif=gif;
    fileImg=fileImg;

@api recordId;
@api Chat_message__c;
   
  @track Minimize = false;
  

    @api error;
    @api del;
    timeString;
    @track name;  
    @api userId;
    @api toUserOrGroupId;
    inputPlaceholderText='Write a message....';
    contacts;
    @api toName;
    @api toMinimize;
    @api toimgurl;
    @api toIcon;
    @api lastseenTime;
    @api loginTime;
    @api login;
    @api seen;
    TIME_ZONE=TIME_ZONE;
    initialized = false;
    refreshInterval;
    
   @track isOnline=false;


    @track wiredMessages1 = { data: [] };
    @track userArray =  [];
    @track usersName = '';

    @wire(getTodayMessages,{fromUser:'$userId',toUserOrGroupId:'$toUserOrGroupId'})
    wiredMessages(result) {
        console.log('resultresultresult',result,this.userId,this.toUserOrGroupId,this.toName,'$toUserOrGroupId');
        var msgListAfterChange = { data: [] };
        this.wiredMessages1 = msgListAfterChange;
        const loTime = new Date(this.login);
        const lasTime = new Date(this.seen);

        // this.isOnline=false;
                
                if (loTime > lasTime) {
                    this.seen='Active';
                    this.isOnline=true;

                    
                    console.log('login time greater');
                } else  if(loTime < lasTime){
                    console.log('active');
                    // this.seen='last seen:'+this.login;
                    this.seen='offline';

                }else{
                    console.log('null');
                }

        if (result.data) {
            this.msgDataFormmter(result);
        //    this.updateScroll()
            if (!this.initialized) {
                console.log('Initializing Component!',this.wiredMessages1);
                this.initialized = true;
                this.refreshInterval = setInterval(() => {
                    console.log('Refreshing Component!');
                    refreshApex(result)
                    .then(() =>{
                        //this.msgDataFormmter(result);
                        console.log('inrefersh');
                    })
                    .catch(() => {
                        console.log('inrefersh error');
                    }); 
                }, 2000);
             
                
            }
            
        } else if (result.error) {
            console.log('Error in wire function getContactList!');
            console.log(result.error);
        }
        
        // this.wiredMessages1?.reverse()
    }
    
            
            // if(result.data.length > 0){
            //     for(var i=0; i<result.data.length; i++){
            //         var recordData  = Object.assign({},result.data[i]);
                
                
            //     if(result.data.length > i+1 && result.data[i].CreatedById==result.data[i+1].CreatedById ){
            //     //     console.log('createdid I+1'+result.data[i+1].CreatedById)
            //     // console.log('crreateId'+result.data[i].CreatedById)
            //         recordData.isshowImage=true;
            //     }
            //     else{
            //         recordData.isshowImage=false;
            //     }

            //         if(result.data[i].User__c == this.userId){
            //             recordData.isCurrentUserMsg__c = true;
            //         }else{
            //            recordData.isCurrentUserMsg__c = false;
            //         }
            //         if(result.data[i].isMediaMessage__c == true && result.data[i].ContentVersionId__c != undefined){
            //             recordData.docUrl = 'https://ivservetechnologies3-dev-ed.develop.my.salesforce.com/sfc/servlet.shepherd/Document/download/'+result.data[i].ContentVersionId__c;
            //             //recordData.docUrl = 'https://ivservetechnologies3-dev-ed.develop.file.force.com/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+result.data[i].ContentVersionId__c;
            //            //recordData.docName = 'File'; //result.data[i].fileName__c;
            //             console.log('hey'+result.data[i].ContentVersionId__c);
            //         }
                   // msgListAfterChange.data.push(recordData);
                //}
           // }
           // this.updateScroll();
    //         this.wiredMessages1 = msgListAfterChange;
    //         if (!this.initialized) {
    //             console.log('Initializing Component!');
    //             this.initialized = true;
    //             this.refreshInterval = setInterval(() => {
    //                 console.log('Refreshing Component!');
    //                 refreshApex(result);
    //             }, 2000);
    //         }
    //     } else if (result.error) {
    //         console.log('Error in wire function getContactList!');
    //         console.log(result.error);
    //     }
    // }
    handleImageClick(event) {
        const messageId = event.target.dataset.messageId;
        console.log('messageId',messageId);
        for (let index = 0; index < this.wiredMessages1.data.length; index++) {
          const element = this.wiredMessages1.data[index];
          console.log('messageIdnew',messageId,element.Id);

          if( String(element.Id)===String(messageId)) {
// 
            this.wiredMessages1.data[index].showmenu=this.wiredMessages1.data[index].showmenu?false:true;
            console.log('messageId',messageId,this.wiredMessages1);

          }else{
            this.wiredMessages1.data[index].showmenu=false;
          }
          
        }

        // const currentVisibility = this.openListMap.get(messageId);
        // this.openListMap.set(messageId, !currentVisibility);
      }
    msgDataFormmter(result){
        var msgListAfterChange = { data: [] };
        var lastUploadedFileSent = false;
        if(result.data.length > 0){
                
            console.log('lastseen'+this.seen);
            console.log('loginTime'+this.login);
            for(var i=result.data.length-1; i>=0; i--){
                var recordData  = Object.assign({},result.data[i]);
                if (lastUploadedFileSent) {
                    recordData.isshowImage = false;
                    lastUploadedFileSent = false; // Reset flag
                }
                else{
                if(result.data.length > i+1 && result.data[i].CreatedById==result.data[i+1].CreatedById ){
                        //     console.log('createdid I+1'+result.data[i+1].CreatedById)
                        // console.log('crreateId'+result.data[i].CreatedById)
                            recordData.isshowImage=true;
                        }
                        else{
                            recordData.isshowImage=false;
                        }
                

                if(result.data[i].User__c == this.userId ){
                    recordData.isCurrentUserMsg__c = true;
                   
                }else{
                   recordData.isCurrentUserMsg__c = false;
                }
                if(result.data[i].isMediaMessage__c == true && result.data[i].ContentVersionId__c != undefined ){
                    recordData.docUrl = 'https://ivservetechnologies3-dev-ed.develop.my.salesforce.com/sfc/servlet.shepherd/document/download/'+result.data[i].ContentVersionId__c;   
                    //recordData.docUrl =https://ivservetechnologies3-dev-ed.develop.my.salesforce.com      'https://ivservetechnologies3-dev-ed.develop.my.salesforce.com/sfc/servlet.shepherd/document/download/0695i00000BOZ4DAAX';
                    //recordData.docUrl =  'https://ivservetechnologies3-dev-ed.develop.my.salesforce.com/sfc/p/5i00000BYx6B/a/5i000000DqjE/Pk2MxzDtMNEkKYZW9__nZQl6McfxMhuTmvlJZT.w3Y8';
                    console.log(recordData.docUrl );     
                    console.log('upper'+result.data[i].ContentVersionId__c)   ;            
                }
                recordData['isOnline'] = false;

                const loTime = new Date(result.data[i].Last_Logout__c );
                const lasTime = new Date(result.data[i].LastLoginDate);
        
                // this.isOnline=false;
    
                        if (loTime > lasTime) {
                            console.log('isOnlineisOnlineisOnline');
                            // this.seen='Active';
                            // recordData['isOnline'] = true;
    
                            
                        }else{
                            console.log('isOnlineisOnlineisOnlineoffff');
                            recordData['isOnline'] = true;

                        }
    
            }
           
            recordData['showmenu'] = false;

                msgListAfterChange.data.push(recordData);
                console.log('elcome',JSON.stringify(recordData));
                console.log('result.data[i].ContentVersionId__c'+result.data[i].ContentVersionId__c);

            }
        }
        console.log('msgListAfterChange',JSON.stringify(msgListAfterChange));
        this.wiredMessages1 = msgListAfterChange;
        var uniqueArray = msgListAfterChange?.data?.filter(function(obj, index, self) {
            return index === self.findIndex(function(o) {
              return  o.User__c === obj.User__c;
            });
          });
          this.userArray=uniqueArray;
          for (let index = 0; index < uniqueArray.length; index++) {
            const element = uniqueArray[index];
            if(index===0){
                this.usersName=element.User__r.CommunityNickname;
            }else{
                this.usersName=this.usersName+', '+element.User__r.CommunityNickname;

            }
           
          }
        //   this.getAllLastSeen();
          console.log('uniqueArray',JSON.stringify(uniqueArray));

    }
  
    getAllLastSeen=()=>{
        let array=[]
        array=  this.wiredMessages1;
        for (let index = 0; index < array.data.length; index++) {
            const element =  array.data[index];
let isOnline=false;
            getSingleUser({toUserOrGroupId:element.User__c})
        .then(data=>{
            const currentMasterUsers = JSON.parse(data);
            const currentMasterUsersObject=currentMasterUsers[0]
            const loTime = new Date(currentMasterUsersObject.loginTime);
            const lasTime = new Date(currentMasterUsersObject.lastseenTime);
    
            // this.isOnline=false;

                    if (loTime > lasTime) {
                        // this.seen='Active';
                        isOnline=true;

                        
                        console.log('login time greater123', JSON.stringify(array.data[index]));
                    } else  if(loTime < lasTime){
                        console.log('active');

                        // this.seen='last seen:'+this.login;
                        // this.seen='offline';
    
                    }else{
                        console.log('null');

                    }
    
            console.log('getSingleUser'+ JSON.stringify(data));
        })
        .catch(err=>{

            console.log('getSingleUsererror',err);
        })
      array.data[index].isOnline = isOnline;

        }
        this.wiredMessages1=array;

        console.log('wiredMessages1wiredMessages1', JSON.stringify(array), JSON.stringify(this.wiredMessages1));
    }
    connectedCallback(){
       // this.getmsgData();
    }
   
    disconnectedCallback() {
        clearInterval(this.refreshInterval);
    }
    @track chatData = [];
    renderedCallback(){
        
    }
   

    /**
     * Utility debounce function.
     * @param {Function} callback - The function to debounce.
     * @param {Number} wait - The number of milliseconds to debounce.
     */
    debounce(callback, wait){
        let timeout;
        return (...args) => {
            const context = this;
            clearTimeout(timeout);
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            timeout = setTimeout(() => callback.apply(context, args), wait);
        };
    }

    /**
     * Utility function to remove any displayed message after 1 second.
     * @param {Text} msgType - Maps to the component message attribute.
     */
    messageResetDelay(msgType){
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
        this[msgType] = '';
        }, 1000)
    }

    randomTextGenerator()
    {
        return (Math.random() + 1).toString(36).substring(7);
    }

    handleCloseChat()
    {
        this.dispatchEvent(new CustomEvent('close',{detail:{
            id:this.toUserOrGroupId
        }}));
    }

    showToast(title,message,variant,mode) 
    {
        const event = new ShowToastEvent({
            title,
            variant,
            message,
            mode    
        });
        this.dispatchEvent(event);
    }
   
uploadedFiles = [];
file;
@track fileContents;
fileReader;
content;
fileName;
msg;

@track msgValue = '';

onNameChange(event) {  
    this.msgValue = event.detail.value;  
  }  

  get acceptedFormats() {
    return ['.png','.jpg'];
}
onFileUpload(event) {
    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files;
      this.fileName = event.target.files[0].name;
      this.file = this.uploadedFiles[0];
  
      if (this.file.size > MAX_FILE_SIZE) {
        
        console.log('ERROR');
        alert("File Size Cannot exceed " + MAX_FILE_SIZE);
      }
    }
  }

    // onFileUpload(event) {  

    // if (event.target.files.length > 0) {  

    //     this.uploadedFiles = event.target.files;  

    //     this.fileName = event.target.files[0].name;  

    //     this.file = this.uploadedFiles[0];  

    //     if (this.file.size > this.MAX_FILE_SIZE) {  

    //     alert("File Size Can not exceed" + MAX_FILE_SIZE);  
    //     }  
    // }  
    // }

inputmsgg ='';
    // Sendmsg() {  

    //     try {
    //       this.fileName = 'file ';
    //       this.fileReader = new FileReader();  

    //       this.fileReader.onloadend = (() => {  

    //       this.fileContents = this.fileReader.result;  

    //       let base64 = 'base64,';  

    //       this.content = this.fileContents.indexOf(base64) + base64.length;  

    //       this.fileContents = this.fileContents.substring(this.content);  

    //       this.saveRecord();
    //       refreshApex(this.wiredMessages1,);
    //       this.updateScroll();
    //       this.msgValue='';

    //       console.log('1');

    //     });  

    //     this.fileReader.readAsDataURL(this.file);

    //   } catch (e) {

    //     this.saveRecord();
    //     refreshApex(this.wiredMessages1);
    //     this.updateScroll();

    //     this.msgValue='';
    //     console.log('2');   
        


    //   }
      
      
    // }  
    Sendmsg() {  

        try {

        this.fileReader = new FileReader();  
        this.fileReader.onloadend = (() => {  

            this.fileContents = this.fileReader.result;  
            let base64 = 'base64,';  
            this.content = this.fileContents.indexOf(base64) + base64.length;  
            this.fileContents = this.fileContents.substring(this.content);  
            this.saveRecord();  

        });  

        this.fileReader.readAsDataURL(this.file);
        console.log('this.fileReader'+this.fileReader);

    }catch (e) {

        this.saveRecord();
    }

         

      }


      

      saveRecord() {  
        var con = {  
    
              'sobjectType': 'Chat_message__c',  
    
              'Content__c': this.msgValue,
            //   'Chat_Group__c': this.toUserOrGroupId,

              'User__c' : this.userId,
    
            } 
     
            if(this.toUserOrGroupId.startsWith('005')){
                con.To_User__c = this.toUserOrGroupId;
            }else if(this.toUserOrGroupId.startsWith('a005')){  
                con.Chat_Group__c = this.toUserOrGroupId;
            }
            
            
             
                saveMsgRecord({  
    
                    contactRec:con,
                    file: encodeURIComponent(this.fileContents),
                    fileName: this.fileName
    
                })
                   .then(()=>{
                    this.fileContents='';
                    
                    this.msgValue = '';
                    this.fileName=null;
                   
                    // this.getmsgData();
                    console.log('file   '+this.file);
                    console.log('done');
                    refreshApex(this.wiredMessages1)
                    .then(() =>{
                       
                        this.msgDataFormmter(result);
                        this.file = null; 
                        this.fileContents=null;
                        this.msgValue=null;
                        this.fileName=null;
                        console.log('inrefersh');
                    })
                    .catch(() => {
                        console.log('inrefersh error');
                    })
                    
                    
                })
    
                  .catch(()=>{
                    console.log('error');
    
                });
    
                   
    
            }
    
            @track isModalOpen = false;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }

    selectEmoji(event) {
        const emoji = event.target.getAttribute('data-emoji');
        const inputField = this.template.querySelector('lightning-input');
        const currentValue = inputField.value;
        inputField.value = currentValue + emoji;
        this.msgValue = currentValue + emoji;
        //this.isModalOpen = false;
    }

    
    get className(){
        //if changeStle is true, getter will return class1 else class2
        console.log('expadndd', this.expand);
        let css=this.toMinimize ?'chatMsgChaMinimize chatPosCls slds-border_left slds-border_bottom slds-border_top slds-border_right': 'chatMsgCha  slds-border_left slds-border_bottom slds-border_top slds-border_right';
      if(this.expand){
        css=css+' ExpandCLassCss'
      }
      else{
        css=css+' ExpandCLassCssMinn'
      }
          return css;
    }


      get popupone(){
        
        //if changeStle is true, getter will return class1 else class2
        return this.arrayMultipleList==0?' position: absolute;right: 9%;':' position: absolute;right: 6%;';
      }

      get IconValue(){
        //if changeStle is true, getter will return class1 else class2
          return this.toMinimize ?'utility:chevronup'
          :
          'utility:chevrondown';
      }
    handleMinimize(){
        this.toMinimize=this.toMinimize?false:true;
    }
    @track screenExp = false
    @api expand;
    handleClick1(){
        this.dispatchEvent(new CustomEvent('zoom',{detail:{
            id:this.toUserOrGroupId
        }}));
        console.log('in handleClick1');
        var divblock = this.template.querySelector('[data-value="chatMainDiv"]');
        var divblock1 = this.template.querySelector('[data-value="ChatOldDiv"]');
        //console.log('class'+this.template.querySelector('[data-value="ChatOldDiv"]').classList.includes('chatMsgCha'));
        if(this.template.querySelector('[data-value="chatMainDiv"]') && this.screenExp == false){
            console.log('in handleClick2');
            
            this.template.querySelector('[data-value="chatMainDiv"]').classList.add('chatroom__messagesSecond');
            this.template.querySelector('[data-value="chatMainDiv"]').classList.remove('chatMsgCha');
            this.screenExp = true;
        } else if(this.template.querySelector('[data-value="chatMainDiv"]') && this.screenExp ==  true){
            this.template.querySelector('[data-value="chatMainDiv"]').classList.remove('chatroom__messagesSecond');
            this.template.querySelector('[data-value="chatMainDiv"]').classList.add('chatMsgCha');
            this.screenExp = false;
        }   
      
         
    }
    // deleteAccount(event) {
    //     this.recordId=event.target.value;
    //     console.log('id', JSON.stringify( this.recordId));
    //     deleteRecord(this.recordId)
    //         .then(() => {
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Success',
    //                     message: 'Account has been deleted',
    //                     variant: 'success'
    //                 })
    //             );

    //         })
    //         .catch((error) => {
    //             this.error=error;
    //             console.log('unable to delete the record due to'+JSON.stringify(this.error));
    //          });

    //     }
      
        // createRecordInputFilteredByEditedFields(getTodayMessages: getTodayMessages, Name?: Name): RecordInput

        // get recordInputForUpdate() {
            
        //     if (!this.wiredMessages.data || !this.objectInfo.data) {
        //         console.log('wired message', this.wiredMessages);
        //         return undefined;
        //     }
    
        //     const recordInput = generateRecordInputForUpdate(
        //         this.wiredMessages.data,
        //         this.objectInfo.data
        //     );
        //     return recordInput;
        // }
    
        // get errors() {
        //     return this.wiredMessages.error;
        // }

        // handleUpdate() {
        //     const recordInput = this.recordInputForUpdate;
        //     if (recordInput) {
        //         // Perform the update action using the recordInput object
        //         // Add your logic here
        //         console.log('Record Input:', recordInput);
        //     }
        // }



        @track message = {
            Id: this.recordId, // Replace with the actual message ID
            // Add other properties of the message object as needed
        };
        // @track msgValue = '';
        inputPlaceholderText = 'Enter message';
        isModalOpen1 = false;
    
        openModaledit(event) {
            this.isModalOpen1 = true;
            this.msgValue=event.target.value;
            this.recordId=event.target.dataset.id;
        console.log('id in box msg value:'+ JSON.stringify( this.msgValue));
            // Logic to retrieve the current message value based on the selectedMessageId
            // Replace the code below with your implementation to fetch the message value
            const messageValue = this.msgValue; // Replace with the actual message value
            this.msgValue = messageValue;
        }
    
        closeModaledit() {
            this.isModalOpen1 = false;
        }
    
        onNameChangeEdit(event) {
            this.msgValue = event.target.value;
        }



        // handleUpdate(event) {
        //     this.recordId=event.target.value;
        //     alert('id:'+this.recordId);
        //     generateRecordInputForUpdate(this.recordId)
        //         .then(() => {
        //             this.dispatchEvent(
        //                 new ShowToastEvent({
        //                     title: 'Success',
        //                     message: 'Account has been edited',
        //                     variant: 'success'
        //                 })
        //             );
    
        //         })
        //         .catch((error) => {
        //             this.error=error;
        //             console.log('unable to delete the record due to'+JSON.stringify(this.error));
        //          });
    
        //     }

        // @wire(updateMessages,{messagegId:'$Id',msgvalue:'$msgValue'})

        updateRecords(event) {
            // this.recordId=  event.target.getAttribute("data-sortorder"); 
            // alert('id ne ne wnn en:'+JSON.stringify( this.recordId));
            updateMessages({ messagegId: this.recordId,msgvalue: this.msgValue })
            .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Message has been updated',
                            variant: 'success'
                        })
                    );
    
                })
                .then(()=>{
                   this.closeModaledit()
                })
                .catch((error) => {
                    this.error=error;
                    console.log('unable to update the record due to'+JSON.stringify(this.error));
                 });
    
            }




            deleteRecords(event) {
                this.recordId= event.target.value;

                // this.recordId=  event.target.getAttribute("data-sortorder"); 
                // alert('id ne ne wnn en:'+JSON.stringify( this.recordId));
                deleteMessage({ messagegIddelete: this.recordId })
                .then(() => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Message has been deleted',
                                variant: 'success'
                            })
                        );
        
                    })
                    .catch((error) => {
                        this.error=error;
                        console.log('unable to update the record due to'+JSON.stringify(this.error));
                     });
        
                }
    


        handleChange(event){
            if(event.target.label=='First Name'){
                this.contactRow.FirstName = event.target.value;
            }
        }

        handleSave(){
            this.saveRecord({ contactRec: this.contactRow })
                 .then((result) => {
                     console.log(result);
            })
                 .catch((error) => {
                     console.log(error);
                 });
        }
}