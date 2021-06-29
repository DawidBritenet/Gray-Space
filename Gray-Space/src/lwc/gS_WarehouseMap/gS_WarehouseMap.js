import {
    LightningElement,
    wire
} from 'lwc';
import {
    subscribe,
    unsubscribe,
    publish,
    MessageContext
} from 'lightning/messageService';
import WAREHOUSE_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/GS_WarehouseListUpdate__c';
import SOBJECT_SELECT_MESSAGE from '@salesforce/messageChannel/GS_SObjectSelect__c';
import LABEL_WAREHOUSES from '@salesforce/label/c.GS_Warehouses';

export default class GS_WarehouseMap extends LightningElement {
    mapMarkers = [];
    subscription = null;
    @wire(MessageContext)
    messageContext;
    selectedValue = '';
    label = {
        LABEL_WAREHOUSES
    }

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            WAREHOUSE_LIST_UPDATE_MESSAGE,
            (message) => {
                this.handleWarehouseListUpdate(message);
        });
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleWarehouseListUpdate(message) {
        this.mapMarkers = message.warehouses.map(warehouse => {
              const city = warehouse.GS_City__c;
              const country = warehouse.GS_Country__c;
              const street = warehouse.GS_Street__c;
              const state = warehouse.GS_State__c;
              const postalCode = warehouse.GS_PostalCode__c;
            return {
                location: {
                    Street: street,
                    City: city,
                    Country: country,
                    State: state,
                    PostalCode: postalCode
                },
                title: warehouse.Name,
                value: warehouse.Id,
                description: `${warehouse.GS_Phone__c}`,
                icon: 'utility:agent_home'
            };
        });
    }

    handleMarkerSelect(event) {
        if (this.selectedValue != event.target.selectedMarkerValue) {
            this.selectedValue = event.target.selectedMarkerValue;
            const message = {
                selectedObject: this.selectedValue
            };
            publish(this.messageContext, SOBJECT_SELECT_MESSAGE, message);
        }
    }
}