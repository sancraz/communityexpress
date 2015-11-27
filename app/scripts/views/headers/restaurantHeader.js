/*global define*/

'use strict';

var Backbone = require('backbone'),
    Vent = require('../../Vent'),
    SignInButton = require('../partials/signInButton'),
    AboutUsButton = require('../partials/aboutUsButton'),
    PromotionButton = require('../partials/promotionButton'),
    template = require('../../templates/toolbars/restaurant_header.hbs');

var RestaurantHeader = Backbone.View.extend({

    template: template,

    events: {
        'click .contest_button': 'triggerContestsView'
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
        this.renderSignInButton();
        this.renderAboutUsButton();
        this.renderPromotionButton();
        return this;
    },

    showNavBar: function () {
        var header = $('.ui-header');
        console.log('HELLO',this.setElement($(header[0].outerHTML)));
        this.setElement($(header[0].outerHTML));
        this.$el.data('role','header');
        this.$el.attr('role','');
        this.$el.css({
            position: 'fixed',
            top: 0,
            display: 'block'
        });
        this.$el.enhanceWithin();
    },

    triggerContestsView: function() {
        alert('CONTEST BUTTON');
        // this.page.withLogIn(function () {
        //     Vent.trigger('viewChange', 'contests', [this.restaurant.sa(), this.restaurant.sl()]);
        // }.bind(this));
    },

    renderSignInButton: function() {
        this.$('.sign_in_button').html( new SignInButton({
            parent: this.page,
            model: this.restaurant
        }).render().el);
    },

    renderAboutUsButton: function() {
        this.$('.about_us_button').html( new AboutUsButton({
            parent: this.page,
            model: this.restaurant
        }).render().el);
    },

    renderPromotionButton: function() {
        this.$('.deals_button').html( new PromotionButton({
            parent: this.page,
            model: this.restaurant
        }).render().el);
    },

    openShare: function() {
        this.page.openSubview('text', {}, {
            text: window.location.href,
            select: true,
            wordBreak: true
        });
    }
});

module.exports = RestaurantHeader;
