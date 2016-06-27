/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/roster-item.ejs'),
    Vent = require('../../Vent'),
    h = require('../../globalHelpers');

var RosterItemView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'roster_item',

    events: {
        'click': 'addToCartOrTriggerCatalog'
    },

    initialize: function(options) {
        this.sasl = options.parent.parent.sasl;
        this.listenTo(this.model, 'destroy', this.remove, this );
    },

    render: function() {
        var viewModel = h().toViewModel( this.model.toJSON() );
        this.$el.html(this.template(_.extend( viewModel )));
        return this;
    },

    addToCartOrTriggerCatalog: function() {
        if(this.model){
            console.log(" adding to cart");
        }else{ 
        Vent.trigger('viewChange', 'catalog', {
            id: this.sasl.id,
            catalogId: this.model.get('catalogId'),
            backToCatalogs: true
        });
        }
    }

});

module.exports = RosterItemView;
