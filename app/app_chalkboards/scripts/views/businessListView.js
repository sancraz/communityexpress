/*global define*/

'use strict';

var PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    PromotionModel = require('../models/promotionModel'),
    BusinessItemView = require('./partials/business_item'),
    Vent = require('../Vent');

var BusinessListView = PageLayout.extend({

    name: 'businessList',

    initialize: function(options) {
        this.options = options || {};
        this.sasls = options.sasls;
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
    },

    onShow: function(){
        this.addEvents({
            'click .business_title_name.ui-icon-carat-d': 'sortByName',
            'click .business_title_distance.ui-icon-carat-d': 'sortByDistance',
            'click .business_title_name.ui-icon-carat-u': 'sortByNameReverse',
            'click .business_title_distance.ui-icon-carat-u': 'sortByDistanceReverse',
            'click .back': 'triggerTilesView'
        });
        this.renderBusinesses();
    },

    onHide: function() {
    },

    sortByName: function() {
        this.$('.cmntyex-content_placeholder ul').remove();
        this.$('.business_title_name')
            .removeClass('ui-icon-carat-d')
            .addClass('ui-icon-carat-u');
        var reverse = false;
        this.renderBusinesses('name', reverse);
    },

    sortByDistance: function() {
        this.$('.cmntyex-content_placeholder ul').remove();
        this.$('.business_title_distance')
            .removeClass('ui-icon-carat-d')
            .addClass('ui-icon-carat-u');
        var reverse = false;
        this.renderBusinesses('distanceInMiles', reverse);
    },

    sortByNameReverse: function() {
        this.$('.cmntyex-content_placeholder ul').remove();
        this.$('.business_title_name')
            .removeClass('ui-icon-carat-u')
            .addClass('ui-icon-carat-d');
        var reverse = true;
        this.renderBusinesses('name', reverse);
    },

    sortByDistanceReverse: function() {
        this.$('.cmntyex-content_placeholder ul').remove();
        this.$('.business_title_distance')
            .removeClass('ui-icon-carat-u')
            .addClass('ui-icon-carat-d');
        var reverse = true;
        this.renderBusinesses('distanceInMiles', reverse);
    },

    renderBusinesses: function(sort_key, reverse) {
        var el = new ListView({
            ItemView: BusinessItemView,
            className: 'cmntyex-business_list ui-listview',
            collection: new Backbone.Collection(this.sasls, {
                model: PromotionModel,
                comparator: function(model) {
                    if (reverse) {
                        return model.get(sort_key);
                    } else {
                        return -model.get(sort_key);
                    }
                }
            }),
            dataRole: 'list-view',
            parent: this
        }).render().el;

        this.$('.cmntyex-content_placeholder').css('margin-top', '20px').append(el);
    },

    triggerTilesView: function() {
        Vent.trigger('viewChange', 'tiles', this.options);
    }
});

module.exports = BusinessListView;