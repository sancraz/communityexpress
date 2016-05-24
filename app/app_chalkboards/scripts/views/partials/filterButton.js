/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/filterButton.ejs'),
    Vent = require('../../Vent');

var FilterButton = Backbone.View.extend({

    template: template,

    events: {
        'change .choose-filter': 'filterTiles'
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

    filterTiles: function() {
        var selected = $('.choose-filter').find('option:selected');
        if (selected.val() !== 'Filter') {
            this.domain = selected.val();
            this.coords = window.community.coords;
            Vent.trigger('viewChange', 'tiles', {
                coords: this.coords,
                domain: this.domain
            });
        }
    }

});

module.exports = FilterButton;
