/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/aboutUsButton.ejs'),
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
        if (this.model) {
            Vent.trigger('viewChange', 'aboutUs', this.model.getUrlKey());
        } else {
            Vent.trigger('viewChange', 'aboutUs', this.parent.sasl.getUrlKey());
        }
    }
});

module.exports = AboutUsButton;
