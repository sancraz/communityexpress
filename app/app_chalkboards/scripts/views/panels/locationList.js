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
            'change #select-choice': 'selectLocation',
            'click .select-location': 'triggerTilesView'
        });
        // this.options.coords = geolocation.getPreviousLocation();
        this.options.coords = {
            latitude: '37.772099',
            longitude: '-122.415656'
        };
        
    },

    render: function() {
        this.$el.html(this.template({model: this.model}));
        return this;
    },

    selectLocation: function() {
        // console.log($('.choose-location').find('option:selected').val());
    },

    triggerTilesView: function() {
        Vent.trigger('viewChange', 'tiles', this.options.coords);
    }
});

module.exports = LocationListView;
