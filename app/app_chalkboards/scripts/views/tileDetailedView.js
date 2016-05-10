/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    PageLayout = require('./components/pageLayout');

var TileDetailedView = PageLayout.extend({

    name: 'tileDetailed',

    initialize: function(options) {
        this.options = options || {};
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
    },

    renderData: function(){
        return _.extend(this.model.tile);
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerTilesView'
        });
    },

    onHide: function() {
    },

    triggerTilesView: function() {
        Vent.trigger('viewChange', 'tiles', this.model.coords);
    }

});

module.exports = TileDetailedView;
