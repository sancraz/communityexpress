/*global define*/

'use strict';

var TilesView = require('./views/tilesView'),
    LocationSelectView = require('./views/locationSelectView'),
    TileDetailedView = require('./views/tileDetailedView'),
    BusinessListView = require('./views/businessListView'),
    NavbarView = require('./views/headers/navbarView'),
    HeaderView = require('./views/headers/headerView'),
    BusinessListHeaderView = require('./views/headers/businessListHeaderView');

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
            break;
        case 'tileDetailed':
            view = new TileDetailedView(_.extend(options, {
                navbarView: NavbarView,
                navbarData: {
                    model: options.model
                },
                headerView: HeaderView,
                headerData: {
                    model: options.model.restaurant
                }
            }));
            break;
        case 'businessList':
            view = new BusinessListView(_.extend(options, {
                navbarView: NavbarView,
                navbarData: {},
                // headerView: BusinessListHeaderView,
                // headerData: {
                //     model: options.tiles
                // }
            }));
        }
        return view;
    }
};
