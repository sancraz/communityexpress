/*global define*/

'use strict';

var Vent = require('../../Vent'),
    RestMenuButton = require('../partials/restMenuButton'),
    AboutUsButton = require('../partials/aboutUsButton'),
    SignInButton = require('../partials/signInButton'),
    PromotionButton = require('../partials/promotionButton');

var NavbarView = Backbone.View.extend({

    el: '#cmtyx_navbar',

    initialize: function(options) {
        this.options = options || {};
        this.restaurant = options.restaurant;
        this.page = options.page;

        if (!this.page) {
            throw new Error('MapHeader::Expected a page');
        }
    },

    render: function() {
        this.renderRestMenuButton();
        this.renderAboutUsButton();
        this.renderSignInButton();
        this.renderPromotionButton();

        return this;
    },

    renderRestMenuButton: function() {
        this.$('.menu_button_1').html( new RestMenuButton({
            parent: this.page,
            model: this.restaurant
        }).render().el);
    },

    renderAboutUsButton: function() {
        this.$('.menu_button_4').html( new AboutUsButton({
            parent: this.page,
            model: this.restaurant
        }).render().el);
    },

    renderSignInButton: function() {
        this.$('.menu_button_5').html( new SignInButton({
            parent: this.page,
            model: this.restaurant
        }).render().el);
    },

    renderPromotionButton: function() {
        this.$('.menu_button_3').html( new PromotionButton({
            parent: this.page,
            model: this.restaurant
        }).render().el);
    }

});

module.exports = NavbarView;