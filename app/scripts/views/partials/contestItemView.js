/*global define*/

'use strict';

var Backbone = require('backbone'),
    template = require('../../templates/partials/contestItem.hbs');

var ContestItemView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    events: {
        'click': 'clicked'
    },

    initialize: function (options) {
        this.onClick = options.onClick;
    },

    clicked: function () {
        this.onClick(this.model.get('contestType').enumText, this.model.get('contestUUID'));
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});

module.exports = ContestItemView;
