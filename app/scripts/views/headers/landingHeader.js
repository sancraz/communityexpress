/*global define*/

'use strict';

var Backbone = require('backbone');

var LandingHeader = Backbone.View.extend({

    render: function() {
        this.showHeader();
        return this;
    },

    showHeader: function() {
        var header = $('#cmtyx_header');
        this.setElement($(header[0].outerHTML));
        $(header[0]).css('display', 'none');
        this.$el.data('role','header');
        this.$el.attr('role','');
        this.$el.css({
            position: 'fixed',
            top: 0,
            display: 'block'
        });
        this.$el.enhanceWithin();
    }
    
});

module.exports = LandingHeader;