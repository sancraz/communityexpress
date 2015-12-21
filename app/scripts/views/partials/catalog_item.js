/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/catalog-item.ejs'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent');

var catalogItem = Backbone.View.extend({

    tagName: 'li',

    className: 'cmntyex-catalog-item',

    template: template,

    events: {
        'click': 'onClick'
    },

    initialize: function (options) {
        this.onClick = function () {
            options.onClick(this.model);
        }.bind(this);
        this.color = options.color;
    },

    render: function() {
        this.$el.html(this.template(_.extend({}, this.model.attributes, {
            color: this.color
        })));
        return this;
    }
});

module.exports = catalogItem;
