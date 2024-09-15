import { LightningElement } from 'lwc';
import Talent from '@salesforce/resourceUrl/Talent'; // Importing the static resource
import Workplace from '@salesforce/resourceUrl/Workplace'; // Importing the static resource
import WorkingHours from '@salesforce/resourceUrl/WorkingHours'; // Importing the static resource
import FoodAllowances from '@salesforce/resourceUrl/FoodAllowances'; // Importing the static resource
import LearnAndDevelop from '@salesforce/resourceUrl/LearnAndDevelop'; // Importing the static resource

export default class CareerPageIconsMotion extends LightningElement {
    Talent = Talent;
    Workplace = Workplace;
    WorkingHours = WorkingHours;
    FoodAllowances = FoodAllowances;
    LearnAndDevelop = LearnAndDevelop;

    connectedCallback() {
        // Start the jump sequence when the component is connected
        this.animateIcons();
    }

    animateIcons() {
        // Select all icons
        const icons = this.template.querySelectorAll('.icon');
        let delay = 0;

        // Loop through each icon and apply the jump animation with increasing delay
        icons.forEach((icon, index) => {
            delay += 500; // Delay each jump by 500ms
            setTimeout(() => {
                icon.classList.add('jump');
                // Remove the jump class after the animation to allow re-triggering
                setTimeout(() => {
                    icon.classList.remove('jump');
                }, 500); // Duration of jump animation
            }, delay);
        });

        // Loop the animation after the last icon has jumped
        setTimeout(() => this.animateIcons(), delay + 1000);
    }
}