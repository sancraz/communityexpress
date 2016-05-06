/*global define*/

'use strict';

var Vent = require('../Vent'),
    config = require('../appConfig'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    saslActions = require('../actions/saslActions'),
    promotionActions = require('../actions/promotionActions'),
    configurationActions = require('../actions/configurationActions'),
    promotionsController = require('../controllers/promotionsController'),
    galleryActions = require('../actions/galleryActions'),
    mediaActions = require('../actions/mediaActions'),
    updateActions = require('../actions/updateActions'),
    PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    TileView = require('./partials/tile_item'),
    h = require('../globalHelpers');

var TilesView = PageLayout.extend({

    name: 'tiles',

    initialize: function(options) {
        options = options || {};
        this.tiles = options.tiles;
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
    },

    renderData: function(){
        return _.extend( {});
    },

    onShow: function(){
        this.addEvents();
        this.renderTiles(this.tiles);

        try {
            addToHomescreen().show();
        } catch (e) {
            console.warn(' failed showing addToHomescreen');
        }
    },

    onHide: function() {
        this.$('.theme2_background').hide();
    },

    renderTiles: function(tiles) {
        this.$('.cmntyex-tiles_placeholder').html( new ListView({
            ItemView: TileView,
            className: 'cmntyex-tile_list',
            collection: tiles,
            dataRole: 'none',
            parent: this
        }).render().el);
    }

});

module.exports = TilesView;
