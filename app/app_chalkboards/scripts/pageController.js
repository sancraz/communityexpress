/*global define console*/

'use strict';

var Vent = require('./Vent'),
    tileActions = require('./actions/tileActions');

var visited = {
    sasl: false,
};

var hasBeenVisited = function(page) {
    var beenVisited = visited[page];
    if (beenVisited) {
        return true;
    } else {
        visited[page] = true;
        return false;
    }
};

var getUrl = function(sasl) {

    var url = sasl.getFriendlyUrlKey();

    if ( !url ) {
        console.error( 'urlKey could not be found' );
    }

    return url;
};

module.exports = {

    root: function () {
        return $.Deferred().resolve({
            url: ''
        }).promise();
    },

    locationSelect: function(options) {
        var locations = {};
        return $.Deferred().resolve({
            model: locations
        }).promise();
    },

    tiles: function(options) {
        if (options.tiles) {
            return $.Deferred().resolve({
                sasls: options.sasls,
                tiles: options.tiles
            }).promise();
        } else {
            var coords = options.coords;
            return tileActions.getTiles(options)
                .then(function(response) {
                    return {
                        tiles: response.tiles,
                        sasls: response.sasls,
                        coords: coords
                    };
                });
        }
    },

    tileDetailed: function(options) {
        return $.Deferred().resolve({
            model: options.model,
            sasls: options.options.sasls,
            tiles: options.options.tiles
        }).promise();
    },

    businessList: function(options) {
        return $.Deferred().resolve({
            sasls: options.sasls,
            tiles: options.tiles
        }).promise();
    },

    saslDetailed: function(options) {
        return $.Deferred().resolve({
            model: options.model,
            sasls: options.sasls,
            tiles: options.tiles
        }).promise();
    }
};
