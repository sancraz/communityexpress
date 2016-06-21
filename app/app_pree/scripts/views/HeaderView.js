'use strict';

var template = require('ejs!../templates/header.ejs');

var HeaderView = Mn.LayoutView.extend({

    template: template,

    regions: {}
});

module.exports = HeaderView;
