import { LightningElement } from 'lwc';

export default class StatsCounterComp extends LightningElement {

    startCount(event) {
        const target = event.currentTarget.querySelector('.count');
        const targetValue = parseInt(target.getAttribute('data-target'), 10);
        
        let count = 0;
        const increment = Math.ceil(targetValue / 100); // Define how fast the count increases

        const updateCount = () => {
            if (count < targetValue) {
                count += increment;
                target.innerText = count;
                setTimeout(updateCount, 20); // Adjust speed here
            } else {
                target.innerText = targetValue; // Ensure it reaches the final number
            }
        };

        updateCount();
    }
}