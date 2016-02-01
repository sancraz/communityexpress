/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/contestButton.ejs'),
    Vent = require('../../Vent'),
    loader = require('../../loader'),
    saslActions = require('../../actions/saslActions');

var ContestButton = Backbone.View.extend({

    template: template,

    events: {
        'click': 'triggerContestsView'
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

    triggerContestsView: function() {
        this.parent.withLogIn(function () {
            if (this.model) {
                Vent.trigger('viewChange', 'contests', [this.model.sa(), this.model.sl()]);
            } else {
                Vent.trigger('viewChange', 'contests', [this.parent.sasl.sa(), this.parent.sasl.sl()]);
            }
        }.bind(this));
    }
});

module.exports = ContestButton;
