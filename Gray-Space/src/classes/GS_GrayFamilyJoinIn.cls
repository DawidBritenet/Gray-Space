public with sharing class GS_GrayFamilyJoinIn {

    @AuraEnabled(cacheable=true)
    public static String getDescription() {
        GS_Club__c club = getClub();

        return club.GS_Description__c;
    }

    @AuraEnabled
    public static void addMember(String interestIn) {
        GS_Club__c club = getClub();
        User loggedUser = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()];
        GS_Club_Member__c member = new GS_Club_Member__c(GS_Member__c=loggedUser.ContactId, GS_Club__c=club.Id, GS_Interest_In__c=interestIn);

        insert member;
    }

    @AuraEnabled(cacheable=true)
    public static Boolean isClubMember() {
        GS_Club__c club = getClub();
        User loggedUser = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()];
        List<GS_Club_Member__c> members = [SELECT Id FROM GS_Club_Member__c WHERE GS_Club__c=:club.Id AND GS_Member__c=:loggedUser.ContactId];
        return members.size() > 0;
    }

    @AuraEnabled(cacheable=true)
    public static GS_Club__c getClub() {
        GS_General__c settings = GS_General__c.getOrgDefaults();
        return [SELECT Id, GS_Description__c FROM GS_Club__c WHERE Id = :settings.GS_GrayFamily_Id__c];
    }
}