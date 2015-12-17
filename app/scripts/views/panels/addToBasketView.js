/*global define*/

'use strict';

var Backbone = require('backbone'),
    template = require('../../templates/addToBasket.hbs'),
    PanelView = require('../components/panelView');

var AddToBasketView = PanelView.extend({

    template: template,

    initialize: function(options) {
        options = options || {};
        this.$el.attr('id', 'cmntyex_add-to-basket_panel' );
        this.quantity = new Backbone.Model({
            value: 1
        });
        this.basket = options.basket;

        this.addEvents({
            'click .plus_button': 'incrementQuantity',
            'click .minus_button': 'decrementQuantity',
            'click .add_button': 'addToBasket'
        });

        this.listenTo(this.quantity, 'change:value', this.updateQuantity, this);
    },

    incrementQuantity: function () {
        this.quantity.set('value', this.quantity.get('value') + 1);
    },

    decrementQuantity: function () {
        var qty = this.quantity.get('value');

        if (qty === 0) return;

        this.quantity.set('value', this.quantity.get('value') - 1);
    },

    updateQuantity: function () {
        $('.quantity').text(this.quantity.get('value'));
    },

    addToBasket: function () {
        this.basket.addItem(this.model, this.quantity.get('value'));
        this.shut();
    },

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});

module.exports = AddToBasketView;
