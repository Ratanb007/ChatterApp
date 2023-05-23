import { LightningElement, api, wire,track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { getRecord, createRecord } from 'lightning/uiRecordApi';
import getTodayMessages from '@salesforce/apex/ChatHomeController.getTodayMessages';
import searchmsg from '@salesforce/apex/ChatHomeController.searchmsg';
import saveMsgRecord from '@salesforce/apex/ChatHomeController.saveContact';
import SOCKET_IO_JS from '@salesforce/resourceUrl/socketiojs';
import NOTIFICATION_SOUND from '@salesforce/resourceUrl/notification_sound';
import MESSAGE_OBJECT from '@salesforce/schema/Chat_message__c';
import CONTENT_FIELD from '@salesforce/schema/Chat_message__c.Content__c';
import USER_FIELD from '@salesforce/schema/Chat_message__c.User__c';
import TO_USER_FIELD from '@salesforce/schema/Chat_message__c.To_User__c';
import GROUP_FIELD from '@salesforce/schema/Chat_message__c.Chat_Group__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import WEBSOCKET_SERVER_URL from '@salesforce/label/c.websocket_server_url';
import { refreshApex } from '@salesforce/apex';
import TIME_ZONE  from '@salesforce/i18n/timeZone';
const MAX_FILE_SIZE = 100000000; //10mb  

export default class Emojifile extends LightningElement 
{
    searchParam='';
    searchResult=[];
    
    @api del;
    timeString;
    @track name;  
    @api userId;
    @api toUserOrGroupId;
    inputPlaceholderText='Write a message....';
    noficationAudio=NOTIFICATION_SOUND;
    @api toName;
    @api toimgurl;
    @api toIcon;
    TIME_ZONE=TIME_ZONE;
    initialized = false;
    refreshInterval;
    @track wiredMessages1 = { data: [] };
    @wire(getTodayMessages,{fromUser:'$userId',toUserOrGroupId:'$toUserOrGroupId'})
    wiredMessages(result) {
        var msgListAfterChange = { data: [] };
        if (result.data) {
            
            if(result.data.length > 0){
                for(var i=0; i<result.data.length; i++){
                    var recordData  = Object.assign({},result.data[i]);
                
                
                if(result.data.length > i+1 && result.data[i].CreatedById==result.data[i+1].CreatedById ){
                    console.log('createdid I+1'+result.data[i+1].CreatedById)
                console.log('crreateId'+result.data[i].CreatedById)
                    recordData.isshowImage=true;
                }
                else{
                    recordData.isshowImage=false;
                }

                    if(result.data[i].User__c == this.userId){
                        recordData.isCurrentUserMsg__c = true;
                    }else{
                       recordData.isCurrentUserMsg__c = false;
                    }
                    if(result.data[i].isMediaMessage__c == true && result.data[i].ContentVersionId__c != undefined){
                        recordData.docUrl = 'https://ivservetechnologies3-dev-ed.develop.my.salesforce.com/sfc/servlet.shepherd/document/download/'+result.data[i].ContentVersionId__c;
                        //recordData.docUrl = 'https://ivservetechnologies3-dev-ed.develop.file.force.com/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+result.data[i].ContentVersionId__c;
                        recordData.docName = 'File'; //result.data[i].fileName__c;
                        console.log('hey'+result.data[i].ContentVersionId__c);
                    }
                    msgListAfterChange.data.push(recordData);
                }
            }
            this.wiredMessages1 = msgListAfterChange;
            if (!this.initialized) {
                console.log('Initializing Component!');
                this.initialized = true;
                this.refreshInterval = setInterval(() => {
                    console.log('Refreshing Component!');
                    refreshApex(result);
                }, 2000);
            }
        } else if (result.error) {
            console.log('Error in wire function getContactList!');
            console.log(result.error);
        }
    }



    disconnectedCallback() {
        clearInterval(this.refreshInterval);
    }
    renderedCallback(){
       
        if (this._socketIoInitialized) {
          return;
        }
        this._socketIoInitialized = true;
    
        Promise.all([
          loadScript(this, SOCKET_IO_JS),
        ])
        .then(() => {
            this.initSocketIo();
            setInterval(() => {
                this.refreshData();
            }, 5000);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('loadScript error', error);
          this.error = 'Error loading socket.io';
        });
        
    }
   

    initSocketIo(){
        // eslint-disable-next-line no-undef
        // eslint-disable-next-line no-undef
        this._socket = io.connect(WEBSOCKET_SERVER_URL);
        const messageInput = this.template.querySelector('.message-input');
    
        if (this._socket !== undefined) {
    
            /**
             * Not necessary for functionality. We are just demonstrates the socket 
             * connection with the server by display a counting timestring on the frontend.
             */
            this._socket.on('time', (timeString) => {
                this.timeString = timeString;
            });
        
            /**
             * Listening for activity on the message input field. 
             * Handling the socket event emit for when the user is typing 
             * and if a chat message was submitted (enter key is pressed).
             */
            messageInput.addEventListener('keydown', (event) => {
                this._socket.emit('usertyping', { userId: this.userId });
                // Tab key for when input field is put into focus.
                if (event.keyCode !== 9) {
                    this._socket.emit('usertyping', { userId: this.userId });
                }
                if (event.which === 13 && event.shiftKey === false) {
                    event.preventDefault();
            
                    const fields = {};
                    fields[CONTENT_FIELD.fieldApiName] = messageInput.value;
                    fields[USER_FIELD.fieldApiName] = this.userId;
                    if(this.toUserOrGroupId.startsWith('005'))
                        fields[TO_USER_FIELD.fieldApiName] = this.toUserOrGroupId;
                    else
                        fields[GROUP_FIELD.fieldApiName] = this.toUserOrGroupId;
                    const message = { apiName: MESSAGE_OBJECT.objectApiName, fields };
            
                    createRecord(message)
                    .then(() => {
                        // Reset the form input field.
                        messageInput.value = '';
                        // Refresh the message data for other active users.
                        this._socket.emit('transmit');
                        // Refresh the message data for the current user.
                        return refreshApex(this.wiredMessages1);
                    })
                    .catch(error => {
                        // eslint-disable-next-line no-console
                        console.error('error', error);
                        this.error = 'Error creating message';
                    });
                }
            });
    
            /**
             * When the user has released typing, debounce the release.
             * After 1 second, emit that the user as not typing at longer. 
             * Useful for displaying the typing indicator to the other connected users.
             */
            messageInput.addEventListener('keyup', this.debounce( () => {
                this._socket.emit('usernottyping', { userId: this.userId });
            }, 1000));

            /**
             * If we received an event indicating that a user is typing, display 
             * the typing indicator if it's not the current user.
             * TODO: Handle specific users typing.
             */
            this._socket.on('istyping', (data) => {
                if (data.userId !== this.userId) {
                    this.isTyping = true;
                }
            });

            /**
             * If we received an event indicating that a user has stopped typing,
             * stop displaying the typing indicator if it's not the current user.
             * TODO: Handle specific users typing.
             */
            this._socket.on('nottyping', (data) => {
                if (data.userId !== this.userId) {
                    this.isTyping = false;
                }
            });

            /**
             * Utility socket event to display the chat data for demo
             * purposes only.
             */
            this._socket.on('output', (data) => {
            // eslint-disable-next-line no-console
            console.log('on output', data);
            });
    
             /**
             * Setting various messages received back from the socket connection.
             */
            this._socket.on('status', (data) => {
                if (data.success) {
                    messageInput.value = '';
                    this.message = data.message;
                    this.messageResetDelay('message');
                    this.error = '';
                } else if (!data.success) {
                    this.error = data.message;
                    this.messageResetDelay('error');
                    this.message = '';
                }
            })
            // var playSound = new Audio(this.noficationAudio);
            // playSound.load();
            // playSound.play();
            /**
             * If we're told that a message was sent to the chatroom,
             * refresh the stale messages data.
             */
            this._socket.on('chatupdated', () => {
                return refreshApex(this.wiredMessages1);
            });

            this._socket.on('refreshChatUsers', () => {
                return refreshApex(this.masterData);
            });
        }
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
        this.dispatchEvent(new CustomEvent('close'));
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
fileContents;
fileReader;
content;
fileName;
msg;

@track name = '';

onNameChange(event) {  
    this.name = event.detail.value;  
  }  


    onFileUpload(event) {  

    if (event.target.files.length > 0) {  

        this.uploadedFiles = event.target.files;  

        this.fileName = event.target.files[0].name;  

        this.file = this.uploadedFiles[0];  

        if (this.file.size > this.MAX_FILE_SIZE) {  

        alert("File Size Can not exceed" + MAX_FILE_SIZE);  
        }  
    }  
    }

    handleSearchInputChange(event) {
     this.searchParam = event.target.value;

    }
    handleSearchButtonClick() {
        searchmsg({ searchParam: this.searchParam })
    .then(result => {
     this.searchResult = result;

            })

            .catch(error => {
                console.error(error);

            });
         }

inputmsgg ='';
    Sendmsg() {  

        try {
          this.fileName = 'File';
          this.fileReader = new FileReader();  

          this.fileReader.onloadend = (() => {  

          this.fileContents = this.fileReader.result;  

          let base64 = 'base64,';  

          this.content = this.fileContents.indexOf(base64) + base64.length;  

          this.fileContents = this.fileContents.substring(this.content);  

          this.saveRecord();  
         this.name='';

        });  

        this.fileReader.readAsDataURL(this.file);

      } catch (e) {

        this.saveRecord();

      }
      
    }  
       

      saveRecord() {  
      var con = {  

          'sobjectType': 'Chat_message__c',  

          'Content__c': this.name,
          'To_User__c' : this.toUserOrGroupId, 
          'User__c' : this.userId,

        } 
         

        console.log(con);  

 

        saveMsgRecord({  

                contactRec:con,

                file: encodeURIComponent(this.fileContents),

                fileName: this.fileName

              })

             

              .then(()=>{
                this.msgValue = '';
                refreshApex(this.wiredMessages1);

                console.log('done');

               

              })

              .catch(()=>{

                console.log('error');

              });

               

            }
}