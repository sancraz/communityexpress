/*global define*/

'use strict';

var Backbone = require('backbone');

var LandingHeader = Backbone.View.extend({

    render: function() {
        this.setElement(document.getElementById('cmtyx_header').outerHTML);
        this.$el.data('role','header');
        this.$el.attr('role','');
        this.$el.css({
            position: 'fixed',
            top: 0,
            display: 'block'
        });
        this.$el.enhanceWithin();
        return this;
    }
    
});

module.exports = LandingHeader;