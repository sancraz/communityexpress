/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/citySelectButton.ejs'),
    Vent = require('../../Vent');

var CitySelectButton = Backbone.View.extend({

    template: template,

    events: {
        'change .choose-city': 'selectLocation'
    },

    initialize: function(options) {
        options = options || {};
        this.parent = options.parent;
        this.listenTo(this.parent, 'hide', this.remove, this);
    },

    render: function() {
        this.$el.html(this.template(_.extend(this.model)));
        return this;
    },

    selectLocation: function() {
        var selected = $('.choose-city').find('option:selected');
        if (selected.val() !== 'Choose city') {
            this.coords = {
                latitude: selected.attr('lat'),
                longitude: selected.attr('long')
            };
            window.community.coords = this.coords;
            window.community.city = selected.val();
            Vent.trigger('viewChange', 'tiles', this.coords);
        }
    }

});

module.exports = CitySelectButton;
