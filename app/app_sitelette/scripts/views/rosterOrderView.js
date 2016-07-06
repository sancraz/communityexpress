/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    PageLayout = require('./components/pageLayout'),
    orderActions = require('../actions/orderActions'),
    states = require('../states'),
    h = require('../globalHelpers');

var RosterOrderView = PageLayout.extend({

    name: 'roster_order',

    initialize: function(options) {
        this.cardType = options.cardType;
        options = options || {};
        this.sasl = options.sasl;
        this.basket = options.basket;
        this.editModel=options.editModel;
        this.catalogOptions = this.sasl.attributes.services.catalog;
        this.user = options.user;
        this.country = this.sasl.get('country');
        this.years = this.getYears();
        this.months = this.getMonths();
        this.states = this.getStates();
        this.rosterId = options.rosterId;
        this.backToCatalog = options.backToCatalog;
        this.launchedViaURL=options.launchedViaURL;
        this.backToCatalogs = options.backToCatalogs; /* this is passed on to catalogview, for its' decision-making */
        this.priceAddons = options.priceAddons;
        this.calculateTaxes();
        this.getTotalPriceWithTax();
        this.on('show', this.onShow, this);
        this.navbarView=options.navbarView;
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerRosterView',
            'click .cancel_button': 'triggerRosterView',
            'click .submit_button': 'onSubmitClick',
            'click .showPaymentInfo': 'showPaymentInfo',
            'click .hidePaymentInfo': 'hidePaymentInfo'
        });
    },

    renderData: function () {

        var tmpData = _.extend({},  this.catalogOptions, {
            username: this.user.userName,
            cardTypes: this.cardType,
            country: this.country,
            years: this.years,
            months: this.months,
            states: this.states,
            priceAddons: this.priceAddons,
            taxes: this.taxes,
            totalPriceWithTax: this.totalPriceWithTax,
            basket:this.basket,
            editModel:this.editModel
        });

        return tmpData;
    },

    calculateTaxes: function() {
        this.taxes = parseInt(this.basket.getTotalPrice()*this.priceAddons.taxState)/100;
    },

    getTotalPriceWithTax: function() {
        var priceWithoutTaxes = parseFloat(this.basket.getTotalPrice().toFixed(2));
        this.totalPriceWithTax = parseFloat((this.taxes + priceWithoutTaxes).toFixed(2));
    },

    triggerRosterView: function() {


      Vent.trigger('viewChange', 'roster', {
          sasl: this.sasl.id,
          id: this.rosterId,
          backToRoster:true,
          rosterId:this.rosterId,
          launchedViaURL:this.launchedViaURL,
       }, { reverse: false });

    },

    onSubmitClick: function (e) {
        if (this.$('.save_credit_data').find('input').is(':checked')) {
            this.saveCreditCardForFutureReference = true;
        } else {
            this.saveCreditCardForFutureReference = false;
        };
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
        var expirationMonth = parseInt(this.$('select.month').val());
        var expirationYear = parseInt(this.$('select.year').val());
        var cvv = this.$('input[name=cvv]').val();
        var creditCard = this.$('#credit')[0].checked;
        var pickup = this.$('#pickup')[0].checked;

        var items = this.basket.getItems(this.sasl);

        this.onSubmit({
            serviceAccommodatorId: this.sasl.sa(),
            serviceLocationId: this.sasl.sl(),
            deliveryEmail: email,
            deliveryPhone: phone,
            deliveryContactName: firstName,
            pickupSelected: pickup,
            deliverySelected: !pickup,
            cashSelected: !creditCard,
            creditCardSelected: creditCard,
            items: items,
            taxAmount: this.taxes,
            totalAmount: this.totalPriceWithTax,
            currencyCode: this.priceAddons.currencyCode,
            saveCreditCardForFutureReference: this.saveCreditCardForFutureReference,
            billingAddress: {
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
                cardType: cardType === 'Card Type' ? 'UNDEFINED' : cardType,
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
        loader.show('placing your order');
        return orderActions.placeOrder(
            this.sasl.sa(),
            this.sasl.sl(),
            options
        ).then(function () {
            this.basket.reset();
            loader.showFlashMessage('order successful');
            setTimeout(function () {
                this.triggerRosterView( );
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
    },

    getStates: function() {
        return states;
    }
});

module.exports = RosterOrderView;
