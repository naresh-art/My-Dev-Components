import { LightningElement } from 'lwc';
import slump from '@salesforce/resourceUrl/ITConsultingCard';
import contraction from '@salesforce/resourceUrl/SoftwareDevelopment';
import peak from '@salesforce/resourceUrl/ProjectManagement';
import expansion from '@salesforce/resourceUrl/StaffingSolutions';

export default class RotatingComponent extends LightningElement {
    slumpImage = slump;
    contractionImage = contraction;
    peakImage = peak;
    expansionImage = expansion;

    renderedCallback() {
        if (!this._hasRendered) {
            this._hasRendered = true;

            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.template.querySelector('.orbit').classList.add('rotate');
                    } else {
                        this.template.querySelector('.orbit').classList.remove('rotate');
                    }
                });
            }, options);

            const target = this.template.querySelector('.rotation-container');
            if (target) {
                observer.observe(target);
            }
        }
    }
}
