/*global define*/

'use strict';

var Backbone = require('backbone'),
    template = require('../../templates/toolbars/landing_header.hbs');

var LandingHeader = Backbone.View.extend({

    template: template,

    render: function() {
        var restname = $('.ui-navbar').find('.theme2_banner').text();
        console.log(restname);
        this.$el.html(this.template());
        this.setElement(this.$el.children().eq(0));
        this.$('.restname').text(restname);
        this.reinitialize();
        return this;
    },

    reinitialize: function(){
        this.$el.toolbar();
    }

});

module.exports = LandingHeader;