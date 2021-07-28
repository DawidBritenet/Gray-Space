import { api, LightningElement, wire } from 'lwc';
import getProduct from '@salesforce/apex/GS_ProductController.getProduct';
import getProducts from '@salesforce/apex/GS_ProductMatchesController.getProducts';

export default class GS_ProductMatchesManager extends LightningElement {
    @api recordId;
    product;
    products;

    @wire(getProduct, {productId: '$recordId'})
    loadProduct(result) {
        this.product = result.data;
    }

    @wire(getProducts, {productId: '$recordId'})
    loadProducts(result) {
        this.products = result.data; 
    }
}