/*global define*/

'use strict';

var OpeningHoursView = require('./views/popups/openingHoursView'),
    PromotionsView = require('./views/popups/promotionsView'),
    NewMessageView = require('./views/popups/newMessageView'),
    GalleryView = require('./views/partials/galleryView'),
    RestaurantMenu = require('./views/panels/restaurantMenu'),
    UploadView = require('./views/popups/uploadView'),
    RestaurantListView = require('./views/panels/rest_listView'),
    FiltersView = require('./views/popups/filtersView'),
    ShareView = require('./views/panels/shareView'),
    OptionsView = require('./views/panels/optionsView'),
    SigninView = require('./views/panels/signinView'),
    SignupView = require('./views/panels/signupView'),
    EditFavoritesView = require('./views/panels/editFavoritesView'),
    MyMessagesView = require('./views/panels/myMessagesView'),
    NotificationsView = require('./views/panels/notificationView'),
    AddToBasketView = require('./views/panels/addToBasketView'),
    FavoriteStarView = require('./views/partials/favoriteStar'),
    NewReviewView = require('./views/popups/newReviewView'),
    LegendView = require('./views/panels/legendView'),
    SearchView = require('./views/popups/searchView'),
    configurationActions = require('./actions/configurationActions'),
    UserPicturesView = require('./views/popups/userPicturesView'),
    TextPopup = require('./views/popups/textPopup'),
    MemberPassword = require('./views/popups/memberPassword'),
    ContactPopup = require('./views/popups/contactPopup'),
    MobilePopup = require('./views/popups/mobilePopup'),
    InvitationView = require('./views/popups/invitationView'),
    SupportView = require('./views/popups/supportView'),
    ConfirmationPopup = require('./views/popups/confirmationPopup');

var viewMap = {
    userPictures: UserPicturesView,
    openingHours: OpeningHoursView,
    restaurantList: RestaurantListView,
    promotions: PromotionsView,
    newMessage: NewMessageView,
    gallery: GalleryView,
    restaurantMenu: RestaurantMenu,
    upload: UploadView,
    filters: FiltersView,
    share: ShareView,
    options: OptionsView,
    signin: SigninView,
    signup: SignupView,
    editFavorites: EditFavoritesView,
    myMessages: MyMessagesView,
    favoriteStar: FavoriteStarView,
    newReview: NewReviewView,
    search: SearchView,
    notifications: NotificationsView,
    addToBasket: AddToBasketView,
    text: TextPopup,
    memberPassword: MemberPassword,
    contactPopup: ContactPopup,
    mobilePopup: MobilePopup,
    invitationView: InvitationView,
    confirmationPopup: ConfirmationPopup,
    support: SupportView
};

module.exports = {

    create: function(viewname, model, parent, options) {
    	console.log(viewMap);
        if (viewname === 'legend') {
            return this.createLegendView();
        }
        else if ( viewMap[viewname] ){
            return new viewMap[viewname](_.extend({},{
                collection: model,
                model: model,
                parent: parent
            }, options ));
        }
        throw new Error('unknown view ' + viewname);
    },

    createLegendView: function () {
        return configurationActions.getLegendInfo()
            .then(function (response) {
                return new LegendView(response);
            });
    }

};
