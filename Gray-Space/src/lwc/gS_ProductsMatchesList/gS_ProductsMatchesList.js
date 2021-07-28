import { api, LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/GS_ProductMatchesController.getMatches';
import LABEL_Products_To_Combine from '@salesforce/label/c.GS_Products_to_combine'

export default class GS_ProductsMatchesList extends LightningElement {
    @api recordId;
    products = [];
    show = false;
    label = {
        LABEL_Products_To_Combine
    }

    @wire(getProducts, {productId: '$recordId'})
    loadProducts(result) {
        this.products = result.data;
        if (this.products) {
            if (this.products.length > 0) {
                this.show = true;
            }
        }
    }
}