/*global define*/

'use strict';

var Backbone = require('backbone'),
    Vent = require('../../Vent'),
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
        // this.showNavBar();
        this.renderRestMenuButton();
        this.renderAboutUsButton();
        this.renderSignInButton();
        this.renderPromotionButton();

        return this;
    },

    showNavBar: function() {
        var navbar = $('#cmtyx_navbar');
        this.setElement($(navbar[0].outerHTML));
        this.$el.data('role','navbar');
        this.$el.attr('role','');
        this.$el.css({
            position: 'fixed',
            top: '40px',
            display: 'block'
        });
        this.$el.enhanceWithin();
    },

    renderRestMenuButton: function() {
        new RestMenuButton({
            parent: this.page,
            model: this.restaurant
        }).render().el;
    },

    renderAboutUsButton: function() {
        new AboutUsButton({
            parent: this.page,
            model: this.restaurant
        }).render().el;
    },

    renderSignInButton: function() {
        this.$('.menu_button_5').html( new SignInButton({
            parent: this.page,
            model: this.restaurant
        }).render().el);
    },

    renderPromotionButton: function() {
        new PromotionButton({
            parent: this.page,
            model: this.restaurant
        }).render().el;
    }

});

module.exports = NavbarView;