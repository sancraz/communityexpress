'use strict';

var template = require('ejs!./info.ejs');

var InfoView = Mn.ItemView.extend({
    template: template,

    className: 'row infoPanel',

    initialize: function() {
        console.log('hello');
    }
});

module.exports = InfoView;
