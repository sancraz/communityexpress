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
        this.cardType = options.cardType;
        options = options || {};
        this.sasl = options.sasl;
        this.basket = options.basket;
        this.catalogOptions = this.sasl.attributes.services.catalog;
        this.user = options.user;
        this.country = this.sasl.get('country');
        this.years = this.getYears();
        this.months = this.getMonths();
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
        this.$('input[name=phone]').mask('(000) 000-0000');
    },

    renderData: function () {
        return _.extend({}, this.basket, this.catalogOptions, {
            username: this.user.userName,
            cardTypes: this.cardType,
            country: this.country,
            years: this.years,
            months: this.months
        });
    },

    triggerCatalogView: function() {
        Vent.trigger('viewChange', 'catalog', this.sasl.getUrlKey(), { reverse: true });
    },

    onSubmitClick: function (e) {
        e.preventDefault();
        var cardType = this.$('select.cardtype').val();
        var country = this.$('select.country').val();
        var street = this.$('input[name=street]').val();
        var city = this.$('input[name=city]').val();
        var state = this.$('select.state').val();
        var zip = this.$('input[name=zip]').val();
        var email = this.$('input[name=email]').val();
        var phone = this.$('input[name=phone]').val();
        var firstName = this.$('input[name=firstname]').val();
        var lastName = this.$('input[name=lastname]').val();
        var zip = this.$('input[name=zip]').val();
        var cardNumber = this.$('input[name=cardNumber]').val();
        var expirationMonth = this.$('select.month').val();
        var expirationYear = this.$('select.year').val();
        var cvv = this.$('input[name=cvv]').val();
        var creditCard = this.$('#credit')[0].checked;
        var pickup = this.$('#pickup')[0].checked;
        var items = this.basket.map(function (item) {
            return {
                serviceAccommodatorId: this.sasl.sa(),
                serviceLocationId: this.sasl.sl(),
                priceId: item.get('priceId'),
                itemId: item.get('itemId'),
                itemVersion: item.get('itemVersion'),
                quantity: item.get('quantity')
            };
        }.bind(this))
        this.onSubmit({
            serviceAccommodatorId: this.sasl.sa(),
            serviceLocationId: this.sasl.sl(),
            deliveryEmail: email,
            deliveryContactName: firstName,
            pickupSelected: pickup,
            deliverySelected: !pickup,
            cashSelected: !creditCard,
            creditCardSelected: creditCard,
            items: items,
            billingAdress: {
                zip: zip,
                street: street,
                state: state,
                country: country,
                city: city
            },
            deliveryAddress: {
                street: street,
                city: city,
                state: state,
                zip: zip,
            },
            creditCard: {
                cardType: cardType,
                firstName: firstName,
                lastName: lastName,
                cardNumber: cardNumber,
                expirationMonth: expirationMonth,
                expirationYear: expirationYear,
                cvv: cvv
            }
        });
    },

    onSubmit: function (options) {
        debugger;
        console.log(options);
        loader.show('placing your order');
        return orderActions.placeOrder(
            this.sasl.sa(),
            this.sasl.sl(),
            options
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
        $('#collapsible1').collapsible('expand');
    },

    hidePaymentInfo: function() {
        $('#collapsible1').collapsible('collapse');
    },
    // THE END

    getYears: function() {
        var years = [],
            k = (new Date).getFullYear(),
            j = (new Date).getFullYear()+20;
        for ( var i = k; i < j; i++ ) {
            years.push(i);
        };
        return years;
    },

    getMonths: function() {
        var months = [];
        for (var i = 1; i <= 12; i++) {
            months.push(i);
        };
        return months;
    }
});

module.exports = OrderView;
