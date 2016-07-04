'use strict';

var template = require('ejs!./templates/shareQuestionWithMobile.ejs');

var ShareQuestionWithMobile = Mn.ItemView.extend({
    template: template,

    className: 'modal fade share-question-mobile',

    onShow: function() {
        this.$el.modal();
    },

    close: function() {
        this.$el.modal('hide');
        this.$el.on('hidden.bs.modal', _.bind(function() {
            this.destroy();
        }, this));
    }
});

module.exports = ShareQuestionWithMobile;
