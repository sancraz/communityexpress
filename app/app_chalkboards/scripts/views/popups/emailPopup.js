/*global define*/

'use strict';

var template = require('ejs!../../templates/emailPopup.ejs'),
    PopupView = require('../components/popupView'),
    loader = require('../../loader'),
    tileActions = require('../../actions/tileActions');

var EmailPopup = PopupView.extend({

    template: template,

    initialize: function(options){
        this.sa = this.model.serviceAccommodatorId;
        this.sl = this.model.serviceLocationId;
        this.uuid = this.model.uuid;

        this.addEvents({
            'click #email_send_button': 'sendAction'
        });

        this.renderData = {};
    },

    sendAction: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var email = $('.send_email').val();

        tileActions.sendPromoURLToEmail(this.uuid, this.sa, this.sl, email)
            .then(function(response, status){
                loader.showFlashMessage( 'Promotion URL is sent to ' + email);
                this.shut();
            }.bind(this), function(jqXHR, status) {
                loader.showFlashMessage('unable to send Promotion URL to ' + email);
            }.bind(this));
    }

});

module.exports = EmailPopup;