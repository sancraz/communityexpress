/*global define*/

'use strict';

var Backbone = require('backbone');

var ContentView = Backbone.View.extend({

    el: '.restaurant_gallery',

    events: {
        'pageshow': 'onPageShow',
        'pagebeforehide': 'onPageBeforeHide',
        'pagehide': 'onPageHide'
    },

    // initialize: function(options) {
    //     this.template = options.template;
    // },

    render: function(data){
        // this.$el.html(this.template(data));
        $('.restaurant_gallery').attr({'data-role':'page', 'class':'page restaurant_gallery theme2_background'});
        // this.setElement(this.$el.find('.page'));
        return this;
    },

    onPageShow: function() {
        this.trigger('show');
    },

    onPageBeforeHide: function(){
        this.trigger('beforehide');
    },

    onPageHide: function() {
        this.trigger('hide');
        this.remove();
    },

});

module.exports = ContentView;
