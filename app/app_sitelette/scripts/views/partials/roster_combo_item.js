/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/roster_combo_item.ejs'), Vent = require('../../Vent'), h = require('../../globalHelpers');

var RosterComboItemView = Backbone.View.extend({

    template : template,

    tagName : 'li',

    className : 'cmtyex_roster_combo_item',

    events : {
        'click .roster_combo_item_add_button' : 'addComboToCartLocal'
    },

    initialize : function(options) {
        this.sasl = options.parent.sasl;
        this.listenTo(this.model, 'destroy', this.remove, this);
        this.addComboToCart = options.addComboToCart;
    },

    render : function() {

        this.$el.html(this.template({
            combo : this.model
        }));
        return this;
    },

    addComboToCartLocal : function() {
        this.addComboToCart();

    }

});

module.exports = RosterComboItemView;
