// import { LightningElement, wire, track } from 'lwc';
// import getAccounts from '@salesforce/apex/AccountController.getAccounts';

// export default class AccountControllerDataTableComp extends LightningElement {
//     @track accounts;           // Stores account data
//     @track selectedAccount;     // Stores the selected account's details
//     @track showModal = false;   // Controls the modal visibility

//     // Wire method to fetch accounts from Apex
//     @wire(getAccounts)
//     wiredAccounts({ error, data }) {
//         if (data) {
//             this.accounts = data;
//         } else if (error) {
//             console.error('Error fetching accounts:', error);
//         }
//     }

//     // When an account name is clicked
//     handleRowAction(event) {
//         const accountId = event.detail.row.Id;
//         // Find the selected account from the data
//         this.selectedAccount = this.accounts.find(account => account.Id === accountId);
//         this.showModal = true;  // Show modal popup
//     }

//     // Close the modal popup
//     closeModal() {
//         this.showModal = false;
//     }

//     // Define columns for the data table
//     get columns() {
//         return [
//             {
//                 label: 'Name',
//                 fieldName: 'Name',
//                 type: 'button',  // Change to 'button' type to make it clickable
//                 typeAttributes: {
//                     label: { fieldName: 'Name' }, // Display account name
//                     name: 'showDetails', // Unique name for the action
//                     variant: 'base', // Styling of the button
//                 }
//             },
//             { label: 'Phone', fieldName: 'Phone', type: 'phone' },
//             { label: 'Email', fieldName: 'Email', type: 'email' }
//         ];
//     }
// }


import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class AccountControllerDataTableComp extends LightningElement {
    @track accounts;           // Stores account data
    @track selectedAccount;     // Stores the selected account's details
    @track showModal = false;   // Controls the modal visibility

    // Wire method to fetch accounts from Apex
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error('Error fetching accounts:', error);
        }
    }

    // When an account name is clicked
    handleRowAction(event) {
        const accountId = event.detail.row.Id;
        // Find the selected account from the data
        this.selectedAccount = this.accounts.find(account => account.Id === accountId);
        this.showModal = true;  // Show modal popup
    }

    // Close the modal popup
    closeModal() {
        this.showModal = false;
    }

    // Define columns for the data table
    get columns() {
        return [
            {
                label: 'Name',
                fieldName: 'Name',
                type: 'button',  // Change to 'button' type to make it clickable
                typeAttributes: {
                    label: { fieldName: 'Name' }, // Display account name
                    name: 'showDetails', // Unique name for the action
                    variant: 'base', // Styling of the button
                }
            },
            { label: 'Phone', fieldName: 'Phone', type: 'phone' },
            { label: 'Industry', fieldName: 'Industry', type: 'text' }
        ];
    }
}