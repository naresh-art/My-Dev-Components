import { LightningElement, track } from 'lwc';
import createContactAndSendEmail from '@salesforce/apex/ContactEmailController.createContactAndSendEmail';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactEmailLwc extends LightningElement {
    @track firstName = '';
    @track lastName = '';
    @track email = '';

    handleChange(event) {
        const field = event.target.dataset.field;
        if (field === 'FirstName') {
            this.firstName = event.target.value;
        } else if (field === 'LastName') {
            this.lastName = event.target.value;
        } else if (field === 'Email') {
            this.email = event.target.value;
        }
    }

    handleCreateContact() {
        if (!this.firstName || !this.lastName || !this.email) {
            this.showToast('Error', 'All fields are required!', 'error');
            return;
        }

        createContactAndSendEmail({ firstName: this.firstName, lastName: this.lastName, email: this.email })
            .then(() => {
                this.showToast('Success', 'Contact created and email sent successfully!', 'success');
                this.firstName = '';
                this.lastName = '';
                this.email = '';
            })
            .catch(error => {
                this.showToast('Error', 'Error creating contact or sending email: ' + error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant
        }));
    }
}
