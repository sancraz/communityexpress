/*global define*/

'use strict';

var Backbone = require('backbone'),
    Vent = require('../../Vent'),
    loader = require('../../loader'),
    saslActions = require('../../actions/saslActions');

var AboutUsButton = Backbone.View.extend({

    template: require('../../templates/partials/aboutUsButton.hbs'),

    events: {
        'click': 'triggerAboutUsView'
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

    triggerAboutUsView: function() {
        Vent.trigger('viewChange', 'aboutUs', this.model.getUrlKey());
    }
});

module.exports = AboutUsButton;
