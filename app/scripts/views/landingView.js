/*global define*/

'use strict';

var Vent = require('../Vent'),
    config = require('../appConfig'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    saslActions = require('../actions/saslActions'),
    promotionActions = require('../actions/promotionActions'),
    configurationActions = require('../actions/configurationActions'),
    promotionsController = require('../controllers/promotionsController'),
    galleryActions = require('../actions/galleryActions'),
    mediaActions = require('../actions/mediaActions'),
    PageLayout = require('./components/pageLayout'),
    h = require('../globalHelpers');

var LandingView = PageLayout.extend({

    name: 'landing',

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.contests = options.contests;
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide. this);
        $('#landing').css({
            'min-height': '0',
            'margin-bottom': '0px'
        });
    },

    onShow: function(){
        this.addEvents({
            'click .openingHours': 'openHours',
            'click .userMediaService': 'openUpload',
            'click .userReviewsService': 'triggerReviewsView',
            'click .messagingService': 'triggerChatView',
            'click .catalog': 'triggerCatalogView',
            'click .wallService': 'triggerPostsView',
            'click .theme2_button': 'triggerPhotoContestView',
            'click .theme2_generic_banner': 'triggerAboutUsView',

            'click .promotionService': 'openPromotions',
            'click .userPictures': 'openUserPictures',
            'click .uploadPromtion': 'openUploadPromotion',
            'click .uploadGallery': 'openUploadGallery',
            'click .activatePromotion': 'triggerActivatePromotion',
            'click .deActivatePromotion': 'triggerDeActivatePromotion',
            'click .activateGallery': 'triggerActivateGallery',
            'click .deActiveGallery': 'triggerDeActivateGallery',
            'click .outofNetworkPromotions': 'showOutOfNetworkText',
            'click .outofNetworkOpeningHours': 'showOutOfNetworkText',
            'click .outofNetworkUserReviews': 'showOutOfNetworkText'
        });
        this.renderGallery();
    },

    onHide: function() {
        this.$('.theme2_background').hide();
    },

    renderGallery: function(password) {
        this.$('.theme2_background').show();
    },

    triggerAboutUsView: function() {
        Vent.trigger('viewChange', 'aboutUs', this.model.getUrlKey());
    },

    openHours: function() {
        loader.show('retrieving opening hours');
        saslActions.getOpeningHours(this.model.sa(), this.model.sl())
            .then(function (hours) {
                this.openSubview('openingHours', hours);
                loader.hide();
            }.bind(this), function () {
                loader.showFlashMessage('error retrieving opening hours');
            });
    },

    openUpload: function() {
        this.withLogIn(function () {
            this.openSubview('upload', this.model, {
                action: function () {
                    loader.show('uploading');
                    return mediaActions.uploadUserMedia.apply(null, arguments)
                        .then(function () {
                            loader.showFlashMessage('upload successful');
                        }, function (e) {
                            loader.showFlashMessage(h().getErrorMessage(e, 'error uploading'));
                        });
                }
            });
        }.bind(this));
    },

    triggerPhotoContestView: function(e) {
        debugger;
        var target = e.currentTarget;
        var contestUUID = $(target).attr('uuid');
        var s = $(document).find('.photocontestblock');
        if (s.length !== 0) {
            Vent.trigger('viewChange', 'photoContest', {
                sasl: this.model.getUrlKey(),
                id: contestUUID
            });
        }
    },

    triggerReviewsView: function() {
        Vent.trigger('viewChange', 'reviews', this.model.getUrlKey() );
    },

    triggerChatView: function() {
        this.withLogIn(function () {
            Vent.trigger('viewChange', 'chat',  this.model.getUrlKey() );
        }.bind(this));
    },

    triggerCatalogView: function() {
        Vent.trigger('viewChange', 'catalog', this.model.getUrlKey() );
    },

    triggerPostsView: function() {
        Vent.trigger('viewChange', 'posts', this.model.getUrlKey() );
    },

    openPromotions: function(pid) {
        loader.show('retrieving promotions');
        promotionsController.fetchPromotionUUIDsBySasl(
            this.model.get('serviceAccommodatorId'),
            this.model.get('serviceLocationId'),
            this.user.getUID()
        ).then(function(promotions) {
            if(promotions.length < 1) {
                loader.showFlashMessage('No promotions were found');
            } else {
                this.openSubview('promotions', promotions, {pid: pid});
            }
        }.bind(this), function () {
            loader.showFlashMessage('error retrieving promotions');
        });
    },

    openUserPictures: function() {
        loader.show('retrieving user pictures');
        mediaActions.getUserPictures(this.model.sa(), this.model.sl())
            .then(function (pics) {
                this.openSubview('userPictures', pics);
                loader.hide();
            }.bind(this), function () {
                loader.showFlashMessage('error retrieving user pictures');
            });
    },

    openUploadPromotion: function() {
        loader.show('loading');
        promotionActions.getPromotionTypes()
            .then(function (promotionTypes) {
                this.openSubview('upload', this.model, {
                    promotionTypes: promotionTypes,
                    action: function () {
                        loader.show('adding promotion');
                        return promotionActions.createAdhocPromotion.apply(null, arguments)
                            .then(function () {
                                loader.showFlashMessage('promotion added');
                            }, function (e) {
                                loader.showFlashMessage(h().getErrorMessage(e, 'error adding promotion'));
                            });
                    }
                });
                loader.hide();
            }.bind(this), function () {
                loader.showFlashMessage('error retrieving promotion types');
            });
    },

    openUploadGallery: function () {
        loader.show('uploading');
        this.openSubview('upload', this.model, {
            action: function (sa, sl, file, title, message) {
                return galleryActions.createAdhocGalleryItem()
                    .then(function () {
                        loader.showFlashMessage('upload successful');
                    }.bind(this), function (e) {
                        loader.showFlashMessage(h().getErrorMessage(e, 'error uploading'));
                    });
            }
        });
    },

    triggerActivatePromotion: function() {
        Vent.trigger('viewChange', 'editable', {
            sasl: [this.model.sa(), this.model.sl()],
            item: 'promotion',
            action: 'activate'
        });
    },

    triggerDeActivatePromotion: function() {
        Vent.trigger('viewChange', 'editable', {
            sasl: [this.model.sa(), this.model.sl()],
            item: 'promotion',
            action: 'delete'
        });
    },

    triggerActivateGallery: function() {
        Vent.trigger('viewChange', 'editable', {
            sasl: [this.model.sa(), this.model.sl()],
            item: 'gallery',
            action: 'activate'
        });
    },

    triggerDeActivateGallery: function() {
        Vent.trigger('viewChange', 'editable', {
            sasl: [this.model.sa(), this.model.sl()],
            item: 'gallery',
            action: 'delete'
        });
    },

    showOutOfNetworkText: function () {
        var text = "To see live updates and content from this business, please ask them to signup. It is easy and free.";
        this.openSubview('text', {}, {text: text});
    }

});

module.exports = LandingView;
