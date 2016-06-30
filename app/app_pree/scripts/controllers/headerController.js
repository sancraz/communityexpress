'use strict';

var App = require('../app'),
    Vent = require('../Vent'),
    HeaderView = require('../views/header/HeaderView');

module.exports = {

    showLayout: function() {
        var headerView = new HeaderView();
        App.regions.getRegion('headerRegion').show(headerView);
        App.on('signinForm:show', _.bind(headerView.signin, headerView));
        headerView.listenTo(Vent, 'login_success logout_success', headerView.changeStatus, headerView);
    }
}
