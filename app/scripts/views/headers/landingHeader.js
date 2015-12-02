/*global define*/

'use strict';

var Backbone = require('backbone');

var LandingHeader = Backbone.View.extend({

    render: function() {
        this.showHeader();
        return this;
    },

    showHeader: function() {
        var restname = window.saslData.saslName;
        var header = $('#cmtyx_header');
        $(header).text(restname);
        this.setElement($(header[0].outerHTML));
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