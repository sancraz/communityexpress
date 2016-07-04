'use strict';

var template = require('ejs!./templates/shareQuestion.ejs');

var ShareQuestionView = Mn.ItemView.extend({
    template: template,

    className: 'modal fade share-question',

    ui: {
        closeButton: '.close_button',
        close: '.close',
        smsButton: '.sms-button',
        emailButton: '.email-button'
    },

    events: {
        'click @ui.close': 'close',
        'click @ui.closeButton': 'close',
        'click @ui.smsButton': 'sendMobile',
        'click @ui.emailButton': 'sendEmail'
    },

    onShow: function() {
        this.$el.modal();
    },

    sendMobile: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.close('sendSMS');
    },

    sendEmail: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.close('sendEmail');
    },

    close: function(param) {

        this.$el.modal('hide');
        this.$el.on('hidden.bs.modal', _.bind(function() {
            if (typeof param === 'string') {
                this.trigger('shareQuestion', param, this.model);
            };
            this.destroy();
        }, this));
    }
});

module.exports = ShareQuestionView;
