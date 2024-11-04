// import { LightningElement } from 'lwc';
// import CONSULTING_IMAGE from '@salesforce/resourceUrl/testimage'; // Import static resource

// export default class ImageAndContent extends LightningElement {
//     imageUrl = CONSULTING_IMAGE; // Set image URL from static resource
//     contentTitle = 'We Fuel Enterprise Transformation';
//     contentDescription = 'Consulting Solutions is a nationally recognized leader in technology solutions, providing expert guidance on business-critical initiatives.';

//     handleButtonClick() {
//         alert('Learn More button clicked!');
//     }
// }



// import { LightningElement } from 'lwc';
// import CONSULTING_IMAGE from '@salesforce/resourceUrl/testimage'; // Import static resource

// export default class AutoSlidingContent extends LightningElement {
//     imageUrl = CONSULTING_IMAGE; // Set image URL from static resource
//     contentTitle = 'We Fuel Enterprise Transformation';
//     contentDescription = 'Consulting Solutions is a nationally recognized leader in technology solutions, providing expert guidance on business-critical initiatives.';
//     isContentVisible = false; // Initially hide content

//     connectedCallback() {
//         // Set a 5-second timer to show content after image appears
//         setTimeout(() => {
//             this.isContentVisible = true;
//         }, 5000); // 5000 milliseconds = 5 seconds
//     }

//     handleButtonClick() {
//         alert('Learn More button clicked!');
//     }
// }

//with only text slide
// import { LightningElement } from 'lwc';
// import CONSULTING_IMAGE from '@salesforce/resourceUrl/testimage'; // Import static resource

// export default class AutoSlidingContent extends LightningElement {
//     imageUrl = CONSULTING_IMAGE; // Set image URL from static resource
//     contentTitle = 'We Fuel Enterprise Transformation';
//     contentDescription = 'Consulting Solutions is a nationally recognized leader in technology solutions, providing expert guidance on business-critical initiatives.';
//     isContentVisible = false; // Initially hide content

//     connectedCallback() {
//         // Set a 5-second timer to show content after image appears
//         setTimeout(() => {
//             this.isContentVisible = true;
//         }, 5000); // 5000 milliseconds = 5 seconds
//     }

//     handleButtonClick() {
//         alert('Learn More button clicked!');
//     }
// }


// import { LightningElement } from 'lwc';
// import CONSULTING_IMAGE from '@salesforce/resourceUrl/testimage'; // Import static resource

// export default class AutoSlidingContent extends LightningElement {
//     imageUrl = CONSULTING_IMAGE; // Set image URL from static resource
//     contentTitle = 'We Fuel Enterprise Transformation';
//     contentDescription = 'Consulting Solutions is a nationally recognized leader in technology solutions, providing expert guidance on business-critical initiatives.';
//     isImageVisible = false; // Initially hide the image
//     isContentVisible = false; // Initially hide the content

//     connectedCallback() {
//         // Set a timer to show the image first
//         setTimeout(() => {
//             this.isImageVisible = true;
//         }, 1000); // 1-second delay for the image to appear

//         // Set another timer to show the content after the image
//         setTimeout(() => {
//             this.isContentVisible = true;
//         }, 6000); // 5 seconds after the image, show the content
//     }

//     handleButtonClick() {
//         alert('Learn More button clicked!');
//     }
// }

//working code
// import { LightningElement } from 'lwc';
// import CONSULTING_IMAGE from '@salesforce/resourceUrl/testimage';

// export default class AutoSlidingContent extends LightningElement {
//     imageUrl = CONSULTING_IMAGE;
//     contentTitle = 'WE FUEL ENTERPRISE TRANSFORMATION';
//     contentDescription = 'Consulting Solutions is a nationally recognized leader in technology solutions and consulting services. We have the people, processes, and solutions to provide organizations with strategic guidance on business-critical initiatives and deliver end-to-end solutions. '
//                         + 'We meet the highest standard of excellence in technology and value because we are 100 % focused on forging long - term relationships with deeply experienced consultants and building high - performance, service - oriented teams that produce results.';

// connectedCallback() {
//     // Use intersection observer to detect when the element comes into view
//     this.observeElement();
// }

//     observeElement() {
//         // Wait until the DOM is fully loaded
//         window.requestAnimationFrame(() => {
//             const container = this.template.querySelector('.container');
//             const observer = new IntersectionObserver((entries) => {
//                 entries.forEach(entry => {
//                     if (entry.isIntersecting) {
//                         // Add animation classes when in view
//                         this.animateContent(container);
//                     }
//                 });
//             }, {
//                 root: null, // Use the viewport as root
//                 threshold: 0.1 // Trigger when 10% of the element is visible
//             });

//             // Observe the container
//             observer.observe(container);
//         });
//     }

//     animateContent(container) {
//         const image = container.querySelector('.fade-in-image');
//         const content = container.querySelector('.fade-in-content');

//         // Remove previous animation classes if present
//         image.classList.remove('animate-image');
//         content.classList.remove('animate-content');

//         // Trigger reflow to reset animation
//         void image.offsetWidth; 
//         void content.offsetWidth;

//         // Add animation classes
//         image.classList.add('animate-image');
//         content.classList.add('animate-content');
//     }

//     handleButtonClick() {
//         alert('Learn More button clicked!');
//     }
// }



import { LightningElement } from 'lwc';
import CONSULTING_IMAGE from '@salesforce/resourceUrl/testimage';

export default class AutoSlidingContent extends LightningElement {
    imageUrl = CONSULTING_IMAGE;
    contentTitle = 'We Fuel Enterprise Transformation';
    contentDescription = 'Consulting Solutions is a nationally recognized leader in technology solutions, providing expert guidance on business-critical initiatives.';

    connectedCallback() {
        // Use intersection observer to detect when the element comes into view
        this.observeElement();
    }

    observeElement() {
        window.requestAnimationFrame(() => {
            const container = this.template.querySelector('.container');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateWaveContent(container);
                    }
                });
            }, {
                root: null, // Use the viewport as root
                threshold: 0.1 // Trigger when 10% of the element is visible
            });

            observer.observe(container);
        });
    }

    animateWaveContent(container) {
        const image = container.querySelector('.wave-in-image');
        const content = container.querySelector('.wave-in-content');

        // Remove previous animation classes if present
        image.classList.remove('wave-animation-image');
        content.classList.remove('wave-animation-content');

        // Trigger reflow to reset animation
        void image.offsetWidth; 
        void content.offsetWidth;

        // Add wave animation classes
        image.classList.add('wave-animation-image');
        content.classList.add('wave-animation-content');
    }

    handleButtonClick() {
        alert('Learn More button clicked!');
    }
}

