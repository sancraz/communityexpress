/*global define*/

'use strict';

var Vent = require('../Vent'),
    config = require('../appConfig'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    saslActions = require('../actions/saslActions'),
    promotionActions = require('../actions/promotionActions'),
    promotionsController = require('../controllers/promotionsController'),
    galleryActions = require('../actions/galleryActions'),
    mediaActions = require('../actions/mediaActions'),
    PageLayout = require('./components/pageLayout'),
    h = require('../globalHelpers');

var RestaurantView = PageLayout.extend({

    name: 'restaurant',

    more: '.more_button',

    initialize: function(options) {
        this.isFirstTime = options.isFirstTime;
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
        this.on('subview:close', this.showMoreButton, this);

        if (options.pid) {
            this.openPromotions(options.pid);
        }
    },

    renderData: function(){
        return _.extend( {}, this.model.attributes, {
            imagePath: config.imagePath,
            isFavorite: this.user.hasFavorite(this.model.get('serviceAccommodatorId'), this.model.get('serviceLocationId'))
        });
    },

    onShow: function(){
        this.addEvents({
            'click .more_button': 'openMenu',
            'click .userMediaService': 'openUpload',
            'click .promotionService': 'openPromotions',
            'click .messagingService': 'triggerChatView',
            'click .openingHours': 'openHours',
            'click .userReviewsService': 'triggerReviewsView',
            'click .userPictures': 'openUserPictures',
            'click .uploadPromtion': 'openUploadPromotion',
            'click .uploadGallery': 'openUploadGallery',
            'click .activatePromotion': 'triggerActivatePromotion',
            'click .deActivatePromotion': 'triggerDeActivatePromotion',
            'click .activateGallery': 'triggerActivateGallery',
            'click .deActiveGallery': 'triggerDeActivateGallery',
            'click .outofNetworkPromotions': 'showOutOfNetworkText',
            'click .outofNetworkOpeningHours': 'showOutOfNetworkText',
            'click .outofNetworkUserReviews': 'showOutOfNetworkText',
            'click .catalog': 'triggerCatalogView',
            'click .wallService': 'triggerPostsView'
        });

        this.renderGallery();

        if (this.isFirstTime) {
            this.flashMenuPanel();
        }

        try {
            addToHomescreen().show();
        } catch (e) {
            console.warn(' failed showing addToHomescreen');
        }

    },

    onHide: function() {
        this.cacheGallery();
    },

    flashMenuPanel: function() {
        this.openMenu();
        setTimeout(this.closeChildren.bind(this), 1000);
    },

    hideMoreButton: function() {
        this.$(this.more).hide();
    },

    showMoreButton: function() {
        this.$(this.more).show();
    },

    scrollToAboutUs: function () {
        $('html,body').animate({
            scrollTop: $('#api_augmented_media_welcome_tile_table').offset().top
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

    openMenu: function() {
        this.openSubview('restaurantMenu', {}, this.model.get('services'));
        this.hideMoreButton();
    },

    renderGallery: function(password) {
        $('.cmntyex-mediastream .restaurant_gallery')
            .prependTo(this.$('.cmntyex-content_placeholder'))
            .show();
    },

    cacheGallery: function() {
        this.$('.restaurant_gallery')
            .hide()
            .prependTo('.cmntyex-mediastream .cmntyex-gallery_placeholder');
    },

    triggerReviewsView: function() {
        Vent.trigger('viewChange', 'reviews', this.model.getUrlKey() );
    },

    triggerCatalogView: function() {
        Vent.trigger('viewChange', 'catalog', this.model.getUrlKey() );
    },

    triggerPostsView: function() {
        Vent.trigger('viewChange', 'posts', this.model.getUrlKey() );
    },

    triggerChatView: function() {
        this.withLogIn(function () {
            Vent.trigger('viewChange', 'chat',  this.model.getUrlKey() );
        }.bind(this));
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

    openUploadLocation: function() {
        this.withLogIn(function () {
            this.openSubview('updateLocation', this.model);
        }.bind(this));
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

    showOutOfNetworkText: function () {
        var text = "To see live updates and content from this business, please ask them to signup. It is easy and free.";
        this.openSubview('text', {}, {text: text});
    }

});

module.exports = RestaurantView;
