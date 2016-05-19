/*global define*/

'use strict';

var PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    PromotionModel = require('../models/promotionModel'),
    BusinessItemView = require('./partials/business_item');

var BusinessListView = PageLayout.extend({

    name: 'businessList',

    initialize: function(options) {
        this.businesses = options.tiles;
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
    },

    onShow: function(){
        this.addEvents({
            'click .business_title_name': 'sortByName',
            'click .business_title_distance': 'sortByDistance'
        });
        this.renderBusinesses();
    },

    onHide: function() {
    },

    sortByName: function() {
        this.$('.cmntyex-content_placeholder ul').remove();
        this.renderBusinesses('name');
    },

    sortByDistance: function() {
        this.$('.cmntyex-content_placeholder ul').remove();
        this.renderBusinesses('distanceInMiles');
    },

    renderBusinesses: function(sort_key) {
        var el = new ListView({
            ItemView: BusinessItemView,
            className: 'cmntyex-business_list ui-listview',
            collection: new Backbone.Collection(this.businesses, {
                model: PromotionModel,
                comparator: function(model) {
                    return model.get(sort_key);
                }
            }),
            dataRole: 'list-view',
            parent: this
        }).render().el;

        this.$('.cmntyex-content_placeholder').css('margin-top', '20px').append(el);
    }
});

module.exports = BusinessListView;