// import { LightningElement, track, wire } from 'lwc';
// import getPicklistValues from '@salesforce/apex/ObjectMultiSelectCntrl.getPicklistValues';

// export default class ObjectMultiSelectComp extends LightningElement {
//     @track picklistOptions = [];
//     @track selectedValues = '';
//     selectedOptions = [];
//     showSelectedValues = false;

//     @wire(getPicklistValues)
//     wiredPicklist({ error, data }) {
//         if (data) {
//             this.picklistOptions = data.map(item => ({
//                 label: item,
//                 value: item
//             }));
//         } else if (error) {
//             console.error('Error fetching picklist values:', error);
//         }
//     }

//     handleSelection(event) {
//         this.selectedOptions = event.detail.value;
//     }

//     handleNext() {
//         this.selectedValues = this.selectedOptions.join(';');
//         this.showSelectedValues = true;
//     }
// }


// import { LightningElement, track, wire } from 'lwc';
// import getPicklistValues from '@salesforce/apex/ObjectMultiSelectCntrl.getPicklistValues';

// export default class MultiSelectCombobox extends LightningElement {
//     @track picklistOptions = [];
//     @track selectedOptions = [];
//     @track selectedValues = '';
//     isDropdownOpen = false;

//     @wire(getPicklistValues)
//     wiredPicklist({ error, data }) {
//         if (data) {
//             this.picklistOptions = data.map(item => ({
//                 label: item,
//                 value: item,
//                 checked: false // Initialize check state
//             }));
//         } else if (error) {
//             console.error('Error fetching picklist values:', error);
//         }
//     }

//     toggleDropdown() {
//         this.isDropdownOpen = !this.isDropdownOpen;
//     }

//     handleSelection(event) {
//         const selectedValue = event.target.dataset.value;

//         // Toggle checked state
//         this.picklistOptions = this.picklistOptions.map(option => ({
//             ...option,
//             checked: option.value === selectedValue ? event.target.checked : option.checked
//         }));

//         // Update selected options
//         if (event.target.checked) {
//             if (!this.selectedOptions.includes(selectedValue)) {
//                 this.selectedOptions = [...this.selectedOptions, selectedValue];
//             }
//         } else {
//             this.selectedOptions = this.selectedOptions.filter(item => item !== selectedValue);
//         }
//     }

//     handleRemove(event) {
//         const valueToRemove = event.target.label;
//         this.selectedOptions = this.selectedOptions.filter(item => item !== valueToRemove);

//         // Uncheck from options list
//         this.picklistOptions = this.picklistOptions.map(option => ({
//             ...option,
//             checked: option.value === valueToRemove ? false : option.checked
//         }));
//     }

//     handleNext() {
//         this.selectedValues = this.selectedOptions.join(';');
//         this.isDropdownOpen = false;
//         this.showSelectedValues = true;
//     }

//     get displayValue() {
//         return this.selectedOptions.length ? this.selectedOptions.join(', ') : '';
//     }

//     clearAll() {
//         this.selectedOptions = [];
        
//         // Uncheck all checkboxes
//         this.picklistOptions = this.picklistOptions.map(option => ({
//             ...option,
//             checked: false
//         }));
//     }
// }



import { LightningElement, track, wire } from 'lwc';
import getPicklistValues from '@salesforce/apex/ObjectMultiSelectCntrl.getPicklistValues';

export default class MultiSelectCombobox extends LightningElement {
    @track picklistOptions = [];
    @track selectedOptions = [];
    isDropdownOpen = false;

    @wire(getPicklistValues)
    wiredPicklist({ error, data }) {
        if (data) {
            this.picklistOptions = data.map(item => ({ label: item, value: item, checked: false }));
        } else if (error) {
            console.error('Error fetching picklist values:', error);
        }
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    handleSelection(event) {
        const selectedValue = event.target.dataset.value;

        this.picklistOptions = this.picklistOptions.map(option => ({
            ...option,
            checked: option.value === selectedValue ? event.target.checked : option.checked
        }));

        if (event.target.checked) {
            if (!this.selectedOptions.includes(selectedValue)) {
                this.selectedOptions = [...this.selectedOptions, selectedValue];
            }
        } else {
            this.selectedOptions = this.selectedOptions.filter(item => item !== selectedValue);
        }
    }

    get displayValue() {
        return this.selectedOptions.length ? this.selectedOptions.join(', ') : '';
    }

    get selectedValues() {
        return this.selectedOptions.join(';');
    }
}