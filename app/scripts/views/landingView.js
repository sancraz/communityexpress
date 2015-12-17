/*global define*/

'use strict';

var Backbone = require('backbone'),
    Vent = require('../Vent'),
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
        $('.restaurant_gallery').show();
        this.on('show', this.onShow, this);
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
        alert('triggerReviewsView');
    },

    triggerChatView: function() {
        alert('triggerChatView');
    },

    triggerCatalogView: function() {
        Vent.trigger('viewChange', 'catalog', this.model.getUrlKey() );
    },

    triggerPostsView: function() {
        alert('triggerPostsView');
    }

});

module.exports = LandingView;
