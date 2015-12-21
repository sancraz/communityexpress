'use strict';

var gateway = require('../APIGateway/gateway.js'),
    sessionActions = require('../actions/sessionActions.js'),
    appCache = require('../appCache.js'),
    Basket = require('../models/BasketModel.js');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {
    getCatalog: function (sa, sl) {
        return gateway.sendRequest('getCatalog', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            UID: getUID()
        }).then(function (response) {
            return {
                data: response,
                collection: response
            };
        });
    },

    getBasket: function (sa, sl) {
        return appCache.fetch(sa + ':' + sl + ':basket', new Basket());
    }
};
