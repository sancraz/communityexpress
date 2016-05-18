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
        this.renderBusinesses();
    },

    onHide: function() {
    },

    renderBusinesses: function() {
        var el = new ListView({
            ItemView: BusinessItemView,
            className: 'cmntyex-tile_list ui-listview',
            collection: new Backbone.Collection(this.businesses, {
                model: PromotionModel
            }),
            dataRole: 'list-view',
            parent: this
        }).render().el;

        this.$('.cmntyex-content_placeholder').append(el);
    }
});

module.exports = BusinessListView;