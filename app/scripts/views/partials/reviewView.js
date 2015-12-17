/*global define*/

'use strict';

var Backbone = require('backbone'),
    template = require('../../templates/partials/review.hbs'),
    h = require('../../globalHelpers'),
    Vent = require('../../Vent');

var ReviewView = Backbone.View.extend({

    tagName: 'li',

    className: 'cmntyex-review',

    template: template,

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

module.exports = ReviewView;
