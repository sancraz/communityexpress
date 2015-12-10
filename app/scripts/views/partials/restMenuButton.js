/*global define*/

'use strict';

var Backbone = require('backbone'),
    Vent = require('../../Vent'),
    loader = require('../../loader'),
    saslActions = require('../../actions/saslActions');

var RestMenuButton = Backbone.View.extend({

    el: '.menu_button_1',

    events: {
        'click': 'openMenu'
    },

    initialize: function (options) {
        options = options || {};
        this.parent = options.parent;

        this.listenTo(this.parent, 'hide', this.remove, this);
    },

    render: function () {
        this.$el.html();
        return this;
    },

    openMenu: function() {
        this.parent.openSubview('restaurantMenu', {}, this.model.get('services'));
    }
});

module.exports = RestMenuButton;
