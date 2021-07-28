import { LightningElement, wire } from 'lwc';
import getClub from '@salesforce/apex/GS_GrayFamilyJoinIn.getClub';
import joinClub from '@salesforce/apex/GS_GrayFamilyJoinIn.addMember';
import IS_CLUB_MEMBER from '@salesforce/apex/GS_GrayFamilyJoinIn.isClubMember';
import TYPES_PICKLIST from '@salesforce/schema/GS_Club_Member__c.GS_Interest_In__c';
import CLUB_MEMBER_OBJECT from '@salesforce/schema/GS_Club_Member__c';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import LABEL_You_Already_Member from '@salesforce/label/c.GS_You_already_member'
import LABEL_Join_GrayFamily from '@salesforce/label/c.GS_Join_GrayFamily'
import LABEL_Discount_Info from '@salesforce/label/c.GS_You_have_5_discount_on_products_you_interested_in'
import LABEL_Sign_In from '@salesforce/label/c.GS_Sign_In'
import LABEL_Accept_Terms from '@salesforce/label/c.GS_Accept_terms'

export default class GS_GrayFamilyJoinIn extends LightningElement {
    club;
    clubId;
    description;
    value;
    typeValues;
    acceptTerms;
    clubMemberObjectInfo;
    isMember = false;
    lock = true;

    label = {
        LABEL_You_Already_Member,
        LABEL_Join_GrayFamily,
        LABEL_Discount_Info,
        LABEL_Sign_In,
        LABEL_Accept_Terms
    }

    @wire(getClub)
    loadClub(result) {
        if (result.data) {
            this.club = result.data;
            this.description = this.club.GS_Description__c;
            this.clubId = this.club.Id
        }
    }

    @wire(IS_CLUB_MEMBER)
    loadClubMember(result) {
        this.isMember = result.data;
    }

    @wire(getObjectInfo, { objectApiName: CLUB_MEMBER_OBJECT })
    loadObjectInfo(result) {
        if (result.data) {
            this.clubMemberObjectInfo = result.data.defaultRecordTypeId;
        }
    }

    @wire(getPicklistValues,
        {
            recordTypeId: '$clubMemberObjectInfo',
            fieldApiName: TYPES_PICKLIST
        }
    )
    loadValues(result) {
        this.typeValues = result;
    }

    handleChange(event) {
        this.value = event.target.value;
        this.lock = !(this.value != undefined && this.acceptTerms);
    }

    hangleCheckbox(event) {
        this.acceptTerms = event.target.checked;
        this.lock = !(this.value != undefined && this.acceptTerms);
    }

    handleSignIn() {
        joinClub({interestIn: this.value}).then((result) => {
            this.isMember = true;
        })
        .catch((error) => {
            console.log(error);
        }); 
    }

}