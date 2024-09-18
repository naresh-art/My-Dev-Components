import { LightningElement } from 'lwc';
import companyLogo from '@salesforce/resourceUrl/companyLogo';
import facebookIcon from '@salesforce/resourceUrl/facebookIcon';
import instagramIcon from '@salesforce/resourceUrl/instagramIcon';
import linkedinIcon from '@salesforce/resourceUrl/linkedinIcon';
export default class FooterComponent extends LightningElement {
    logoUrl = companyLogo;
    facebookUrl = facebookIcon;
    instagramUrl = instagramIcon;
    linkedinUrl = linkedinIcon;
}