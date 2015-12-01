/*global define*/

'use strict';

var Backbone = require('backbone'),
    Vent = require('../../Vent'),
    loader = require('../../loader'),
    saslActions = require('../../actions/saslActions');

var PressMe = Backbone.View.extend({

    template: require('../../templates/partials/pressMe.hbs'),

    events: {
        'click': 'openRestautantMenu'
    },

    initialize: function (options) {
        options = options || {};
        this.parent = options.parent;

        this.listenTo(this.parent, 'hide', this.remove, this);
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    openRestautantMenu: function() {
        this.openSubview('restaurantMenu', {}, this.model.get('services'));
    }
});

module.exports = PressMe;
