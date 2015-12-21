/*global define*/

'use strict';

var appCache = require('../appCache.js'),
    gateway = require('../APIGateway/gateway.js'),
    ReviewCollection = require('../collections/reviews.js'),
    sessionActions = require('../actions/sessionActions.js');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {

    getReviewsBySASL: function (sa, sl, prevId, prevOffset, nextId, nextOffset) {
        return gateway.sendRequest('retrieveReviews', {
            count: 5,
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            previousId: prevId,
            previousOffset: prevOffset,
            nextId: nextId,
            nextOffset: nextOffset
        }).then(function (response) {
            return {
                data: response,
                collection: new ReviewCollection(response.reviews)
            };
        });
    },

    addReview: function  (sa, sl, file, title, message, rating) {
        var uid = sessionActions.getCurrentUser().getUID();
        return gateway.sendFile('addReview', {
            image: file,
            toServiceAccommodatorId: sa,
            toServiceLocationId: sl,
            text_excerpt: message,
            authorId: getUID(),
            rating: rating,
            isPositive: true,
            UID: uid
        });
    }

};
