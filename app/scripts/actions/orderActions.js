'use strict';

var gateway = require('../APIGateway/gateway.js'),
    sessionActions = require('../actions/sessionActions.js');

var getUser = function () {
    return sessionActions.getCurrentUser();
};

module.exports = {
    placeOrder: function (sa, sl, options, items) {
        return gateway.sendRequest('createUserOrder', {
            payload: _.extend(options, {
                userName: getUser().getUserName(),
                serviceAccommodatorId: sa,
                serviceLocationId: sl,
                items: items
            }),
            UID: getUser().getUID(),
        });
    },

    getCreditInfo: function() {
        return gateway.sendRequest('getCreditCardTypes');
    }
};
