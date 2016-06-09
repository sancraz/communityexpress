'use strict';

var template = require('ejs!../templates/preeQuestion.html');

var FeedSelectorView = Backbone.View.extend({

    template: template,

    tagName: 'li',

    initialize : function() {
        console.log("FeedSelectorView initialized");
        this.render();
    },

    render: function() {
        this.$el.html(this.template(_.extend({}, this.model.attributes)));
        return this;
    }
});

module.exports = FeedSelectorView;