/*global define*/

'use strict';

var Backbone= require('backbone'),
    Vent = require('../../Vent'),
    LandingView = require('../landingView'),
    template = require('../../templates/toolbars/aboutNavBar.hbs');

var AboutNavBar = Backbone.View.extend({

    template: template,

    initialize: function(options) {
        this.options = options || {};
        this.page = options.page;
    },

    render: function() {
        this.$el.append(this.template(_.extend(this.options.sasl.attributes, this.options)));
        this.setElement(this.$el.children().eq(0));
        this.reinitialize();
        return this;
    },

    reinitialize: function(){
        this.$el.toolbar();
    }

});

module.exports = AboutNavBar;
