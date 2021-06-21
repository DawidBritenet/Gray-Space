public with sharing class GS_ClearCart {

    @InvocableMethod
    public static void clearCart() {
        Cache.Session.remove('cart');
    }

}