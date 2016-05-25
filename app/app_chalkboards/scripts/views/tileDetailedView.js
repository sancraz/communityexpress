/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    PageLayout = require('./components/pageLayout');

var TileDetailedView = PageLayout.extend({

    name: 'tileDetailed',

    initialize: function(options) {
        this.options = options || {};
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
    },

    renderData: function(){
        return _.extend(this.model.attributes);
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerTilesView',
            'click #tileviewdetails_smsbutton': 'sendMobile',
            'click #tileviewdetails_emailbutton': 'sendEmail'
        });
    },

    onHide: function() {
    },

    triggerTilesView: function() {
        Vent.trigger('viewChange', 'tiles', this.options);
    },

    sendMobile: function () {
        this.openSubview('mobilePopup', this.model.attributes);
    },

    sendEmail: function() {
        this.openSubview('emailPopup', this.model.attributes);
    }

});

module.exports = TileDetailedView;
