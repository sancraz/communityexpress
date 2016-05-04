/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    promotionActions = require('../actions/promotionActions'),
    PageLayout = require('./components/pageLayout');

var LocationSelectView = PageLayout.extend({

    name: 'location_select',

    initialize: function(options) {
        options = options || {};
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
    },

    renderData: function() {
        return _.extend( {}, this.model.attributes);
    },

    onShow: function() {
        $('#landing').css({
            'min-height': 0,
            'margin': 0
        });
        this.addEvents();


        try {
            addToHomescreen().show();
        } catch (e) {
            console.warn(' failed showing addToHomescreen');
        }
    }

});

module.exports = LocationSelectView;
