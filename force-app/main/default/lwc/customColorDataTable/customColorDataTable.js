import { LightningElement, track } from 'lwc';

export default class CustomColorDataTable extends LightningElement {
    @track tableData = [];
    @track columns = [
        { label: 'Name', fieldName: 'name', type: 'text' },
        { 
          label: 'Status', 
          fieldName: 'status', 
          type: 'text',
          cellAttributes: {
              class: { fieldName: 'statusClass' }, // Apply class dynamically
          }
        }
    ];

    connectedCallback() {
        // Example data with conditional styling class
        this.tableData = [
            { id: '1', name: 'Record A', status: 'Active', statusClass: 'green-cell' },
            { id: '2', name: 'Record B', status: 'Inactive', statusClass: 'red-cell' },
            { id: '3', name: 'Record C', status: 'Active', statusClass: 'green-cell' },
            { id: '4', name: 'Record D', status: 'Inactive', statusClass: 'red-cell' },
            { id: '5', name: 'Record E', status: 'Active', statusClass: 'green-cell' },
            { id: '6', name: 'Record F', status: 'Inactive', statusClass: 'red-cell' }
        ];
    }
}