/*global define*/

'use strict';

var PanelView = require('../components/panelView'),
    Vent = require('../../Vent'),
    template = require('ejs!../../templates/locationList.ejs'),
    config = require('../../appConfig');

var LocationListView = PanelView.extend({

    template: template,

    initialize: function(options) {
        this.options = options || {};
        this.$el.attr('id', 'cmntyex_locations_panel');
        this.addEvents({
            'change #select-choice': 'selectLocation',
            'click .select-location': 'triggerTilesView'
        });
        this.coords = window.community.coords;   
    },

    render: function() {
        this.$el.html(this.template(this.model));
        return this;
    },

    selectLocation: function() {
        var selected = $('.choose-location').find('option:selected');
        if (selected.val() !== 'Choose your location') {
            this.coords = {
                latitude: selected.attr('lat'),
                longitude: selected.attr('long')
            };
            window.community.coords = this.coords;
        }
    },

    triggerTilesView: function() {
        Vent.trigger('viewChange', 'tiles', this.coords);
    }
});

module.exports = LocationListView;
