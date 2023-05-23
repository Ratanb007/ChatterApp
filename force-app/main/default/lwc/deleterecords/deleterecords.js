import { LightningElement,wire,api } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import displayAccounts from '@salesforce/apex/ApexController.displayAccounts';

export default class Deleterecords extends LightningElement {
    @api currentRecordId;
    @api error;
    @wire(displayAccounts) accounts;
    handleChange(event){
        this.currentRecordId=event.target.value;
        console.log('@@@current RecordId@@@'+this.currentRecordId);
    }
    handleDelete(){
        deleteRecord(this.currentRecordId)
        .then(() => {
            return refreshApex(this.accounts);
        })
        .catch((error) => {
           this.error=error;
           console.log('unable to delete the record due to'+JSON.stringify(this.error));
        });
    }
}