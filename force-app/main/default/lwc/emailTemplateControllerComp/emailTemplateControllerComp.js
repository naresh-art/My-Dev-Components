import { LightningElement, wire, track } from 'lwc';
import getEmailTemplatesByFolderId from '@salesforce/apex/EmailTemplateController.getEmailTemplatesByFolderId';
import getPDRecordsByUserId from '@salesforce/apex/EmailTemplateController.getPDRecordsByUserId';
import sendEmails from '@salesforce/apex/EmailTemplateController.sendEmails';
import USER_ID from '@salesforce/user/Id';
import getCurrentUserEmail from '@salesforce/apex/EmailTemplateController.getCurrentUserEmail'; // Import Apex method to get user email
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { CloseActionScreenEvent } from 'lightning/actions';
import getEmailTemplateWithData from '@salesforce/apex/EmailTemplateController.getEmailTemplateWithData';
import sendTestEmail from '@salesforce/apex/EmailTemplateController.sendTestEmail';
import getProfile from '@salesforce/apex/EmailTemplateController.getProfile'; // Import a new Apex method to get the user's profile
import getLeadSourcePicklistValues from '@salesforce/apex/EmailTemplateController.getLeadSourcePicklistValues';
import getLevelPicklistValues from '@salesforce/apex/EmailTemplateController.getLevelPicklistValues';
export default class emailTemplateControllerComp extends LightningElement {
    @track emailTemplates = [];
    @track pdRecords = [];
    @track selectedPdRecords = [];
    @track selectedTemplateId;
    @track selectedPdRecordIds = [];

    @track emailPreview = '';
    @track userEmail = '';  // Track for storing user email
    @track isEditing = false; // For enabling edit mode
    @track editedEmailBody = ''; // Stores the modified email body
    @track editedEmailBodyUpdatedText = '';

    @track ccAddresses = ''; // Field to capture CC addresses
    @track bccAddresses = ''; // Field to capture BCC addresses
    @track showCcBccFields = false; // Control visibility of CC/BCC fields

    handleCcBccFields() {
        this.showCcBccFields = !this.showCcBccFields;
    }
    handleCcChange(event) {
        this.ccAddresses = event.target.value;
    }

    handleBccChange(event) {
        this.bccAddresses = event.target.value;
    }

    // Step control
    isStep1 = true;
    isStep2 = false;
    isStep3 = false;
    isStep4 = false;

    @track isSearch = false;
    @track isSearchPrevious = false;
    @track selectedUserId;
    @track USER_ID = USER_ID;

    @track leadSource = '';  // Default value
    @track genderIdentity;

    // Loading spinner
    isLoading = false;

    // Columns for PD Records table
    columns = [
        {
            label: 'Account Name', fieldName: 'Account_Name', type: 'text', cellAttributes: {
                style: { fieldName: 'rowStyle' }  // Apply style inline
            }
        },
        {
            label: 'First Name', fieldName: 'FirstName', type: 'text', cellAttributes: {
                style: { fieldName: 'rowStyle' }  // Apply style inline
            }
        },
        {
            label: 'Last Name', fieldName: 'LastName', type: 'text', cellAttributes: {
                style: { fieldName: 'rowStyle' }  // Apply style inline
            }
        },
        {
            label: 'Account Email', fieldName: 'Account_Email', type: 'text', cellAttributes: {
                style: { fieldName: 'rowStyle' }  // Apply style inline
            }
        },
        {
            label: 'Phone', fieldName: 'Phone', type: 'phone', cellAttributes: {
                style: { fieldName: 'rowStyle' }  // Apply style inline
            }
        },

    ];

    // Function to check the user's profile 	PD Operations PD Specialists System Administrator
    checkUserProfile() {
        getProfile()
            .then(profileName => {
                console.log('Profile Name:' + profileName);
                if (profileName === 'PD Operations') {
                    this.isSearch = true;
                    this.isStep2 = false;
                    this.isSearchPrevious = true;
                } else {
                    this.isSearch = false;
                    this.isStep2 = true;
                    this.isSearchPrevious = false;
                }
                console.log('isSearch value after profile check:', this.isSearch);
                console.log('isSearchPrevious value after profile check:', this.isSearchPrevious);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }

    handleSelectedUser(event) {
        this.selectedUserId = event.detail.id;
    }

    // Fetch current user's email
    @wire(getCurrentUserEmail)
    wiredUserEmail({ data, error }) {
        if (data) {
            this.userEmail = data;
        } else {
            console.error('Error fetching user email:', error);
        }
    }

    // Fetch email templates based on folder ID
    @wire(getEmailTemplatesByFolderId, { folderId: '00ldM000007LRxFQAW' })
    wiredEmailTemplates({ data, error }) {
        if (data) {
            this.emailTemplates = data.map(template => ({
                label: template.Name,
                value: template.Id
            }));
        } else if (error) {
            console.error('Error fetching email templates:', error);
        }
    }

    @track LeadSourceOptions = [];
    @wire(getLeadSourcePicklistValues)
    wiredLeadSourcePicklistValues({ error, data }) {
        if (data) {
            this.LeadSourceOptions = data.map(item => ({ label: item, value: item }));
        } else if (error) {
            console.error('Error fetching Role picklist values:', error);
        }
    }

    @track LevelOptions = [];
    @wire(getLevelPicklistValues)
    wiredLevelPicklistValues({ error, data }) {
        if (data) {
            this.LevelOptions = data.map(item => ({ label: item, value: item }));
        } else if (error) {
            console.error('Error fetching Role picklist values:', error);
        }
    }

    // Fetch PD records based on user type (System Admin or regular user)
    fetchPDRecords() {
        this.isLoading = true;  // Start loading
        const userIdToUse = this.isSearchPrevious ? this.selectedUserId : USER_ID;
        console.log('userIdToUse value after profile check:', userIdToUse);
        getPDRecordsByUserId({
            userId: userIdToUse, leadSource: this.leadSource,
            genderIdentity: this.genderIdentity
        })
            .then(data => {
                this.pdRecords = data.map((pdRec, index) => ({
                    ...pdRec,
                    Account_Name: pdRec.AccountId ? pdRec.Account.Name : '',
                    Account_Email: pdRec.AccountId ? pdRec.Account.Email__c : '',
                    rowStyle: index % 2 === 0
                        ? 'background-color: #8ad8f2;'
                        : 'background-color: #b3f2ea;'
                }));
                this.isLoading = false;  // Stop loading
                this.error = undefined;
            })
            .catch(error => {
                this.isLoading = false;  // Stop loading
                this.error = error;
                this.pdRecords = undefined;
                console.error('Error fetching PD records:', error);
            });
    }

    // Event handlers for filter inputs
    handleLeadSourceChange(event) {
        this.leadSource = event.detail.value;
    }

    handleGenderIdentityChange(event) {
        this.genderIdentity = event.detail.value;
    }

    clearFilters() {
        this.leadSource = '';
        this.genderIdentity = '';
        this.fetchPDRecords(); // Re-fetch all records without filters
    }


    handleTemplateChange(event) {
        this.selectedTemplateId = event.detail.value;
        this.editedEmailBodyUpdatedText = ''; // Clear any previous edits when changing template
        this.fetchEmailPreview(); // Reload preview for the new template
    }

    handleRowSelection(event) {
        this.selectedPdRecords = event.detail.selectedRows;
        console.log('selected Pd Records::' + JSON.stringify(this.selectedPdRecords));
        this.selectedPdRecordIds = this.selectedPdRecords.map(record => record.Id);
        console.log('selected Pd Record Ids::' + JSON.stringify(this.selectedPdRecordIds));
    }

    fetchEmailPreview() {
            getEmailTemplateWithData({ templateId: this.selectedTemplateId})
                .then(result => {
                    // Remove the `]]>` symbol from the result content
                    const cleanedResult = result.replace(/]]>/g, '');

                    this.emailPreview = this.formatEmailContent(cleanedResult);
                    this.editedEmailBody = this.stripHtmlTags(cleanedResult || '');
                    this.editedEmailBodyUpdatedText = '';
                })
                .catch(error => {
                    console.error('Error fetching email template preview:', error);
                });
    }

    handleEditEmail() {
        // Initialize the editedEmailBody with the current preview content
        this.editedEmailBodyUpdatedText = this.editedEmailBody;
        this.isEditing = true;
    }

    handleEmailChange(event) {
        // Capture the modified email body from the rich text editor
        this.editedEmailBodyUpdatedText = event.target.value;
    }

    handlePreviewEditedEmail() {
        this.emailPreview = this.formatEmailContent(this.editedEmailBodyUpdatedText || this.editedEmailBody);
        this.editedEmailBody = this.editedEmailBodyUpdatedText;
        this.isEditing = false;
    }

    get trimmedEmailBody() {
        return this.editedEmailBodyUpdatedText.trim();
    }

    handleNext() {
        if (this.isStep1) {
            this.isStep1 = false;
            this.isStep2 = true;
        } else if (this.isStep2) {
            if (!this.selectedTemplateId) {
                // Show error if no template is selected
                this.showToast('Error', 'Please select an email template to proceed.', 'error');
                return;
            }
            this.isStep2 = false;
            this.isStep3 = true;
            this.fetchPDRecords();
        } else if (this.isStep3) {
            if (this.selectedPdRecords.length === 0) {
                // Show error if no PD record is selected
                this.showToast('Error', 'Please select at least one PD record to proceed.', 'error');
                return;
            }
            this.isStep3 = false;
            this.isStep4 = true;
            // Check if edited content exists; if yes, use it
            if (this.editedEmailBodyUpdatedText) {
                this.emailPreview = this.formatEmailContent(this.editedEmailBodyUpdatedText);
            } else {
                this.fetchEmailPreview(); // Fetch fresh preview only if no edits exist
            }
        }
    }

    handlePrevious() {
        if (this.isStep4) {
            this.isStep4 = false;
            this.isStep3 = true;
        } else if (this.isStep3) {
            this.isStep3 = false;
            this.isStep2 = true;
        } else if (this.isStep2) {
            console.log('Current isSearch value in previous:', this.isSearch);
            console.log('Current isSearchPrevious value in previous:', this.isSearchPrevious);
            if (this.isSearchPrevious) {
                this.isSearch = true;
                this.isStep2 = false;
            } else {
                this.isStep1 = true;
                this.isStep2 = false;
            }
        } else if (this.isSearch) {
            this.isSearch = false;
            this.isStep1 = true;
        }
    }

    sendTestEmailHandler() {
        console.log('selected selectedPdRecords in Test Email::' + JSON.stringify(this.selectedPdRecords));
        console.log('selected selectedPdRecordIds in Test Email::' + JSON.stringify(this.selectedPdRecordIds));
        if (this.selectedTemplateId && this.selectedPdRecords.length > 0) {
            this.isLoading = true;
            sendTestEmail({
                templateId: this.selectedTemplateId,
                conRecord: this.selectedPdRecords[0],
                userEmail: this.userEmail,
                customBody: this.emailPreview  // Pass the edited email body
            })
                .then(() => {
                    this.isLoading = false;
                    this.showToast('Success', 'Test email sent successfully!', 'success');
                })
                .catch(error => {
                    this.isLoading = false;
                    this.showToast('Error', 'Error sending test email: ' + error.body.message, 'error');
                });
        } else {
            this.showToast('Error', 'No template or PD records selected', 'error');
        }
    }

    sendEmailHandler() {
        console.log('selected selectedPdRecords::' + JSON.stringify(this.selectedPdRecords));
        console.log('selected selectedPdRecordIds::' + JSON.stringify(this.selectedPdRecordIds));
        if (this.selectedTemplateId && this.selectedPdRecords.length > 0) {
            // Show loading spinner
            this.isLoading = true;

            // Prepare CC and BCC arrays only if there are values
            const ccAddressArray = this.ccAddresses ? this.ccAddresses.split(',').map(email => email.trim()) : null;
            const bccAddressArray = this.bccAddresses ? this.bccAddresses.split(',').map(email => email.trim()) : null;

            sendEmails({
                templateId: this.selectedTemplateId,
                conRecords: this.selectedPdRecords,
                customBody: this.emailPreview,
                ccAddresses: ccAddressArray,
                bccAddresses: bccAddressArray
            })
                .then(() => {
                    this.isLoading = false;
                    console.log('Emails sent successfully');
                    this.showToast('Success', 'Emails sent successfully!', 'success');
                    // this.closeQuickAction(); // Close the quick action after success
                    // Reload the page after sending the email
                    window.location.reload();
                })
                .catch(error => {
                    this.isLoading = false;
                    console.error('Error sending emails:', error);
                    this.showToast('Error', 'Error sending emails: ' + error.body.message, 'error');
                });
        } else {
            console.error('No template or PD records selected');
            this.showToast('Error', 'No template or PD records selected', 'error');
        }
    }

    formatEmailContent(content) {
        return `
            <div style="font-family: Arial, sans-serif; background-color: #f7f9fc; padding: 16px; color: #333;">
                <div style="border-left: 5px solid #005cb9; border-right: 5px solid #005cb9; background-color: #005cb9; padding: 10px; text-align: center; color: #f5f7f7;">
                    <h2 style="margin: 0; font-size: 1.5em;">PD Information</h2>
                </div>
                <div style="border-left: 20px solid #005cb9; border-right: 20px solid #005cb9; padding: 20px; background-color: #ffffff; color: #333;">
                    ${content}
                </div>
                <div style="border-left: 5px solid #005cb9; border-right: 5px solid #005cb9; background-color: #005cb9; padding: 10px; text-align: center; color: #f5f7f7;">
                    <p style="margin: 0;">© 2024 Curriculum Associates, LLC. All rights reserved.</p>
                </div>
            </div>`;
    }

    // Utility method to show toast notifications
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }

    stripHtmlTags(html) {
        // Remove CDATA symbols
        html = html.replace(/<!\[CDATA\[|\]\]>/g, '');
        
        // Replace <br> and <p> tags with appropriate newlines for formatting
        html = html.replace(/<br\s*\/?>/gi, '\n');
        html = html.replace(/<\/p>/gi, '\n\n');
        html = html.replace(/<p[^>]*>/gi, '');
        html = html.replace(/\n\s*\n/g, '\n\n'); // Ensures double newlines between paragraphs
    
        // Create a temporary DOM element to parse HTML
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
    
        // Traverse and reconstruct HTML content, retaining anchor tags
        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            }
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
                // Preserve <a> tags with their href attribute
                return `<a href="${node.getAttribute('href')}">${node.textContent}</a>`;
            }
            // Process child nodes recursively and join the text
            return Array.from(node.childNodes).map(child => processNode(child)).join('');
        };
    
        // Construct the plain text with preserved links
        let processedText = processNode(tmp);
    
        // Additional formatting for "Regards" section
        if (processedText.includes('Regards,')) {
            processedText = processedText.replace(/(Regards,)(\n\s*\n)+/g, '$1\n');
        }
    
        return processedText;
    }
    
    

    // closeQuickAction() {
    //     this.dispatchEvent(new CloseActionScreenEvent());
    // }

}
