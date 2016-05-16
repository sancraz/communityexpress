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
        return _.extend({
            tile: this.model.tile,
            restaurant: this.model.restaurant
        });
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerTilesView',
            'click #tileviewdetails_smsbutton': 'toggleSMSinput'
        });
    },

    onHide: function() {
    },

    triggerTilesView: function() {
        Vent.trigger('viewChange', 'tiles', this.model.coords);
    },

    toggleSMSinput: function () {
        console.log('share with sms');
        
        var UUID = this.model.tile.tileUUID;
        $("#sms_input_block").slideToggle('1000');
        //     this.openSubview('mobilePopup', {}, {
        //         tileUUID: UUID
        //     });
    },

});

module.exports = TileDetailedView;
