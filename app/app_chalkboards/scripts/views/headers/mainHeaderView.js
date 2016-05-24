'use strict';

var Vent = require('../../Vent'),
    CitySelectButton = require('../partials/citySelectButton'),
    tileActions = require('../../actions/tileActions'),
    loader = require('../../loader');

var MainHeaderView = Backbone.View.extend({

    initialize: function(options) {
        this.options = options || {};
        this.page = options.page;
        this.listenTo(this.page, 'hide', this.remove, this);
    },

    render: function() {
        var header = $('#cmtyx_header');
        this.setElement($(header[0].outerHTML));
        this.$el.appendTo('body');
        this.$el.append('<div class="city_selector"></div>');
        this.$el.append('<div class="chalkboards_icon"></div>');
        this.$el.append('<div class="filter_selector"></div>');
        this.$el.find('.theme2_banner').text('');
        this.renderCitySelector();
        this.renderFilterSelector();
        return this;
    },

    renderCitySelector: function() {
        var self = this;
        tileActions.getLocations()
            .then(function(locations) {
                self.$('.city_selector').html( new CitySelectButton({
                    parent: self.page,
                    model: locations
                }).render().el);
            });
    },

    renderFilterSelector: function() {
        console.log('show filters');
    }
});

module.exports = MainHeaderView;