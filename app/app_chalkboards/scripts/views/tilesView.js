/*global define*/

'use strict';

var Vent = require('../Vent'),
    config = require('../appConfig'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    PromotionModel = require('../models/promotionModel'),
    PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    TileView = require('./partials/tile_item');

var TilesView = PageLayout.extend({

    name: 'tiles',

    initialize: function(options) {
        options = options || {};
        this.coords = options.coords;
        this.tiles = options.tiles;
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
    },

    renderData: function(){
        return _.extend( {});
    },

    onShow: function(){
        this.renderTiles();

        try {
            addToHomescreen().show();
        } catch (e) {
            console.warn(' failed showing addToHomescreen');
        }
    },

    onHide: function() {
    },

    renderTiles: function() {
            var el = new ListView({
                ItemView: TileView,
                className: 'cmntyex-tile_list',
                collection: new Backbone.Collection(this.tiles, {
                    model: PromotionModel
                }),
                dataRole: 'none',
                parent: this
            }).render().el;

            this.$('.cmntyex-content_placeholder').append(el);
    }

});

module.exports = TilesView;
