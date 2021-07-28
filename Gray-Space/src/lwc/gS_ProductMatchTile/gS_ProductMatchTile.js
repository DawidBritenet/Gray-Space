import { api, LightningElement, wire } from 'lwc';
import getDefalutPhoto from '@salesforce/apex/GS_ProductController.getDefaultPhoto';
import removeMatch from '@salesforce/apex/GS_ProductMatchesController.removeMatch';
import addMatch from '@salesforce/apex/GS_ProductMatchesController.addMatch';

export default class GS_ProductMatchTile extends LightningElement {
    matchId = '';
    @api product1id;
    product;
    @api get productwrapper() {
        return {
            isSelected: this.isSelected,
            product: this.product
        }
    };
    set productwrapper(val) {
        this.product = val.product;
        this.matchId = val.matchId;
    }

    photo;
    get photoLink() {
        return 'background-image: url(\''+this.photo+'\');'
    }

    get isSelected() {
        if (this.matchId) {
            return 'tile-selected';
        } else {
            return 'tile-not-selected';
        }
    }

    @wire(getDefalutPhoto, {
        productId: '$product.Id'
    })
    loadDefaultPhoto(result) {
        this.photo = result.data
    }

    handleClick(event) {
        if (this.matchId) {
            removeMatch({matchId: this.matchId}).then((result) => {
                this.matchId = '';
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            addMatch({product1Id: this.product1id, product2Id: this.product.Id}).then((result) => {
                this.matchId = result;
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }
}