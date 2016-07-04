'use strict';

var template = require('ejs!./templates/signOut.ejs');

var SignOutView = Mn.ItemView.extend({
    template: template,

    className: 'modal fade signout',

    ui: {
        signout: '.confirmation_button',
        close: '.close_button'
    },

    events: {
        'click @ui.signout': 'performAction',
        'click @ui.close': 'close'
    },

    serializeData: function() {
        return {
            text: this.options.text
        };
    },

    onShow: function() {
        this.$el.modal();
    },

    performAction: function() {
        this.$el.modal('hide');
        this.$el.on('hidden.bs.modal', function() {
            this.options.action();
        }.bind(this));
    },

    close: function() {
        this.$el.modal('hide');
    }
});

module.exports = SignOutView;
