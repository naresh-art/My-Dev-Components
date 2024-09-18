import { LightningElement, api } from 'lwc';
import ITConsultingCard from '@salesforce/resourceUrl/ITConsultingCard'; // Importing the static resource
import StaffingSolutions from '@salesforce/resourceUrl/StaffingSolutions'; // Importing the static resource
import ProjectManagement from '@salesforce/resourceUrl/ProjectManagement'; // Importing the static resource
import SoftwareDevelopment from '@salesforce/resourceUrl/SoftwareDevelopment'; // Importing the static resource

export default class FlipServicesComponentExample extends LightningElement {
    imageUrl = ITConsultingCard;
    imageUrl2 = StaffingSolutions;
    imageUrl3 = ProjectManagement;
    imageUrl4 = SoftwareDevelopment;
    // url = 'https://sprintpark.com/it-consulting';
    // url2 = 'https://sprintpark.com/staffingSolutions';
    // url3 = 'https://sprintpark.com/projectManagement';
    // url4 = 'https://sprintpark.com/softwareServices';

    // handleClick() {
    //     // Redirect to the URL specified in the url variable in the same tab
    //     window.location.href = this.url;
    // }

    // handleStaffingSolutionsClick() {
    //     // Redirect to the URL specified in the url variable in the same tab
    //     window.location.href = this.url2;
    // }

    // handleProjectManagementClick() {
    //     // Redirect to the URL specified in the url variable in the same tab
    //     window.location.href = this.url3;
    // }

    // handleSoftwareDevelopmentClick() {
    //     // Redirect to the URL specified in the url variable in the same tab
    //     window.location.href = this.url3;
    // }
}