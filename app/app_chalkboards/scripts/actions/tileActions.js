'use strict';

var gateway = require('../APIGateway/gateway'),
    PromotionModel = require('../models/promotionModel'),
    sessionActions = require('../actions/sessionActions'),
    geolocation = require('../Geolocation.js');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {

    getLocations: function() {
         return gateway.sendRequest('getLocations')
            .then(function(resp) {
                return {
                    locations: resp
                };
            });
    },

    getTiles: function(coords) {
        return gateway.sendRequest('getTilesByUIDAndLocation', {
            domain: window.community.domain,
            UID: getUID(),
            latitude: coords.latitude,
            longitude: coords.longitude,
            simulate: false
        }).then(function(resp) {
            return resp;
        });
    },

    sendPromoURLToMobile: function(promoUUID, sa, sl, mobile) {
        return gateway.sendRequest('sendPromoURLToMobileviaSMS', {
            UID: 'user1.6823441967353211558',
            promoUUID: promoUUID,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            toTelephoneNumber: mobile
        });
    },

    sendPromoURLToEmail: function(promoUUID, sa, sl, email) {
        return gateway.sendRequest('sendPromoURLToEmail', {
            UID: 'user1.6823441967353211558',
            promoUUID: promoUUID,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            toEmail: email
        });
    }
};
