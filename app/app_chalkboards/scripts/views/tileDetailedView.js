/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    PageLayout = require('./components/pageLayout');

var TileDetailedView = PageLayout.extend({

    name: 'tileDetailed',

    initialize: function(options) {
        options = options || {};
        this.element = options.model.landingViewDiv;
        this.tiles = options.tiles;
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
    },

    // renderData: function(){
    //     return _.extend({});
    // },

    onShow: function(){
        this.$el.append(this.element);
        this.addEvents();
    },

    onHide: function() {
    }

});

module.exports = TileDetailedView;
