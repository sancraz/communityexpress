/*global define*/

'use strict';

var template = require('ejs!../../templates/mobilePopup.ejs'),
    PopupView = require('../components/popupView'),
    loader = require('../../loader'),
    tileActions = require('../../actions/tileActions');

var MobilePopup = PopupView.extend({

    template: template,

    initialize: function(options){
        this.sa = this.model.serviceAccommodatorId;
        this.sl = this.model.serviceLocationId;
        this.uuid = this.model.uuid;

        this.addEvents({
            'click #sms_send_button': 'sendAction'
        });

        $('.phone_us').mask('(000) 000-0000');

        this.renderData = {};
    },

    sendAction: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var mobile = $('.phone_us').val();

        tileActions.sendPromoURLToMobile(this.uuid, this.sa, this.sl, mobile)
            .then(function(response, status){
                console.log(response);
                loader.showFlashMessage( 'Promotion URL is sent to ' + mobile);
                this.shut();
            }.bind(this), function(jqXHR, status) {
                loader.showFlashMessage('unable to send Promotion URL to ' + mobile);
            }.bind(this));
    }

});

module.exports = MobilePopup;