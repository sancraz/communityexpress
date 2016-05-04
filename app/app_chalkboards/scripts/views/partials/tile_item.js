/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/tile.ejs'),
    saslActions = require('../../actions/saslActions'),
    h = require('../../globalHelpers');

var TileView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'tile_item',

    events: {
        'click': 'retrieveSitelette'
    },

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove, this );
    },

    render: function() {
        var viewModel = h().toViewModel( this.model.toJSON() );
        viewModel.timeStamp = h().toPrettyTime( viewModel.timeStamp );
        this.$el.html(this.template( viewModel ));
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
        debugger;
        var sa = this.model.attributes.serviceAccommodatorId,
            sl = this.model.attributes.serviceLocationId;
        saslActions.getSitelette(sa, sl)
            .then(function(resp) {
                console.log(resp);
            });
    }

});

module.exports = TileView;
