/*global define console*/

'use strict';

var Vent = require('./Vent'),
    saslActions = require('./actions/saslActions'),
    promotionActions = require('./actions/promotionActions');

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
        var coords = options;
        return promotionActions.getTiles(options)
            .then(function(response) {
                return {
                    tiles: response.tiles,
                    coords: coords
                }
            });
    },

    tileDetailed: function(options) {
        return saslActions.getSitelette(options)
            .then(function(resp) {
                return {
                    model: resp
                }
            });
    }
};
