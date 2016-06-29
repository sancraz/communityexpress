/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/roster_combo_item.ejs'),
    Vent = require('../../Vent'),
    h = require('../../globalHelpers');

var RosterComboItemView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    className: 'cmtyex_roster_combo_item',

    events: {
        'click': 'addToCartOrTriggerCatalog'
    },

    initialize: function(options) {
        this.sasl = options.parent.sasl;
        this.listenTo(this.model, 'destroy', this.remove, this );
    },

    render: function() {
        //var viewModel = h().toViewModel( this.model  );
        this.$el.html(this.template( {combo:this.model}  ));
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

module.exports = RosterComboItemView;
