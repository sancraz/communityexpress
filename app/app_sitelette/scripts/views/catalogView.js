/*global define*/

'use strict';

var Vent = require('../Vent'), //
loader = require('../loader'), //
CatalogBasketModel = require('../models/CatalogBasketModel'), //
orderActions = require('../actions/orderActions'), //
PageLayout = require('./components/pageLayout'), //
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
        this.navbarView.hide(); 

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
        this.catalogDisplayText = options.catalog.data.displayText;
        this.colors = options.catalog.data.colors;// [ '#444444', '#00ffB1',
        // '#ffB2FD', '#FFCCCC' ];
        /* add catalog name to basket */
        this.basket.catalogDisplayText = options.catalog.collection.displayText;
        this.navbarView = options.navbarView;
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
            this.triggerRestaurantView();
            this.navbarView.show();
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

    openAddToBasketView : function(model, groupId, groupDisplayText, catalogId, catalogDisplayText) {
        // console.log("CatalogView:openAddToBasketView
        // :"+model.attributes.itemName+", "+groupId+", "+catalogId);

        this.openSubview('addToBasket', model, {
            basket : this.basket,
            groupId : groupId,
            groupDisplayText : groupDisplayText,
            catalogId : catalogId,
            catalogDisplayText : catalogDisplayText
        });
    },

    toggleBasketComboEntry : function(model, groupId, groupDisplayText,catalogId,catalogDisplayText) {
        // console.log("CatalogView:toggleBasketComboEntry
        // :"+model.attributes.itemName+", "+groupId+", "+catalogId);
        this.basket.changeItemInCombo(model, groupId, groupDisplayText,catalogId,catalogDisplayText);
    },

    triggerOrder : function() {
        this.withLogIn(function() {
            Vent.trigger('viewChange', 'catalog_order', {
                id : this.sasl.getUrlKey(),
                catalogId : this.catalogId,
                backToCatalog : true,// /* This will always be true */
                backToCatalogs : this.backToCatalogs, /*
                                                         * not used by order,
                                                         * but passed back to
                                                         * catalog view
                                                         */
                navbarView : this.navbarView
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
        if (this.basket.hasCombo()) {
            /* update combo count */
            $('#catalog_combo_count_div').show();
            $('.num-of-combo-items').text(this.basket.getComboCount());
            $('.combo-total-price').text(this.basket.getComboPrice());
        } else {
            /* hide the combo line */
            $('#catalog_combo_count_div').hide();
        }

        /*
         * update the items
         */
        if (this.basket.hasCombo()) {
            $('.num-of-items').text(this.basket.nonComboItemCount());
            $('.total-price').text(this.basket.getNonComboPrice());
        } else {
            $('.num-of-items').text(this.basket.count());
            $('.total-price').text(this.basket.getTotalPrice());
        }

    },

    generateColor : function(index) {
        // var colors = [ '#FFC4AA', '#AEE5B1', '#B2B2FD', '#FFEC8A' ];
        return this.colors[index % this.colors.length];
    },

    renderItems : function() {

        this.updateBasket();

        var catalogType = this.catalogType.enumText;
        var catalogId = this.catalogId;
        var catalogDisplayText = this.catalogDisplayText;

        switch (catalogType) {
        case 'COMBO':

            _(this.items.groups).each(function(group, i) {
                if (group.unSubgroupedItems.length === 0)
                    return;

                var groupType = group.groupType.enumText;
                var groupId = group.groupId;
                var groupDisplayText = group.groupDisplayText;

                switch (groupType) {
                case 'COMBO':
                    /*
                     * use radio boxes
                     */
                    var el = new ComboGroupView({
                        onChange : function(model) {
                            this.toggleBasketComboEntry(model, groupId, groupDisplayText,catalogId,catalogDisplayText);
                        }.bind(this),
                        color : this.generateColor(i),
                        model : group,
                        parent : this
                    }).render().el;
                    this.$('.cmntyex-items_placeholder').append(el);
                    /*
                     * now add the first item for combos, but only if basket
                     * does not already have an item from this group. (remember,
                     * back button results in view being built again with
                     * existing basket).
                     */
                    var currentItemId=this.basket.isComboGroupRepresented(groupId);
                    if (typeof currentItemId==='undefined') {
                        var firstItem = group.unSubgroupedItems[0];
                        this.basket.addItemRaw(firstItem, 1, groupId, groupDisplayText, catalogId, catalogDisplayText);
                        this.updateBasket();
                    }else{
                        /*
                         * highlight that radio button then
                         */
                        $(el).find('#'+currentItemId).prop("checked", true)
                    }
                    break;
                case 'ITEMIZED':
                case 'UNDEFINED':
                default:
                    /*
                     * TODO: Convert these to check boxes.
                     */
                    var el = new GroupView({
                        onClick : function(model) {
                            this.openAddToBasketView(model, groupId, groupDisplayText, catalogId, catalogDisplayText);
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

                var groupType = group.groupType.enumText;
                var groupDisplayText = group.groupDisplayText;
                var groupId = group.groupId;

                var el = new GroupView({
                    onClick : function(model) {
                        this.openAddToBasketView(model, groupId, groupDisplayText, catalogId, catalogDisplayText);
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
