/*global define*/

'use strict';

var Backbone = require('backbone'),
    template = require('../../templates/legendView.hbs'),
    PanelView = require('../components/panelView');

var defaults = {
    url: '',
    title: 'Legend',
    markers: []
};

var LegendView = PanelView.extend({

    template: template,

    initialize: function(options) {
        options = options || {};
        this.legendData = _.extend({}, defaults, options);
        this.$el.attr('id', 'cmntyex_legend_panel' );
    },

    render: function() {
        this.$el.html(this.template(this.legendData));
        return this;
    }

});

module.exports = LegendView;
