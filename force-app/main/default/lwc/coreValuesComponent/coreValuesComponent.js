import { LightningElement } from 'lwc';
import Integrityjpg from '@salesforce/resourceUrl/Integrityjpg';
import teamworkIcon from '@salesforce/resourceUrl/teamworkIcon';
import 	commitmentIcon from '@salesforce/resourceUrl/commitmentIcon';
import diversityIcon from '@salesforce/resourceUrl/diversityIcon'


export default class CoreValuesComponent extends LightningElement {
    integrityIcon = Integrityjpg;
    teamwork =  teamworkIcon;
    commitment = commitmentIcon;
    diversity=diversityIcon;
}