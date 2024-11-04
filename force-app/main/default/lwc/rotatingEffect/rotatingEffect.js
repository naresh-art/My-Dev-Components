import { LightningElement } from 'lwc';

export default class RotatingEffect extends LightningElement {
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

            // Observe the entire container
            const target = this.template.querySelector('.rotation-container');
            if (target) {
                observer.observe(target);
            }
        }
    }
}
