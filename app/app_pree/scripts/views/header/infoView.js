'use strict';

var template = require('ejs!./info.ejs');

var InfoView = Mn.ItemView.extend({
    template: template,

    className: 'infoPanel',

    initialize: function() {
        console.log('hello');
    }
});

module.exports = InfoView;