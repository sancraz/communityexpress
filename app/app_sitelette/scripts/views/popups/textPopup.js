/*global define*/

var PopupView = require('../components/popupView'),
    template = require('ejs!../../templates/textPopup.ejs');

var TextPopup = PopupView.extend({

    template: template,

    id: 'cmntyex_text_popup',

    className: 'popup',

    initialize: function (options) {
        this.text = options.model.text;
        this.options = options || {};
        this.callback = options.callback || function () {};

        this.addEvents({
            'click .confirmation_button': 'triggerCallback'
        });
    },

    render: function () {
        this.$el.html(this.template({text: this.text}));
        return this;
    },

    beforeShow: function() {
        this.$el.css('max-width', '240px');
    },

    onShow: function () {
        if (this.options.select) {
            this.selectText();
        }
        if (this.options.wordBreak) {
            this.$('.ui-content').css({
                'word-wrap': 'break-word'
            });
        }
    },

    triggerCallback: function() {
        setTimeout(this.callback.bind(this.options.parent), 1000);
        this.shut();
    },

    selectText: function () {
        var el = this.$('.ui-content')[0];
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

});

module.exports = TextPopup;
