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
        this.isFirstTime = options.isFirstTime;
        this.on('show', this.onShow, this);

        if (options.pid) {
            this.openPromotions(options.pid);
        }
    },

    onShow: function(){
        this.addEvents({
            'click .hamburger_button': 'openMenu'
        });
    },

    openMenu: function() {
        this.openSubview('restaurantMenu', {}, this.model.get('services'));
        this.hideMoreButton();
    }


});

module.exports = LandingView;
