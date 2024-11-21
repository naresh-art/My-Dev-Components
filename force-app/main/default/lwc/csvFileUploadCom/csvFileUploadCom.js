// import { LightningElement, track } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import insertAccounts from '@salesforce/apex/csvFileUploadController.insertAccounts';

// export default class CsvFileUploadCom extends LightningElement {
//     @track records = [];
//     @track isLoading = false;

//     fileContents;

//     handleFileChange(event) {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 this.fileContents = reader.result;
//                 try {
//                     this.parseCSV();
//                     this.showToast('Success', 'File uploaded successfully!', 'success');
//                 } catch (error) {
//                     this.showToast('Error', `Error parsing file: ${error.message}`, 'error');
//                 }
//             };
//             reader.readAsText(file);
//         }
//     }

//     parseCSV() {
//         const rows = this.fileContents.split('\n').filter(row => row.trim() !== '');
//         const headers = rows[0].split(',');

//         // Validate headers
//         if (!headers.includes('Name')) {
//             throw new Error('Missing "Name" column in CSV header.');
//         }

//         this.records = rows.slice(1).map(row => {
//             const values = row.split(',');
//             const record = {};
//             headers.forEach((header, index) => {
//                 record[header.trim()] = values[index] ? values[index].trim() : null;
//             });
//             return record;
//         });

//         // Validate parsed data
//         if (this.records.length === 0) {
//             throw new Error('No data rows found in CSV.');
//         }
//     }

//     handleInsertRecords() {
//         if (this.records.length === 0) {
//             this.showToast('Error', 'No data to insert. Please upload a valid CSV file.', 'error');
//             return;
//         }

//         this.isLoading = true;

//         insertAccounts({ accountList: this.records })
//             .then(result => {
//                 this.isLoading = false;
//                 this.showToast('Success', `Records inserted successfully! Count: ${result.length}`, 'success');
//                 this.records = []; // Clear records after insertion
//             })
//             .catch(error => {
//                 this.isLoading = false;
//                 console.error('Error inserting records:', error);
//                 this.showToast('Error', `Error inserting records: ${error.body.message}`, 'error');
//             });
//     }

//     showToast(title, message, variant) {
//         const event = new ShowToastEvent({
//             title: title,
//             message: message,
//             variant: variant,
//         });
//         this.dispatchEvent(event);
//     }
// }


import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import insertAccounts from '@salesforce/apex/csvFileUploadController.insertAccounts';

export default class CsvFileUploadCom extends LightningElement {
    @track records = [];
    @track isLoading = false;
    @track fileSize = 0;
    @track isFileSizeValid = true;

    fileContents;
    maxFileSize = 512; // Max file size in KB (adjust as per Salesforce limit)
    disableInsertButton = true;

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            // Calculate file size in KB
            this.fileSize = (file.size / 1024).toFixed(2);
            this.isFileSizeValid = this.fileSize <= this.maxFileSize;

            if (this.isFileSizeValid) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.fileContents = reader.result;
                    try {
                        this.parseCSV();
                        this.showToast('Success', 'File uploaded successfully!', 'success');
                        this.disableInsertButton = false;
                    } catch (error) {
                        this.showToast('Error', `Error parsing file: ${error.message}`, 'error');
                    }
                };
                reader.readAsText(file);
            } else {
                this.showToast(
                    'Error',
                    `File size exceeds the limit of ${this.maxFileSize} KB.`,
                    'error'
                );
                this.disableInsertButton = true;
            }
        }
    }

    parseCSV() {
        const rows = this.fileContents.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',');

        // Validate headers
        if (!headers.includes('Name')) {
            throw new Error('Missing "Name" column in CSV header.');
        }

        this.records = rows.slice(1).map(row => {
            const values = row.split(',');
            const record = {};
            headers.forEach((header, index) => {
                record[header.trim()] = values[index] ? values[index].trim() : null;
            });
            return record;
        });

        // Validate parsed data
        if (this.records.length === 0) {
            throw new Error('No data rows found in CSV.');
        }
    }

    handleInsertRecords() {
        if (this.records.length === 0) {
            this.showToast('Error', 'No data to insert. Please upload a valid CSV file.', 'error');
            return;
        }

        this.isLoading = true;

        insertAccounts({ accountList: this.records })
            .then(result => {
                this.isLoading = false;
                this.showToast('Success', `Records inserted successfully! Count: ${result.length}`, 'success');
                this.records = []; // Clear records after insertion
                this.disableInsertButton = true;
            })
            .catch(error => {
                this.isLoading = false;
                console.error('Error inserting records:', error);
                this.showToast('Error', `Error inserting records: ${error.body.message}`, 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
