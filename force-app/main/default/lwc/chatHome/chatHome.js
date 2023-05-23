import { LightningElement, api, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import USER_ID from '@salesforce/user/Id';

import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getAllUsersAndGroups from '@salesforce/apex/ChatHomeController.getAllUsersAndGroups';
import getCurrentUsersAndGroups  from '@salesforce/apex/ChatHomeController.getCurrentUsersAndGroups';
//import getGroupList from '@salesforce/apex/ChatHomeController.getGroupList';

import getGroupList from '@salesforce/apex/ChatHomeController.getGroupList';
import groupRec from '@salesforce/apex/ChatHomeController.groupRec';



import { createRecord } from 'lightning/uiRecordApi';
import Group_OBJECT from '@salesforce/schema/Group__c'; 
import NAME_FIELD from '@salesforce/schema/Group__c.Name'; 
import threeDot from '@salesforce/resourceUrl/threeDot';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = [
    'User.Name',
    'User.Image__c'
];
//import GROUP_MEMBER_NAME_FIELD  from '@salesforce/schema/Group__c.Group_Member_Name__c';

export default class ChatHome extends LightningElement 
{
    name;
    imageURL;

    threedotIcon=threeDot;

    @track arrayMultipleList = [];


    @track Minimize = false;

    @api userId = USER_ID;
    @api timeString;
    @api message;
    @api error;
    @api isChatActive = false;
    @api isTyping = false;
    @api toName;
    @api toimgurl;
    @api toIcon;
    @api seen;
    result;
    currentresult;

    @api login
    showChatWindow=false;
    _socketIoInitialized = false;
    _socket;
    toUserOrGroupId;
    messages;
    masterData;
    currentUserData;

    @api showSpinner=false;
    @track masterUsers=[];
    @track currentMasterUsers=[];
    @track currentMasterUsersObject={};

    connectedCallback()
    {
        getAllUsersAndGroups({})
        .then(data=>{
            this.masterData=data;
            this.result=JSON.parse(this.masterData);
            this.masterUsers = JSON.parse(this.masterData);
            console.log('helllo'+ JSON.stringify(this.masterData));
        })
        .catch(err=>{
            console.log(err);
        })
        getCurrentUsersAndGroups({})
        .then(data=>{
            this.currentMasterUsers = JSON.parse(data);
            this.currentMasterUsersObject=this.currentMasterUsers[0]
            console.log('helllouser'+ data,JSON.stringify(this.currentMasterUsersObject));
        })
        .catch(err=>{
            console.log(err);
        })
    }
    refershh(){
        this.connectedCallback();
        console.log('hi');
       
    }

    handleSearchInputChange(event) {
        var searchStrng = event.target.value;
        this.ChatName = searchStrng;
        this.searchStrng = searchStrng;
        this.result = [];
      
        if (this.masterUsers != undefined && this.masterUsers.length > 0) {
          for (let i = 0; i < this.masterUsers.length; i++) {
            if (this.masterUsers[i].userName.toLowerCase().includes(searchStrng.toLowerCase())) {
              this.result.push(this.masterUsers[i]);
            }
          }
        }
      }

    // handleSearchInputChange(event) {
    //     this.searchParam = event.target.value;
   
    //    }
    //    handleSearchInputChange() {
    //     searchBeer({ searchParam: this.searchParam })
    //    .then(result => {
    //     this.searchResult = result;
   
    //            })
   
    //            .catch(error => {
    //                console.error(error);
   
    //            });
    //         }

    handleChatNav()
    {
        let infoModal = this.template.querySelector('.chatroom__container');
        infoModal.classList.toggle("increaseWidth")
        this.showChatWindow=false;
    }

    handleChat(event)
    {
        // alert('hdgdf')
        this.showSpinner=true;
        this.toUserOrGroupId=event.target.dataset.id;
        this.toName=event.target.dataset.name;
        this.toimgurl = event.target.dataset.icon;
        this.toIcon=event.target.dataset.icon;
       
        this.seen=event.target.dataset.value;
        console.log('this.seen'+this.seen);
        this.login = event.target.dataset.title;
        console.log(' this.login'+ this.login);
        console.log('userOrGroupId',this.toUserOrGroupId);
        // this.template.querySelector('lightning-flow').startFlow('chatMessage', {
        //     toUserOrGroupId:this.toUserOrGroupId,
        //     toName:this.toName,
        //     toimgurl:this.toimgurl,
        //     toIcon:this.toIcon,
        //     seen:this.seen,
        //     login:this.login,
        //     minimize:false
        // });

        if(this.arrayMultipleList.length === 3){
            // alert('hellooooo')
            // this.arrayMultipleList.slice(2,1);
        }else{
        this.arrayMultipleList.push({
            expand:false,
            userId : this.userId,
            toUserOrGroupId:event.target.dataset.id,
            toName:event.target.dataset.name,
            toimgurl:event.target.dataset.icon,
            toIcon:event.target.dataset.icon,
            seen:event.target.dataset.value,
            login:event.target.dataset.title,
            minimize:false
        })
        this.template.querySelector('[data-value="chaterMainDiv"]').classList.add('chatroom__FirstDiv');
        this.template.querySelector('[data-value="chaterMainDiv"]').classList.remove('chatroom__SecoundDiv');

    }
    console.log('hello  list '+ JSON.stringify(this.arrayMultipleList));

        this.showChatWindow=true;
        this.showSpinner=false;
    }

    hideChat(event)
    {
        if(this.arrayMultipleList.length==1){
            this.showChatWindow= false;
            this.arrayMultipleList=[];
        }
        else{
            for (let index = 0; index < this.arrayMultipleList.length; index++) {
                const element = this.arrayMultipleList[index];
                if(String( element.toUserOrGroupId)===String( event.detail.id)){

                    this.arrayMultipleList.splice(index,1)
                    console.log('elementlog',JSON.stringify( this.arrayMultipleList));

                }
                
            }
        }
        // alert('hh'+event.detail.id)
        console.log('hehehe'+ event.detail.id);

        // this.showChatWindow=false;
    }

    zoomExpandScreen(event){
        console.log('hehehe'+ event.detail.id);
        for (let index = 0; index < this.arrayMultipleList.length; index++) {
            const element = this.arrayMultipleList[index];
            if(String( element.toUserOrGroupId)===String( event.detail.id)){

                this.arrayMultipleList[index].expand=element.expand?false:true;
                console.log('elementlog',JSON.stringify( this.arrayMultipleList));

            }
            else{
                this.arrayMultipleList[index].expand=false;

            }
            
        }

    }


    handleSpinner()
    {
        this.showSpinner=false;
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
    
    get className(){
        //if changeStle is true, getter will return class1 else class2
          return this.Minimize ?'chatroom__containerMinimize slds-grid slds-grid_vertical  chatroom__home'
          :
          'chatroom__container slds-grid slds-grid_vertical slds-border_top slds-border_bottom slds-border_left slds-border_right chatroom__home';
      }

    //   get popupone(){
    //     return this.arrayMultipleList==0?' position: absolute;right: 10%;':' position: absolute;right: 6%;';
      
        
    //     //if changeStle is true, getter will return class1 else class2
    //     //   return this.toMinimize ?'chatMsgChaMinimize chatPosCls slds-border_left slds-border_bottom slds-border_top slds-border_right': 'chatMsgCha chatPosCls slds-border_left slds-border_bottom slds-border_top slds-border_right';
    //   }
      get IconValue(){
        //if changeStle is true, getter will return class1 else class2
          return this.Minimize ?'utility:chevronup'
          :
          'utility:chevrondown';
      }
    handleMinimize(){
        this.Minimize=this.Minimize?false:true;
    }

    //For group chat
    
    data = [];
    error;
    @track isShowModal = false;

    
    
   
    @track selectedRecordIds = [];
    
    buttonClick(){
        getGroupList()
        .then((data)=> {
                this.data = data;
                this.isShowModal = true;
                this.error = undefined;

            }) .catch((error) =>{
                this.error = error;
                //this.isShowModal = false;
                this.data = data;
            });
        }
        hideModalBox() {  
            this.isShowModal = false;
        }

    //select single checkbox
    handleCheckboxSelect(event) {
        let selectedRows = this.template.querySelectorAll('lightning-input[data-key="firstColumnCheckbox"]');
        let allSelected = true;

        selectedRows.forEach(currentItem => {
            if (!currentItem.checked && currentItem.type === 'checkbox') {
                allSelected = false;
            }
        });

    }

    //Select/unselect all rows
    handleAllSelected(event) {
        let selectedRows = this.template.querySelectorAll('lightning-input[data-key="firstColumnCheckbox"]');

        selectedRows.forEach(row => {
            if (row.type == 'checkbox') {
                row.checked = event.target.checked;
            }
        });
    }

    
    @track userData = [];
    //create group button
    @track isModalOpen = false;
    getAllSelectedRecord() {
        //first column checkbox selected records
        this.isModalOpen = true;
        //this.isShowModal = false;
                       
        let firstColumnSelectedRecord = [];
        let firstColumnCheckboxRows = this.template.querySelectorAll('lightning-input[data-key="firstColumnCheckbox"]');
        firstColumnCheckboxRows.forEach(row => {
            if (row.type == 'checkbox' && row.checked) {
                firstColumnSelectedRecord.push(row.dataset.id);
            }
            
        })
        
        
     console.log('multiple selected Record : ' + JSON.stringify(firstColumnSelectedRecord));  
     this.userData = firstColumnSelectedRecord; 


}

//single selected checkbox record

closeModal() {  
    this.isModalOpen = false;
   
}




@api name;


handleNameChange(event) {
this.name = event.detail.value;}


createGroup(event){
//console.log('userData'+JSON.stringify(this.firstColumnSelectedRecord) );

groupRec({grpNames : this.name,checkdata: this.userData})

.then(result => {
    const event = new ShowToastEvent({
        title: 'Group created',
        message: 'New Group  '+ this.name +' created.',
        variant: 'success'
        
    });
    
    this.dispatchEvent(event);
})
.then(()=>{
    this.closeModal()
    this. hideModalBox()

 })
.then(()=>{
  
    window.location.reload()

 })
.catch(error => {
    const event = new ShowToastEvent({
        title : 'Error',
        message : 'Error creating Group. Please Contact System Admin',
        variant : 'error'
    });
    this.dispatchEvent(event);
});
}


/* input field data show on group object
name ='';

handleNameChange(event){
    this.name = event.target.value;
}
createGroup(){
console.log('userData'+JSON.stringify(this.userData) );


const fields ={};

fields[NAME_FIELD.fieldApiName] = this.name;
//fields[GROUP_MEMBER_NAME_FIELD.fieldApiName] = this.userData;
const recordInput = {apiName : Group_OBJECT.objectApiName , fields};


createRecord(recordInput)
  .then((result) => {
    console.log('Group created with Id: ' + result.id);
  })
  .catch((error) => {
    console.error('Error creating group: ' + JSON.stringify(error));
  });

}




@track listVisible = false;

get listVisibleClass() {
  return this.listVisible ? 'show' : 'hide';
}

handleImageClick() {
    this.listVisible = !this.listVisible;
  }*/

}