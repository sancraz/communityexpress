/*global define*/

'use strict';

var Vent = require('../Vent'), //
loader = require('../loader'), //
RosterBasketModel = require('../models/RosterBasketModel'), //
orderActions = require('../actions/orderActions'), //
PageLayout = require('./components/pageLayout'), // 
RosterComboItemView = require('./partials/roster_combo_item.js'), ListView = require('./components/listView');

var RosterView = PageLayout.extend({

    name : 'roster',

    onShow : function() {
        this.addEvents({
            'click .back' : 'goBack',
            'click .order_button' : 'triggerOrder',
            'click .edit_button' : 'openEditPanel'
        });
        this.renderItems();
        this.listenTo(this.basket, 'reset change add remove', this.updateBasket, this);
        this.navbarView.hide();// $('#cmtyx_navbar').fadeOut('slow');

    },

    initialize : function(options) {
        this.roster = options.roster.collection;
        this.sasl = options.sasl;
        this.basket = options.basket;
        this.backToRoster = options.backToRoster;
        this.rosterId = options.rosterId;
        this.rosterType = options.roster.data.rosterType.enumText;
        this.rosterDisplayText = options.roster.data.displayText;
        this.navbarView = options.navbarView;

        this.on('show', this.onShow, this);
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

    triggerRestaurantView : function() {
        Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), {
            reverse : true
        });
    },

    openAddToBasketView : function(model, groupId, groupDisplayText, catalogId, catalogDisplayText, rosterId,
            rosterDisplayText) {
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

    toggleBasketComboEntry : function(model, groupId, groupDisplayText, catalogId, catalogDisplayText) {
        // console.log("CatalogView:toggleBasketComboEntry
        // :"+model.attributes.itemName+", "+groupId+", "+catalogId);
        this.basket.changeItemInCombo(model, groupId, groupDisplayText, catalogId, catalogDisplayText);
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

        switch (this.rosterType) {
        case 'COMBO':
            /*
             * add the ul
             */
            var $ul=$('<ul></ul>');
            _(this.roster.catalogs).each(
                    function(catalog, i) {
                        var catalogType = catalog.catalogType.enumText;
                        var catalogId = catalog.catalogId;
                        var catalogDisplayText = catalog.displayText;
                        switch (catalogType) {
                        case 'COMBO':
                            /*
                             * use radio boxes
                             */
                            var li = new RosterComboItemView({
                                onChange : function(model) {
                                    this.toggleBasketComboEntry(model, catalogId, catalogDisplayText, rosterId,
                                            rosterDisplayText);
                                }.bind(this),
                                model : catalog,
                                parent : this
                            }).render().el;
                            $ul.append(li);

                            break;
                        case 'ITEMIZED':
                        case 'UNDEFINED':
                        default:

                        }

                    }.bind(this));
            this.$('.cmntyex-items_placeholder').append($ul);
            break;
        case 'ITEMIZED':
        case 'UNDEFINED':
        default:
        }
    }

});

module.exports = RosterView;
