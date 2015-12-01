/*global define*/

'use strict';

var Backbone = require('backbone');

var NavBarView = Backbone.View.extend({

    render: function() {
        this.setElement(document.getElementById('cmtyx_navbar').outerHTML);
        this.$el.data('role','navbar');
        this.$el.attr('role','');
        this.$el.css({
            position: 'fixed',
            top: '40px',
            display: 'block'
        });
        this.$el.enhanceWithin();
        return this;
    }

});

module.exports = NavBarView;