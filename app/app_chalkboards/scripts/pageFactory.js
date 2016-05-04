/*global define*/

'use strict';

var TilesView = require('./views/tilesView'),
    LocationSelectView = require('./views/locationSelectView'),
    NavbarView = require('./views/headers/navbarView');

module.exports = {
    create: function(viewName,options) {
        var view;
        switch(viewName){
        case 'restaurant':
        case 'tiles':
            view = new TilesView(_.extend(options, {
                navbarView: NavbarView,
                navbarData: {
                    restaurant: options.model,
                    back: false
                }
            }));
            break;
        case 'locationSelect':
            view = new LocationSelectView(_.extend(options, {
                navbarView: NavbarView,
                navbarData: {
                    model: options.model
                }
            }));
        }
        return view;
    }
};
