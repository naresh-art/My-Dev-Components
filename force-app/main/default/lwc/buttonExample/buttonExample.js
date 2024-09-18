import { LightningElement } from 'lwc';

export default class ButtonExample extends LightningElement {
    navigateToLink() {
        // window.open('https://ddm000006rcsvuas-dev-ed.develop.my.site.com/CustomerService/s/comapny-page', '_blank');
        window.location.href = 'https://ddm000006rcsvuas-dev-ed.develop.my.site.com/CustomerService/s/comapny-page';
    }
}

