'use strict';

var template = require('ejs!./templates/textMessage.ejs');

var TextMessageView = Mn.ItemView.extend({
    template: template,

    className: 'modal fade text',

    ui: {
        okButton: '.ok_button',
        close: '.close_button'
    },

    events: {
        'click @ui.okButton': 'close',
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

    close: function() {
        this.$el.modal('hide');
    }
});

module.exports = TextMessageView;
