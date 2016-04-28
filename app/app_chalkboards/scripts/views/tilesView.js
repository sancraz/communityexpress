/*global define*/

'use strict';

var Vent = require('../Vent'),
    config = require('../appConfig'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    saslActions = require('../actions/saslActions'),
    promotionActions = require('../actions/promotionActions'),
    configurationActions = require('../actions/configurationActions'),
    promotionsController = require('../controllers/promotionsController'),
    galleryActions = require('../actions/galleryActions'),
    mediaActions = require('../actions/mediaActions'),
    updateActions = require('../actions/updateActions'),
    PageLayout = require('./components/pageLayout'),
    h = require('../globalHelpers');

var TilesView = PageLayout.extend({

    name: 'tiles',

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.contests = options.contests;
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);

        $('.owl-carousel').owlCarousel({
            margin : 0,
            loop : true,
            autoWidth : false,
            items : 1
        });
    },

    renderData: function(){
        return _.extend( {}, this.model.attributes);
    },

    onShow: function(){
        this.addEvents({
            'initialized.owl.carousel': 'showUUID',
            'changed.owl.carousel': 'showUUID'
        });

        this.renderGallery();

        try {
            addToHomescreen().show();
        } catch (e) {
            console.warn(' failed showing addToHomescreen');
        }
    },

    onHide: function() {
        this.$('.theme2_background').hide();
    },

    renderGallery: function(password) {
        this.$('.theme2_background').show();
    },

    showUUID: function(e) {
        if (!e.namespace || e.type != 'initialized' && e.property.name != 'position') {
            return;
        };

        var current = e.item.index;

        var uuid = $(e.target).find('.owl-item').eq(current).find('.mediatile').attr('uuid');
        console.log(uuid);
    }

});

module.exports = TilesView;
