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
    },

    onHide: function() {
        this.$('.theme2_background').hide();
    },

    renderTiles: function() {
        _(this.tiles).each(function (rest_tiles) {

            this.rest_tiles = rest_tiles;

            _(rest_tiles.tiles).each(function(tile) {
                tile.showAdAlert = false;
                tile.coords = this.coords;
            }.bind(this));

            if (rest_tiles.tiles.length > 0) {
                if (rest_tiles.hasAdAlert) {
                    rest_tiles.tiles[0].showAdAlert = true;
                    rest_tiles.tiles[0].adAlertMessage = rest_tiles.adAlertMessage;
                } else {
                    rest_tiles.tiles[0].showAdAlert = false;
                };
            };

            var el = new ListView({
                ItemView: TileView,
                className: 'cmntyex-tile_list',
                collection: new Backbone.Collection(rest_tiles.tiles, {
                    model: PromotionModel
                }),
                dataRole: 'none',
                parent: rest_tiles
            }).render().el;

            this.$('.cmntyex-content_placeholder').append(el);
        }.bind(this));
    }

});

module.exports = TilesView;
