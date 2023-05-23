import { LightningElement, track } from 'lwc';

export default class DemoExpandCheck extends LightningElement {
    @track isExpanded = false;
  
    get wrapperClass() {
      return `wrapper ${this.isExpanded ? 'expanded' : ''}`;
    }
  
    get buttonLabel() {
      return this.isExpanded ? 'Shrink' : 'Expand';
    }
  
    toggleSize() {
      this.isExpanded = !this.isExpanded;
    }
}