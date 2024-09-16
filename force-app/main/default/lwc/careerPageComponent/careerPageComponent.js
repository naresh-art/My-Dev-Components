import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/CareerPageController.getAccounts';
import getPicklistValues from '@salesforce/apex/CareerPageController.getPicklistValues';
import createContact from '@salesforce/apex/CareerPageController.createContact';
import uploadFile from '@salesforce/apex/CareerPageController.uploadFile';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CareerPageComponent extends LightningElement {
    @track jobOfferRecords;
    @track selectedJobOfferId;
    @track selectedJobOffer;
    @track isActionModalOpen = false;
    @track isViewDetailsModalOpen = false;
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track phone = '';

    @track availabilityOptions = [];
    @track selectedAvailability = '';

    @track scoreOptions = [];
    @track selectedScore = '';

    @track sourceOptions = [];
    @track selectedSource = '';

    @track fileName = '';
    fileData;
    @track isSpinnerVisible = false;

    get columns() {
        return [
            { label: 'Job Offer Name', fieldName: 'Name' },
            { label: 'Job Experience', fieldName: 'Experience' },
            { label: 'Job_Loaction', fieldName: 'JobLoaction' },
            {
                label: 'Action',
                type: 'button',
                typeAttributes: {
                    label: 'View Job Details',
                    name: 'view_Job_Details',
                    variant: 'brand',
                    class: 'slds-m-left_small'
                }
            },
            {
                label: 'Action',
                type: 'button',
                typeAttributes: {
                    label: 'Apply Job',
                    name: 'apply_contact',
                    variant: 'brand',
                    class: 'slds-m-left_small'
                }
            }
        ];
    }

    connectedCallback() {
        // Dynamically load multiple picklists
        this.loadPicklistValues('Contact', 'LeadSource', 'availabilityOptions');
        this.loadPicklistValues('Contact', 'Level__c', 'scoreOptions');
        this.loadPicklistValues('Contact', 'ContactSource', 'sourceOptions');
    }

    // Load picklist values dynamically based on object and field
    loadPicklistValues(objectName, fieldName, target) {
        getPicklistValues({ objectName, fieldName })
            .then(result => {
                this[target] = result.map(option => {
                    return { label: option, value: option };
                });
            })
            .catch(error => {
                console.error(`Error fetching picklist ${fieldName}: `, error);
            });
    }

    @wire(getAccounts)
    wiredJobOfferRecords({ error, data }) {
        if (data) {
            this.jobOfferRecords = data.map(record => ({
                Id: record.Id,
                Name: record.Name,
                Experience: record.Experience__c,
                JobLoaction: record.Job_Loaction__c,
                JobDescription: record.Job_Description__c,
            }));
        } else if (error) {
            console.error('Error retrieving jobOfferRecords', error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        this.selectedJobOfferId = event.detail.row.Id;
        this.selectedJobOffer = this.jobOfferRecords.find(record => record.Id === this.selectedJobOfferId);
        if (actionName === 'view_Job_Details') {
            this.isViewDetailsModalOpen = true;
        } else if (actionName === 'apply_contact') {
            this.isActionModalOpen = true;
        }
    }

    closeModal() {
        this.isViewDetailsModalOpen = false;
        this.isActionModalOpen = false;
    }

    handleFieldChange(event) {
        const field = event.target.name;
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        } else if (field === 'email') {
            this.email = event.target.value;
        } else if (field === 'phone') {
            this.phone = event.target.value;
        } else if (field === 'availability') {
            this.selectedAvailability = event.target.value;
        } else if (field === 'score') {
            this.selectedScore = event.target.value;
        } else if (field === 'source') {
            this.selectedSource = event.target.value;
        }
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = () => {
            this.fileData = reader.result.split(',')[1]; // Extract Base64 file content
        };
        reader.readAsDataURL(file);
    }

    handleSubmit() {
        this.isSpinnerVisible = true; // Show spinner
        const contacts = {
            FirstName: this.firstName,
            LastName: this.lastName,
            Email: this.email,
            Phone: this.phone,
            LeadSource: this.selectedAvailability,
            Level__c: this.selectedScore,
            ContactSource: this.selectedSource
        };

        createContact({ contacts, accountId: this.selectedJobOfferId })
            .then(result => {
                if (this.fileData) {
                    uploadFile({ jobApplicationId: result.Id, fileName: this.fileName, fileBody: this.fileData })
                        .then(() => {
                            this.showToast('Success', 'Job application and file uploaded successfully!', 'success');
                            this.isActionModalOpen = false;
                            this.isSpinnerVisible = false;
                        })
                        .catch(error => {
                            this.showToast('Error', 'Error uploading file: ' + error.body.message, 'error');
                            this.isSpinnerVisible = false;
                        });
                }
            })
            .catch(error => {
                this.showToast('Error', 'Error creating job application: ' + error.body.message, 'error');
                this.isSpinnerVisible = false;
            });
    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(toastEvent);
    }
}
