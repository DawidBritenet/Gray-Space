import {
    publish,
    MessageContext
} from 'lightning/messageService';
import WAREHOUSE_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/GS_WarehouseListUpdate__c';
import {
    LightningElement,
    wire
} from 'lwc';
import searchWarehouses from '@salesforce/apex/GS_WarehouseController.searchWarehouses';
import LABEL_WAREHOUSES from '@salesforce/label/c.GS_Warehouses';
import LABEL_SEARCH from '@salesforce/label/c.GS_Search';
import LABEL_SEARCH_FOR_WAREHOUSES from '@salesforce/label/c.GS_Search_for_warehouses';
import LABEL_WAREHOUSE_NO_RESULTS from '@salesforce/label/c.GS_We_did_not_find_results';

export default class GS_WarehouseSearch extends LightningElement {
    searchTerm = '';
    warehouses;
    label = {
        LABEL_WAREHOUSES,
        LABEL_SEARCH,
        LABEL_SEARCH_FOR_WAREHOUSES,
        LABEL_WAREHOUSE_NO_RESULTS
    }

    @wire(MessageContext) messageContext;
    @wire(searchWarehouses, {
        searchTerm: '$searchTerm'
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
    handleSearchTermChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchTerm = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchTerm = searchTerm;
        }, 300);
    }

    get hasResults() {
        return (this.warehouses.data.length > 0);
    } 
}