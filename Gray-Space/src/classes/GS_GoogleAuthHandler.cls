global class GS_GoogleAuthHandler implements Auth.RegistrationHandler {
    private static final String ORG_SUFFIX = '.GraySpace.com';
    private static final String DEFAULT_ACCOUNTNAME = 'Personal';
    private static final String EXTERNAL_USER_PROFILE = 'Community User';
    private static final String INTERNAL_USER_PROFILE = 'Standard User';

    global boolean canCreateUser(Auth.UserData data) {
        Boolean retVal = (data != null
                && data.email != null
                && data.lastName != null
                && data.firstName != null);

        return retVal;
    }

    global User createUser(Id portalId, Auth.UserData data){
        if(!canCreateUser(data)) {
            return null;
        }

        if(data.attributeMap.containsKey('sfdc_networkid')) {
            Id contactId;
            contactId = createContact(data);

            Profile p = [SELECT Id FROM profile WHERE name=:EXTERNAL_USER_PROFILE];

            User u = createUser(data,p);

            u.contactId = contactId;
            return u;
        } else {
            Profile p = [SELECT Id FROM profile WHERE name=:INTERNAL_USER_PROFILE];

            User u = createUser(data,p);

            return u;
        }
    }

    global void updateUser(Id userId, Id portalId, Auth.UserData data){

        User u = new User(id=userId);
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        update(u);
    }

    private Id createContact(Auth.UserData data){
        Contact contact = new Contact();
        contact.LastName = data.lastName;
        contact.FirstName = data.firstName;
        contact.Email = data.email;

        // set Account Id
        if (data.attributemap.get('accountId') != null){
            contact.accountId = data.attributemap.get('accountId');
        } else {
            List<Account> accounts = [select Id from Account where Name =:DEFAULT_ACCOUNTNAME];

            contact.accountId = accounts[0].Id;
        }
        insert contact;

        return contact.id;
    }

    private User createUser(Auth.UserData data, Profile p) {
        User u = new User();
        u.username = data.email + ORG_SUFFIX;
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        String alias = data.firstName + data.lastName;

        if(alias.length() > 8) {
            alias = alias.substring(0, 8);
        }
        u.alias = alias;
        u.languagelocalekey = UserInfo.getLanguage();
        u.localesidkey = UserInfo.getLocale();
        u.emailEncodingKey = 'UTF-8';
        u.timeZoneSidKey = 'America/Los_Angeles';
        u.profileId = p.Id;
        return u;
    }
}