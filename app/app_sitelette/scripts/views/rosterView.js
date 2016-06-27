/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    PageLayout = require('./components/pageLayout'),
    RosterItemView = require('./partials/roster_item'),
    ListView = require('./components/listView');

var RosterView = PageLayout.extend({

    name: 'roster',

    initialize: function (options) {
        this.sasl = options.sasl;
        this.catalogs = options.catalogs.collection;
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
        this.navbarView=options.navbarView;
    },

    onShow:  function () {
        this.addEvents({
            'click .back': 'triggerRestaurantView'
        });
        this.renderCatalogs();
        this.navbarView.hide();
    },

    triggerRestaurantView: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey(), { reverse: true } );
        this.navbarView.show();
    },

    renderCatalogs: function() {
        var el = new ListView({
            ListItemView: RosterItemView,
            collection: new Backbone.Collection(this.catalogs),
            dataRole: 'list-view',
            parent: this
        }).render().el;

        this.$('.cmntyex-items_placeholder').append(el);

    }

});

module.exports = RosterView;
