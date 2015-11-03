'use strict';

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    FirstView = require('../views/first_view.js'),
    SecondView = require('../views/second_view.js');

var Controller = Marionette.ItemView.extend({
    
    firstView: new FirstView(),
    secondView: new SecondView(),

    initialize: function() {
          App.vent.on('render:first_view', this.renderFirstView, this);
          App.vent.on('render:second_view', this.renderSecondView, this); 
    },

    renderFirstView: function() {
        App.regions.main.show(this.firstView, {preventDestroy: true});
    },

    renderSecondView: function() {
        App.regions.main.show(this.secondView, {preventDestroy: true});
    }

  });

module.exports = Controller;