'use strict';

var App = require('../app'),
    HeaderView = require('../views/header/HeaderView');

module.exports = {

    showLayout: function() {
        this.headerView = new HeaderView();
        App.regions.getRegion('headerRegion').show(this.headerView);
        App.on('signinForm:show', _.bind(this.headerView.signin, this.headerView));
    }
}
