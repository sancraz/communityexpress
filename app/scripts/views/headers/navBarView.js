/*global define*/

'use strict';

var Backbone = require('backbone'),
    Vent = require('../../Vent'),
    AboutUsButton = require('../partials/aboutUsButton'),
    SignInButton = require('../partials/signInButton'),
    PromotionButton = require('../partials/promotionButton');

var NavBarView = Backbone.View.extend({

    events: {
        'click .menu_button_2': 'triggerContestsView'
    },

    initialize: function(options) {
        this.options = options || {};
        this.restaurant = options.restaurant;
        this.page = options.page;

        if (!this.page) {
            throw new Error('MapHeader::Expected a page');
        }
    },

    render: function() {
        this.showNavBar();
        this.renderAboutUsButton();
        this.renderSignInButton();
        this.renderPromotionButton();

        return this;
    },

    showNavBar: function() {
        var navbar = $('#cmtyx_navbar');
        this.setElement($(navbar[0].outerHTML));
        $(navbar[0]).css('display', 'none');
        this.$el.data('role','navbar');
        this.$el.attr('role','');
        this.$el.css({
            position: 'fixed',
            top: '40px',
            display: 'block'
        });
        this.$el.enhanceWithin();
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
    },

    triggerContestsView: function() {
        this.page.withLogIn(function () {
            Vent.trigger('viewChange', 'contests', [this.restaurant.sa(), this.restaurant.sl()]);
        }.bind(this));
    }   

});

module.exports = NavBarView;