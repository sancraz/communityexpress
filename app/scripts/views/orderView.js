/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    PageLayout = require('./components/pageLayout'),
    orderActions = require('../actions/orderActions'),
    h = require('../globalHelpers');

var OrderView = PageLayout.extend({

    name: 'order',

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.basket = options.basket;
        this.catalogOptions = this.sasl.attributes.services.catalog;
        this.user = options.user;
        this.on('show', this.onShow, this);
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerCatalogView',
            'click .cancel_button': 'triggerCatalogView',
            'click .submit_button': 'onSubmitClick',
            'click .showPaymentInfo': 'showPaymentInfo',
            'click .hidePaymentInfo': 'hidePaymentInfo'
        });
    },

    renderData: function () {
        return _.extend({}, this.basket, this.catalogOptions, {
            username: this.user.userName,
        });
    },

    triggerCatalogView: function() {
        Vent.trigger('viewChange', 'catalog', this.sasl.getUrlKey(), { reverse: true });
    },

    onSubmitClick: function (e) {
        e.preventDefault();
        var street = this.$('input[name=street]').val();
        var city = this.$('input[name=city]').val();
        var state = this.$('input[name=state]').val();
        var zip = this.$('input[name=zip]').val();
        var email = this.$('input[name=email]').val();
        var phone = this.$('input[name=phone]').val();
        var name = this.$('input[name=name]').val();
        var cardType = this.$('input[name=cardNumber]').val();
        var cardNumber = this.$('input[name=cardNumber]').val();
        var expiration = this.$('input[name=expr]').val();
        var cvv = this.$('input[name=cvv]').val();
        var creditCard = this.$('#credit')[0].checked;
        var pickup = this.$('#pickup')[0].checked;
        this.onSubmit({
            deliveryEmail: email,
            deliveryContactName: name,
            pickupSelected: pickup,
            deliverySelected: !pickup,
            cashSelected: !creditCard,
            creditCardSelected: creditCard,
            deliveryAddress: {
                street: street,
                city: city,
                state: state,
                zip: zip,
            },
            creditCard: {
                cardType: cardType,
                name: name,
                cardNumber: cardNumber,
                expr: expiration,
                cvv: cvv
            }
        });
    },

    onSubmit: function (options) {
        loader.show('placing your order');
        return orderActions.placeOrder(
            this.sasl.sa(),
            this.sasl.sl(),
            options,
            this.basket.map(function (item) {
                return {
                    serviceAccommodatorId: this.sasl.sa(),
                    serviceLocationId: this.sasl.sl(),
                    priceId: item.get('priceId'),
                    itemId: item.get('itemId'),
                    itemVersion: item.get('itemVersion'),
                    quantity: item.get('quantity')
                };
            }.bind(this))
        ).then(function () {
            this.basket.reset();
            loader.showFlashMessage('order successful');
            setTimeout(function () {
                this.triggerCatalogView();
            }.bind(this), 3000);
        }.bind(this), function () {
            loader.showFlashMessage('error placing your order');
        });
    },

    // EXPAND/COLLAPSE CREDIT INFO WHEN CREDIT/CASH SELECTED
    showPaymentInfo: function() {
        console.log('SHOULD EXPAND');
        $('#collapsible1').collapsible('expand');
    },

    hidePaymentInfo: function() {
        console.log('SHOULD COLLAPSE');
        $('#collapsible1').collapsible('collapse');
    },
    // THE END 

});

module.exports = OrderView;
