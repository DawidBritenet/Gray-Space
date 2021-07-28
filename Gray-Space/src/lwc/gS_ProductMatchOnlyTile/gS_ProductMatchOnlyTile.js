import { api, LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getDefalutPhoto from '@salesforce/apex/GS_ProductController.getDefaultPhoto';

export default class GS_ProductMatchOnlyTile extends NavigationMixin(LightningElement) {
    @api product;

    photo;
    get photoLink() {
        return 'background-image: url(\''+this.photo+'\');'
    }

    @wire(getDefalutPhoto, {
        productId: '$product.Id'
    })
    loadDefaultPhoto(result) {
        this.photo = result.data
    }

    handleClick(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.product.Id,
                actionName: 'view',
            },
        });
    }
}