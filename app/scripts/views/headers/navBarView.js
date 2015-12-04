/*global define*/

'use strict';

var Backbone = require('backbone'),
    Vent = require('../../Vent'),
    SignInButton = require('../partials/signInButton');

var NavBarView = Backbone.View.extend({

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

    renderSignInButton: function() {
        this.$('.menu_button_5').html( new SignInButton({
            parent: this.page,
            model: this.restaurant
        }).render().el);
    },

});

module.exports = NavBarView;