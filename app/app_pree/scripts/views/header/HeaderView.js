'use strict';

var template = require('ejs!./header.ejs');

var HeaderView = Mn.LayoutView.extend({

    template: template,

    regions: {}
});

module.exports = HeaderView;
