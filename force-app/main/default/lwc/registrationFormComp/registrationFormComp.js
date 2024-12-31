import { LightningElement, track } from 'lwc';
import createConsultantRecord from '@salesforce/apex/ConsultantController.createConsultantRecord';
import getPicklistValues from '@salesforce/apex/ConsultantController.getPicklistValues';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RegistrationFormComp extends LightningElement {
    @track showForm = false;
    @track currentDate = new Date().toLocaleDateString();
    @track showSpinner = false; // Spinner visibility
    @track showOtherStatusField = false;
    @track showOtherTechnologyField = false;

    formData = {};
    genderOptions=[];
    willingOptions=[];
    driveOptions=[];
    internationalOptions=[];
    currentStatusOptions=[];
    visaStatusOptions=[];
    technologyOptions=[];

    connectedCallback() {
        this.fetchPicklistValues('Consultant__c', 'Gender__c', 'genderOptions');
        this.fetchPicklistValues('Consultant__c', 'Willing_to_Relocate__c', 'willingOptions');
        this.fetchPicklistValues('Consultant__c', 'Can_Drive__c', 'driveOptions');
        this.fetchPicklistValues('Consultant__c', 'International_Student__c', 'internationalOptions');
        this.fetchPicklistValues('Consultant__c', 'Current_Status__c', 'currentStatusOptions');
        this.fetchPicklistValues('Consultant__c', 'Visa_Status__c', 'visaStatusOptions');
        this.fetchPicklistValues('Consultant__c', 'Technology_Expertise__c', 'technologyOptions');
    }

    fetchPicklistValues(objectName, fieldName, targetProperty) {
        getPicklistValues({ objectName, fieldName })
            .then((result) => {
                this[targetProperty] = result;
            })
            .catch((error) => {
                console.error('Error fetching picklist values:', error);
            });
    }

    handleStart() {
        this.showForm = true;
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        this.formData[name] = value;
    }

    handleStatusChange(event) {
        this.showOtherStatusField = event.detail.value === 'Other';
        this.formData['currentStatus'] = event.detail.value;
    }

    handleTechnologyChange(event) {
        this.showOtherTechnologyField = event.detail.value === 'Other';
        this.formData['technology'] = event.detail.value;
    }

    validateFields() {
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-radio-group')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        return allValid;
    }

    handleSubmit() {
        if (!this.validateFields()) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please complete all required fields.',
                    variant: 'error'
                })
            );
            return;
        }

        this.showSpinner = true; // Show spinner
        createConsultantRecord({ formData: this.formData })
            .then((result) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Consultant record created successfully!',
                        variant: 'success'
                    })
                );
                this.formData = {};
                this.showForm = false;
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            })
            .finally(() => {
                this.showSpinner = false; // Hide spinner
            });
    }
}
