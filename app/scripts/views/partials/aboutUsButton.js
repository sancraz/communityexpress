/*global define*/

'use strict';

var Backbone = require('backbone'),
    template = require('../../templates/partials/aboutUsButton.hbs'),
    Vent = require('../../Vent'),
    loader = require('../../loader'),
    saslActions = require('../../actions/saslActions');

var AboutUsButton = Backbone.View.extend({

    template: template,

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
