public with sharing abstract class GS_TriggerHandler {
    protected SObjectType SObjectType { get; private set; }

    public GS_TriggerHandler() {
        if (Trigger.new == null) {
            SObjectType = Trigger.old.get(0).getSObjectType();
        } else {
            SObjectType = Trigger.new.get(0).getSObjectType();
        }
    }

    public void execute() {
        if (Trigger.isBefore) {
            bulkBefore();
            if (Trigger.isInsert) {
                for (SObject so : Trigger.new) {
                    beforeInsert(so);
                }
            } else if (Trigger.isUpdate) {
                for (SObject so : Trigger.old) {
                    beforeUpdate(so, Trigger.newMap.get(so.Id));
                }
            } else if (Trigger.isDelete) {
                for (SObject so : Trigger.old) {
                    beforeDelete(so);
                }
            }
            postProcessingBefore();
        } else {
            bulkAfter();
            if (Trigger.isInsert) {
                for (SObject so : Trigger.new) {
                    afterInsert(so);
                }
            } else if (Trigger.isUpdate) {
                for (SObject so : Trigger.old) {
                    afterUpdate(so, Trigger.newMap.get(so.Id));
                }
            } else if (Trigger.isDelete) {
                for (SObject so : Trigger.old) {
                    afterDelete(so);
                }
            }
            postProcessingAfter();
        }
    }

    virtual void bulkBefore() {
    }
    virtual void beforeInsert(SObject so) {
    }
    virtual void beforeUpdate(SObject old_so, SObject so) {
    }
    virtual void beforeDelete(SObject so) {
    }
    virtual void postProcessingBefore() {
    }
    virtual void bulkAfter() {
    }
    virtual void afterInsert(SObject so) {
    }
    virtual void afterUpdate(SObject old_so, SObject so) {
    }
    virtual void afterDelete(SObject so) {
    }
    virtual void postProcessingAfter() {
    }
}