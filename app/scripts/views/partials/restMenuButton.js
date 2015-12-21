/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/restMenuButton.ejs'),
    Vent = require('../../Vent'),
    loader = require('../../loader'),
    saslActions = require('../../actions/saslActions');

var RestMenuButton = Backbone.View.extend({

    template: template,

    events: {
        'click': 'openMenu'
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

    openMenu: function() {
        this.parent.openSubview('restaurantMenu', {}, this.model.get('services'));
    }
});

module.exports = RestMenuButton;
