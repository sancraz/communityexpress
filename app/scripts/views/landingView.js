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

var LandingView = PageLayout.extend({

    name: 'landing',

    initialize: function(options) {
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide. this);
    },

    onShow: function(){
        this.addEvents({
            'click .openingHours': 'openHours',
            'click .userMediaService': 'openUpload',
            'click .userReviewsService': 'triggerReviewsView',
            'click .messagingService': 'triggerChatView',
            'click .catalog': 'triggerCatalogView',
            'click .wallService': 'triggerPostsView'
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
    }

});

module.exports = LandingView;
