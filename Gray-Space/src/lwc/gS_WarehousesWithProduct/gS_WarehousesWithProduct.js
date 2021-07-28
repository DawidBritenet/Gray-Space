import { api, LightningElement, wire } from 'lwc';
import {
    publish,
    MessageContext
} from 'lightning/messageService';
import WAREHOUSE_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/GS_WarehouseListUpdate__c';
import getWarehouses from '@salesforce/apex/GS_WarehouseProductsController.getWarehousesWithProduct';
import LABEL_Close from '@salesforce/label/c.GS_Close';
import LABEL_Warehouses from '@salesforce/label/c.GS_Warehouses';
import LABEL_Where_Available from '@salesforce/label/c.GS_Where_available';

export default class GS_WarehousesWithProduct extends LightningElement {
    @api recordId;
    warehouses;
    isModalOpen = false;
    mapMarkers = []
    label = {
        LABEL_Close,
        LABEL_Warehouses,
        LABEL_Where_Available
    }
    

    @wire(MessageContext) messageContext;
    @wire(getWarehouses, {
        productId: '$recordId'
    })
    loadWarehouses(result) {
        this.warehouses = result;
        if (result.data) {
            const message = {
                warehouses: result.data
            };
            publish(this.messageContext, WAREHOUSE_LIST_UPDATE_MESSAGE, message);
        }
    }

    makeMapMakers() {
        this.mapMarkers = this.warehouses.map(warehouse => {
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
              description: `Quantity: ${warehouse.WarehouseLineItems__r[0].GS_Quantity__c}`,
              icon: 'utility:agent_home'
          };
      });
    }

    openModal() {
        getWarehouses({productId: this.recordId}).then((result) => {
            this.warehouses = result;
            this.makeMapMakers();
        })
        .catch((error) => {
            console.log(error);
        });
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }
}