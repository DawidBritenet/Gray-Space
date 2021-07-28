import { api, LightningElement } from 'lwc';
import {
    NavigationMixin
} from 'lightning/navigation';
import LABEL_Storage_Manager from '@salesforce/label/c.GS_Storage_Manager'

export default class GS_WarehouseGoToStorageManager extends NavigationMixin(LightningElement) {
    @api
    recordId;

    label = {
        LABEL_Storage_Manager
    }

    goToStorage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: "c__GS_WarehouseStorageManagerPage"
            },
            state: {
                c__recordId: this.recordId
            }
        });
    }
}