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
        var coords = options.coords;
        return tileActions.getTiles(options)
            .then(function(response) {
                return {
                    tiles: response.tiles,
                    coords: coords
                };
            });
    },

    tileDetailed: function(options) {
        return $.Deferred().resolve({
            model: options
        }).promise();
    },

    businessList: function(options) {
        var coords = options;
        return tileActions.getTiles(coords)
            .then(function(response) {
                return {
                    sasls: response.sasls,
                };
            });
    },

    saslDetailed: function(options) {
        return $.Deferred().resolve({
            model: options
        }).promise();
    }
};
