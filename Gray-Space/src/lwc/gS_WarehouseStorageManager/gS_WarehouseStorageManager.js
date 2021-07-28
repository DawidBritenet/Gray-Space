import { api, LightningElement, track, wire } from 'lwc';
import getProducts from '@salesforce/apex/GS_WarehouseProductsController.getProductsStorageManager';
import updateProducts from '@salesforce/apex/GS_WarehouseProductsController.updateProducts';
import getWarehouse from '@salesforce/apex/GS_WarehouseController.getWarehouse';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LABEL_Name from '@salesforce/label/c.GS_Name';
import LABEL_Capacity from '@salesforce/label/c.GS_Capacity';
import LABEL_Used_Capacity from '@salesforce/label/c.GS_Used_Capacity';
import LABEL_Update from '@salesforce/label/c.GS_update';
import LABEL_Reset from '@salesforce/label/c.GS_reset';
import LABEL_Products from '@salesforce/label/c.GS_Products';


export default class GS_WarehouseStorageManager extends LightningElement {
    @api recordId;
    warehouse = {};
    @api products;
    @api productsSaved;
    productswired = {};
    productsToUpdate
    @api quantityLeft = 0;
    @api usedCapacity = 0;
    @api updated = false;

    label = {
        LABEL_Name,
        LABEL_Capacity,
        LABEL_Used_Capacity,
        LABEL_Update,
        LABEL_Reset,
        LABEL_Products
    }

    countQuantityLeft() {
        if (this.warehouse.data) {
            this.quantityLeft = this.warehouse.data.GS_Capacity__c - this.usedCapacity;
        } else {
            this.quantityLeft = 0;
        }
    }

    
    countUsedCapacity() {
       let capacity = 0;
       
       if (this.products) {
            this.products.forEach(product => {
                capacity += parseInt(product.quantity, 10);
            });
       }
       
       this.usedCapacity = capacity;
    }

    refreshVariables() {
        this.countUsedCapacity();
        this.countQuantityLeft();
    }

    @wire(getProducts, {warehouseId: '$recordId'})
    loadProducts(result) {
        this.productswired = result;
        if (result.data) {
            this.productsSaved = JSON.parse(JSON.stringify(result.data));
            this.products = JSON.parse(JSON.stringify(result.data));
        }
        this.refreshVariables();
    }

    @wire(getWarehouse, {warehouseId: '$recordId'})
    leadWarehouse(result) {
        this.warehouse = result;
    }

    handleProductQuantityChange(event) {
        this.products.forEach(product => {
            if (product.id == event.detail.id) {
                product.quantity = event.detail.quantity;
            }
        })
        this.refreshVariables();
    }

    updateStorage() {
        let products = {};
        this.products.forEach(product => {
            products[product.id] = parseInt(product.quantity);
        })

        updateProducts({products: products, warehouseId: this.recordId}).then((result) => {
            this.productsSaved = JSON.parse(JSON.stringify(this.products));
            this.products = JSON.parse(JSON.stringify(this.productsSaved));
            this.updated = true;
            const evt = new ShowToastEvent({
                title: 'Success',
                message: 'Updated warehouse storage',
                variant: 'success',
            });
            this.dispatchEvent(evt);
        })
        .catch((error) => {
            console.log(error);
        });
        this.refreshVariables();
    }

    removeChanges() {
        if (this.productswired) {
            this.products = JSON.parse(JSON.stringify(this.productsSaved));
        }
        this.refreshVariables();
    }
}