/*global define*/

'use strict';

var Vent = require('../Vent'),//
loader = require('../loader'), //
Basket = require('../models/BasketModel'),//
orderActions = require('../actions/orderActions'),//
PageLayout = require('./components/pageLayout'),//
GroupView = require('./partials/groupView'), //
ComboGroupView = require('./partials/comboGroupView'), //
ListView = require('./components/listView');

var CatalogView = PageLayout.extend({

    name : 'catalog',

    onShow : function() {
        this.addEvents({
            'click .back' : 'goBack',
            'click .order_button' : 'triggerOrder',
            'click .edit_button' : 'openEditPanel'
        });
        this.renderItems();
        this.listenTo(this.basket, 'reset change add remove', this.updateBasket, this);
    },

    initialize : function(options) {
        this.items = options.catalog.collection;
        this.sasl = options.sasl;
        this.allowPickup = this.sasl.attributes.services.catalog.paymentOnlineAccepted;
        this.on('show', this.onShow, this);
        this.basket = options.basket;
        this.backToCatalogs = options.backToCatalogs;
        this.catalogId = options.catalog.data.catalogId;
        this.catalogType = options.catalog.data.catalogType;
        console.log("catalogType:" + this.catalogType);
    },

    renderData : function() {
        return {
            basket : this.basket
        };
    },

    goBack : function() {
        if (this.backToCatalogs) {
            this.triggerCatalogsView();
        } else {
            this.triggerRestaurantView()
        }
        ;
    },

    triggerCatalogsView : function() {
        Vent.trigger('viewChange', 'catalogs', this.sasl.getUrlKey());
    },

    triggerRestaurantView : function() {
        Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), {
            reverse : true
        });
    },

    openAddToBasketView : function(model) {
        this.openSubview('addToBasket', model, {
            basket : this.basket
        });
    },

    triggerOrder : function() {
        this.withLogIn(function() {
            Vent.trigger('viewChange', 'order', {
                id : this.sasl.getUrlKey(),
                catalogId : this.catalogId,
                backToCatalogs : this.backToCatalogs
            }, {
                reverse : true
            });
        }.bind(this));
    },

    openEditPanel : function() {
        this.openSubview('editFavorites', this.basket, {
            actions : {
                removeItem : function(selected) {
                    _(selected).each(function(item) {
                        this.basket.removeItem(item);
                    }.bind(this));
                }.bind(this)
            },
            template : require('ejs!../templates/partials/edit_basket_item.ejs')
        });
    },

    updateBasket : function() {
        $('.num-of-items').text(this.basket.count());
        $('.total-price').text(this.basket.getTotalPrice());
    },

    generateColor : function(index) {
        var colors = [ '#FFC4AA', '#AEE5B1', '#B2B2FD', '#FFEC8A' ];
        return colors[index % colors.length];
    },

    renderItems : function() {
        switch (this.catalogType.enumText) {
        case 'COMBO':
            _(this.items.groups).each(function(group, i) {
                if (group.unSubgroupedItems.length === 0)
                    return;
                console.log("catalogView::renderItems: groupType:" + group.groupType);
                switch (group.groupType.enumText) {
                case 'COMBO':
                    /*
                     * use radio boxes
                     */
                    var el = new ComboGroupView({
                        onClick : function(model) {
                            this.openAddToBasketView(model);
                        }.bind(this),
                        color : this.generateColor(i),
                        model : group,
                        parent : this
                    }).render().el;
                    this.$('.cmntyex-items_placeholder').append(el);
                    break;
                case 'ITEMIZED':
                case 'UNDEFINED':
                default:
                    /*
                     * else use regular menu but with check boxes
                     */
                    var el = new GroupView({
                        onClick : function(model) {
                            this.openAddToBasketView(model);
                        }.bind(this),
                        color : this.generateColor(i),
                        model : group,
                        parent : this
                    }).render().el;
                    this.$('.cmntyex-items_placeholder').append(el);
                }
            }.bind(this));
            break;
        case 'ITEMIZED':
        case 'UNDEFINED':
        default:
            _(this.items.groups).each(function(group, i) {
                if (group.unSubgroupedItems.length === 0)
                    return;
                var el = new GroupView({
                    onClick : function(model) {
                        this.openAddToBasketView(model);
                    }.bind(this),
                    color : this.generateColor(i),
                    model : group,
                    parent : this
                }).render().el;

                this.$('.cmntyex-items_placeholder').append(el);

            }.bind(this));
        }
    }

});

module.exports = CatalogView;
