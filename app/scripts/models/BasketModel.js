/*global define*/

'use strict';

var Backbone = require('backbone');

var BasketItem = Backbone.Model.extend({

    idAttribute: 'uUID',

    add: function (n) {
        var curr = this.get('quantity');
        this.set('quantity', curr + (n || 1));
    }
});

var Basket = Backbone.Collection.extend({

    model: BasketItem,

    initialize: function () {
        this.prices = new Backbone.Model();
    },

    addItem: function (item, n) {
        var curr = this.get(item.get('uUID'));
        if (curr) {
            curr.add(n);
        } else {
            this.add(new BasketItem(_.extend({}, item.attributes, {
                quantity: n || 1
            })));
        }
    },

    removeItem: function (item) {
        this.remove(item.get('uUID'));
    },

    getNumOf: function (item) {
        var model = this.get(item.get('uUID'));
        if (model) {
            return model.get('quantity');
        } else {
            return 0;
        }
    },

    getTotalPrice: function () {
        return this.reduce(function (sum, item, id) {
            return sum += item.get('quantity') * item.get('price');
        }.bind(this), 0).toFixed(2);
    },

    count: function () {
        return this.reduce(function (sum, item) {
            return sum += item.get('quantity');
        }.bind(this), 0);
    },

});

module.exports = Basket;
