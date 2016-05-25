/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/business.ejs'),
    Vent = require('../../Vent'),
    h = require('../../globalHelpers');

var BusinessItemView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'business_item',

    events: {
        'click': 'openSASLDetailesView'
    },

    initialize: function(options) {
        this.options = options.parent.parent.options || {};
        var self = this;
        _(this.model.get('mapmarkers')).each(function(marker) {
            if (marker.category == 'UNDEFINED') {
                self.markerURL = marker.markerURL;
            };
        });
        this.listenTo(this.model, 'destroy', this.remove, this );
    },

    render: function() {
        var viewModel = h().toViewModel( this.model.toJSON() );
        viewModel.timeStamp = h().toPrettyTime( viewModel.timeStamp );
        this.$el.html(this.template(_.extend( viewModel, { markerURL: this.markerURL } )));
        return this;
    },

    openSASLDetailesView: function() {
        Vent.trigger('viewChange', 'saslDetailed', {
            model: this.model.attributes,
            sasls: this.options.sasls,
            tiles: this.options.tiles
        });
    }

});

module.exports = BusinessItemView;
