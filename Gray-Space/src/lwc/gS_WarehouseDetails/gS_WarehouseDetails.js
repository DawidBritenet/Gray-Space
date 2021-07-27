import { LightningElement, wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    MessageContext
} from 'lightning/messageService';
import {
    NavigationMixin
} from 'lightning/navigation';
import SOBJECT_SELECT_MESSAGE from '@salesforce/messageChannel/GS_SObjectSelect__c';
import LABEL_WAREHOUSE from '@salesforce/label/c.GS_Warehouse'
import LABEL_VIEW from '@salesforce/label/c.GS_View'

export default class GS_WarehouseDetails extends NavigationMixin(LightningElement) {
    recordId = '';
    subscription = null;
    @wire(MessageContext)
    messageContext;
    label = {
        LABEL_WAREHOUSE,
        LABEL_VIEW
    }

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            SOBJECT_SELECT_MESSAGE,
            (message) => {
                this.recordId = message.selectedObject
        });
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    getDetails() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'GS_Warehouse__c',
                actionName: 'view',
            },
        });
    }
}