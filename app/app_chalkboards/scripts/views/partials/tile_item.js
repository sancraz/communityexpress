/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/tile.ejs'),
    Vent = require('../../Vent'),
    saslActions = require('../../actions/saslActions'),
    h = require('../../globalHelpers');

var TileView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'tile_item',

    events: {
        'click': 'triggerTileDetailedView'
    },

    initialize: function(options) {
        this.options = options.parent.parent.options;
        this.coords = this.model.get('coords');
        this.listenTo(this.model, 'destroy', this.remove, this );
    },

    render: function() {
        var viewModel = h().toViewModel( this.model.toJSON() );
        viewModel.timeStamp = h().toPrettyTime( viewModel.timeStamp );
        this.$el.html(this.template(_.extend( viewModel )));
        // this.addClasses();
        return this;
    },

    addClasses: function() {
        if ( !this.model.get('fromUser') || this.model.get('fromUser') === 'false' ){
            this.$el.addClass('restaurant');
        }else{
            this.$el.addClass('user');
        }
    },

    triggerTileDetailedView: function() {
        this.sa = this.model.get('serviceAccommodatorId');
        this.sl = this.model.get('serviceLocationId');
        if (this.model.attributes.promoType.enumText !== 'CAMPAIGN_SUBSCRIBE_FOR_NOTIFICATION') {
            Vent.trigger( 'viewChange', 'tileDetailed', {
                model: this.model,
                options: this.options
            });
        };
    }

});

module.exports = TileView;
