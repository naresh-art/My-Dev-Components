import { LightningElement, track } from 'lwc';

export default class ExpandableSection extends LightningElement {
    @track isContentVisible = false;
    @track isContentVisible1 = false;
    @track isContentVisible2 = false;

    get buttonLabel() {
        return this.isContentVisible ? '− Hide Content' : '+ Show Content';
    }
    get buttonLabel1() {
        return this.isContentVisible1 ? '− Hide Content1' : '+ Show Content1';
    }
    get buttonLabel2() {
        return this.isContentVisible2 ? '− Hide Content2' : '+ Show Content2';
    }

    toggleContent() {
        this.isContentVisible = !this.isContentVisible;
    }
    toggleContent1() {
        this.isContentVisible1 = !this.isContentVisible1;
    }
    toggleContent2() {
        this.isContentVisible2 = !this.isContentVisible2;
    }
}