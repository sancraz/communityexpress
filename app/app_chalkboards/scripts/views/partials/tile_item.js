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
        'click': 'retrieveSitelette'
    },

    initialize: function(options) {
        this.tileOpts = options.parent.parent.rest_tiles;
        this.listenTo(this.model, 'destroy', this.remove, this );
    },

    render: function() {
        var viewModel = h().toViewModel( this.model.toJSON() );
        viewModel.timeStamp = h().toPrettyTime( viewModel.timeStamp );
        this.$el.html(this.template(_.extend( viewModel, this.tileOpts )));
        this.addClasses();
        return this;
    },

    addClasses: function() {
        if ( !this.model.get('fromUser') || this.model.get('fromUser') === 'false' ){
            this.$el.addClass('restaurant');
        }else{
            this.$el.addClass('user');
        }
    },

    retrieveSitelette: function() {
        this.sa = this.tileOpts.serviceAccommodatorId;
        this.sl = this.tileOpts.serviceLocationId;
        Vent.trigger( 'viewChange', 'tileDetailed', { sa:this.sa, sl:this.sl });
    }

});

module.exports = TileView;
