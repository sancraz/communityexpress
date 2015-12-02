/*global define*/

'use strict';

var Backbone = require('backbone'),
    Vent = require('../../Vent'),
    PressMe = require('../partials/pressMe');

var NavBarView = Backbone.View.extend({

    events: {
        'click #cmtyx_navbar div' : 'openSettings',
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
        // this.renderPressMe();
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

    renderPressMe: function() {
        $('#cmtyx_navbar').find('div').html( new PressMe({
            parent: this.page,
            model: this.restaurant
        }).render().el);
    }

});

module.exports = NavBarView;