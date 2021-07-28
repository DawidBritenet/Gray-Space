import { api, LightningElement } from 'lwc';

export default class GS_WarehouseProductList extends LightningElement {
    @api products = {};

    handleQuantityChange(event) {
        console.log('event jest!');
    }
}