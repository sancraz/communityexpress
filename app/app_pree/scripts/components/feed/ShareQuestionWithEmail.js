'use strict';

var template = require('ejs!./templates/shareQuestionWithEmail.ejs');

var ShareQuestionWithEmail = Mn.ItemView.extend({
    template: template,

    className: 'modal fade share-question-email',

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

module.exports = ShareQuestionWithEmail;
