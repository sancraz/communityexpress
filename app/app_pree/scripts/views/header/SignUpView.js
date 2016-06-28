'use strict';

var template = require('ejs!./signUp.ejs');

var SignUpView = Mn.ItemView.extend({
    template: template,

    className: 'modal fade signup',

    onShow: function() {
        this.$el.modal();
    },
});

module.exports = SignUpView;
