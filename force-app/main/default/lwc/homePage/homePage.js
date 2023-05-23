import { LightningElement } from 'lwc';
import backgroundUrl from '@salesforce/resourceUrl/BackGroundImage';
import newimage from '@salesforce/resourceUrl/ChatIcon';

export default class HomePage extends LightningElement {

   
    imageUrl = backgroundUrl;
    chaticon =newimage;
}