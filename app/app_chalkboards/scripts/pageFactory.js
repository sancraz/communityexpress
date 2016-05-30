/*global define*/

'use strict';

var TilesView = require('./views/tilesView'),
    LocationSelectView = require('./views/locationSelectView'),
    TileDetailedView = require('./views/tileDetailedView'),
    BusinessListView = require('./views/businessListView'),
    SaslDetailedView = require('./views/saslDetailedView'),
    NavbarView = require('./views/headers/navbarView'),
    MainHeaderView = require('./views/headers/mainHeaderView'),
    TileHeaderView = require('./views/headers/tileHeaderView'),
    SaslHeaderView = require('./views/headers/saslHeaderView');

module.exports = {
    create: function(viewName,options) {
        var view;
        switch(viewName){
        case 'restaurant':
        case 'tiles':
            view = new TilesView(_.extend(options, {
                navbarView: NavbarView,
                navbarData: {
                    tiles: options.tiles,
                    sasls: options.sasls,
                    back: false
                },
                headerView: MainHeaderView,
                headerData: {}
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
                    tiles: options.tiles,
                    sasls: options.sasls,
                },
                headerView: TileHeaderView,
                headerData: {
                    model: options.model,
                    restaurant: options.model.saslName
                }
            }));
            break;
        case 'businessList':
            view = new BusinessListView(_.extend(options, {
                navbarView: NavbarView,
                navbarData: {
                    tiles: options.tiles,
                    sasls: options.sasls,
                },
                headerView: MainHeaderView,
                headerData: {}
            }));
            break;
        case 'saslDetailed':
            view = new SaslDetailedView(_.extend(options, {
                navbarView: NavbarView,
                navbarData: {
                    tiles: options.tiles,
                    sasls: options.sasls,
                },
                headerView: SaslHeaderView,
                headerData: {
                    model: options.model,
                    restaurant: options.model.name
                }
            }))
        }
        return view;
    }
};
