import { LightningElement, track } from 'lwc';
import searchUsers from '@salesforce/apex/UserLookupController.searchUsers';

export default class CustomUserLooku extends LightningElement {
    @track searchKey = ''; // Search input value
    @track users = []; // Fetched User records
    @track selectedUser; // Selected User record
    @track showDropdown = false; // Control dropdown visibility
    @track message = ''; // Message for no results or error

    // Handle search input change
    handleSearchChange(event) {
        this.searchKey = event.target.value;
        if (this.searchKey.length > 2) {
            // Search users only when input is greater than 2 characters
            this.searchUsers();
        } else {
            this.showDropdown = false;
            this.users = [];
        }
    }

    // Fetch users based on search key
    searchUsers() {
        searchUsers({ searchKey: this.searchKey })
            .then(result => {
                if (result.length === 0) {
                    this.message = 'No users found';
                } else {
                    this.message = '';
                    this.users = result.map(user => ({
                        id: user.Id,
                        name: user.Name,
                        email: user.Email
                    }));
                }
                this.showDropdown = true;
            })
            .catch(error => {
                this.message = 'Error fetching users';
                console.error('Error:', error);
            });
    }

    // Handle user selection
    handleUserSelect(event) {
        const userId = event.currentTarget.dataset.id;
        const selectedUser = this.users.find(user => user.id === userId);
        this.selectedUser = selectedUser;
        this.searchKey = selectedUser.name;
        this.showDropdown = false;

        // Dispatch selected user event for parent components to handle
        const selectedEvent = new CustomEvent('userselect', {
            detail: { userId: selectedUser.id, userName: selectedUser.name }
        });
        this.dispatchEvent(selectedEvent);
    }

    // Clear the selected user
    clearSelection() {
        this.selectedUser = null;
        this.searchKey = '';
        this.users = [];
        this.showDropdown = false;
    }

    // Getter to check if user is selected
    get hasSelectedUser() {
        return !!this.selectedUser;
    }
}