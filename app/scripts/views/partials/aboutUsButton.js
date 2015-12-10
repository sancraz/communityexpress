/*global define*/

'use strict';

var Backbone = require('backbone'),
    Vent = require('../../Vent'),
    loader = require('../../loader'),
    saslActions = require('../../actions/saslActions');

var AboutUsButton = Backbone.View.extend({

    el: '.menu_button_4',

    events: {
        'click': 'triggerAboutUsView'
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

    triggerAboutUsView: function() {
        Vent.trigger('viewChange', 'aboutUs', this.model.getUrlKey());
    }
});

module.exports = AboutUsButton;
