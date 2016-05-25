'use strict';

var Vent = require('../../Vent'),
    CitySelectButton = require('../partials/citySelectButton'),
    FilterButton = require('../partials/filterButton'),
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
        if (window.community.locations) {
            this.renderCities();
        } else {
            var self = this;
            tileActions.getLocations()
                .then(function(locations) {
                    window.community.locations = locations;
                    self.renderCities();
                });
        }
    },

    renderCities: function(locations) {
        this.$('.city_selector').html(new CitySelectButton({
            parent: this.page,
            model: window.community.locations
        }).render().el);
    },

    renderFilterSelector: function() {
        if (window.community.categories) {
            this.renderCategories();
        } else {
            var self = this;
            tileActions.getSASLFilters()
                .then(function(categories) {
                    window.community.categories = categories;
                    self.renderCategories();
                });
        }
    },

    renderCategories: function() {
        this.$('.filter_selector').html(new FilterButton({
            parent: this.page,
            model: window.community.categories
        }).render().el);
    }
});

module.exports = MainHeaderView;