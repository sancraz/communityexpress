/*global define*/

'use strict';

var PanelView = require('../components/panelView'),
    Vent = require('../../Vent'),
    template = require('ejs!../../templates/locationList.ejs'),
    geolocation = require('../../Geolocation'),
    config = require('../../appConfig');

var LocationListView = PanelView.extend({

    template: template,

    initialize: function(options) {
        this.options = options || {};
        this.$el.attr('id', 'cmntyex_menu_panel');
        this.addEvents({
            'click .select-location': 'triggerTilesView'
        });
        this.options.coords = geolocation.getPreviousLocation();
    },

    render: function() {
        this.$el.html(this.template({model: this.model}));
        return this;
    },

    triggerTilesView: function() {
        Vent.trigger('viewChange', 'tiles', this.options.coords);
    }
});

module.exports = LocationListView;
