import { LightningElement,wire,track} from 'lwc';
import getGroupList from '@salesforce/apex/groupclass.getGroupList';
//import createRecord from '@salesforce/apex/groupclass.createRecord';
import { createRecord } from 'lightning/uiRecordApi';
import Group_OBJECT from '@salesforce/schema/groupforTesting__c'; 
import NAME_FIELD from '@salesforce/schema/groupforTesting__c.Name'; 




export default class Groupchat extends LightningElement {

    
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


            @track isModalOpen = false;

            getAllSelectedRecord() {  
                  this.isModalOpen = true;
         }

    closeModal() {  
        this.isModalOpen = false;
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
    
        
    
        //create group button
        getAllSelectedRecord() {
            //first column checkbox selected records
            let firstColumnSelectedRecord = [];
            let firstColumnCheckboxRows = this.template.querySelectorAll('lightning-input[data-key="firstColumnCheckbox"]');
    
            firstColumnCheckboxRows.forEach(row => {
                if (row.type == 'checkbox' && row.checked) {
                    firstColumnSelectedRecord.push(row.dataset.id);
                    console.log('hello', this.firstColumnSelectedRecord);
                }
            })
         console.log('multiple selected Record : ' + JSON.stringify(firstColumnSelectedRecord));
       
         
    }


       
        
 
   
    /* input field data show on group object*/
    name ='';
    handleNameChange(event){
        this.name = event.target.value;
   }
   
  
   onCreateRecord(){

    const fields ={};
    fields[NAME_FIELD.fieldApiName] = this.name;

    const recordInput = {apiName : Group_OBJECT.objectApiName , fields};
    createRecord(recordInput)
    .then(account => {
        console.log("group:"+JSON.stringify(account))
    })
    .catch(error =>{
        console.error("error:"+JSON.stringify(error))
    })
   }

   
    
    
    




/*
    groups;
    error;

    buttonClick(){
        getGroupList()
        .then((result) =>{
            this.groups = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.groups = undefined;
        });
    }

accounts;
error;
connectedCallback(){
    displayAccounts()
    .then(result=>{
        this.accounts=result;
        this.error=undefined;
    })
    .catch(error=>{
        this.error=error;
        this.accounts=undefined;
    }); 
}
*/

  /*
    @track groups;
    @track selectedGroup;
    @track error;

    buttonClick() {
        getGroupList()
            .then((result) => {
                this.groups = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.groups = undefined;
            });
    }

    handleRadioChange(event) {
        this.selectedGroup = event.detail.value;
    }
}
*/







}