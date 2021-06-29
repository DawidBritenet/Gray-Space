import { LightningElement, wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    MessageContext
} from 'lightning/messageService';
import SOBJECT_SELECT_MESSAGE from '@salesforce/messageChannel/GS_SObjectSelect__c';
import LABEL_WAREHOUSE from '@salesforce/label/c.GS_Warehouse'

export default class GS_WarehouseDetails extends LightningElement {
    recordId = '';
    subscription = null;
    @wire(MessageContext)
    messageContext;
    label = {
        LABEL_WAREHOUSE
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


}