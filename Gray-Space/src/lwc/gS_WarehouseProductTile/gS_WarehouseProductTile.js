import { api, LightningElement, wire } from 'lwc';
import getDefalutPhoto from '@salesforce/apex/GS_ProductController.getDefaultPhoto';

export default class GS_WarehouseProductTile extends LightningElement { 
    _quantity;
    get quantity() {
        return this._quantity
    }
    set quantity(val) {
        this._quantity = val;
    }

    @api
    quantityleft = 0;

    myProduct;
    @api
    get product() {
        return this.myProduct;
    }
    set product(val) {
        this.myProduct = JSON.parse(JSON.stringify(val));
        this.quantity = this.myProduct.quantity;
    }

    get isModifiedClass () {
        if (this.quantity != this.product.quantity) {
            return 'tile-modified';
        } else {
            return '';
        }
    }

    photo;
    get photoLink() {
        return 'background-image: url(\''+this.photo+'\');'
    }

    @wire(getDefalutPhoto, {
        productId: '$myProduct.id'
    })
    loadDefaultPhoto(result) {
        this.photo = result.data
    }

    sendProductChangeMessage() {
        this.dispatchEvent(new CustomEvent('quantitychange',{
            detail: {
                id: this.product.id,
                quantity: this.quantity
            }
          }));
    }

    handleQuantityChange(event) {
        if (!event.target.value) {
            event.target.value = 0;
        }
        if (this.quantityleft >= event.target.value) {
            this.quantity = event.target.value;
        } else {
            this.quantity = this.quantityleft;
            event.target.value = this.quantityleft;
        }
        this.sendProductChangeMessage();
    }

    handleQuantitySubtract(event) {
        if (this.quantity > 0) {
            this.quantity--;
            this.sendProductChangeMessage();
        }
    }

    handleQuantityAdd(event) {
        if (this.quantityleft > 0) {
            this.quantity++;
            this.sendProductChangeMessage();
        }
    }
}