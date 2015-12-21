/*global define console*/

'use strict';

var Vent = require('./Vent.js'),
    communicationActions = require('./actions/communicationActions.js'),
    filterActions = require('./actions/filterActions.js'),
    saslActions = require('./actions/saslActions.js'),
    sessionActions = require('./actions/sessionActions.js'),
    promotionActions = require('./actions/promotionActions.js'),
    galleryActions = require('./actions/galleryActions.js'),
    catalogActions = require('./actions/catalogActions.js'),
    contestActions = require('./actions/contestActions.js'),
    ReviewsCollection = require('./collections/reviews.js');

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

    restaurant: function(options, pid) { // options is an array with either sasl or urlKey

        return saslActions.getSasl(options)
            .then(function(response) {
                return {
                    model: response,
                    user: sessionActions.getCurrentUser(),
                    isFirstTime: !hasBeenVisited('sasl'),
                    url: getUrl(response),
                    pid: pid
                };
            }, function () {
                Vent.trigger('viewChange', 'root');
            }.bind(this));

    },

    chat: function( options ) { // options is an array with either sasl or urlKey

        return saslActions.getSasl(options)
            .then(function(response) {
                return {
                    restaurant: response,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(response) + '/chat'
                };
            }, function () {
                Vent.trigger('viewChange', 'root');
            }.bind(this));

    },

    reviews: function( options ) { // options is an array with either sasl or urlKey

        return saslActions.getSasl(options)
            .then(function(response) {
                return {
                    collection: new ReviewsCollection(),
                    restaurant: response,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(response) + '/reviews'
                };
            }, function () {
                Vent.trigger('viewChange', 'root');
            }.bind(this));

    },

    promotions: function (options) {
        return this.restaurant(options[0], options[1]);
    },

    editable: function (options) {
        var itemsFn = {
            promotion: {
                activate: function (sa, sl) {
                    return promotionActions.getPromotions(sa, sl, 'APPROVED');
                },
                delete: function (sa, sl) {
                    return promotionActions.getPromotions(sa, sl, 'ACTIVE');
                }
            },
            gallery: {
                activate: function (sa, sl) {
                    return galleryActions.getApprovedThumbnails(sa, sl);
                },
                delete: function (sa, sl) {
                    return galleryActions.getActiveThumbnails(sa, sl);
                }
            }
        };

        var actionFunctions = {
            promotion: {
                activate: promotionActions.activatePromotion,
                delete: promotionActions.deActivatePromotion
            },
            gallery: {
                activate: galleryActions.activateGalleryItem,
                delete: galleryActions.deactivateGalleryItem
            }
        };

        return $.when(
            saslActions.getSasl(options.sasl),
            sessionActions.getCurrentUser(),
            itemsFn[options.item][options.action].apply(null, [options.sasl[0], options.sasl[1]])
        ).then(function (restaurant,  user, items) {
            return {
                items: items,
                user: user,
                url: getUrl(restaurant),
                restaurant: restaurant,
                action: options.action,
                actionfn: function (itemId) {
                    return actionFunctions[options.item][options.action]
                        .apply(null, [restaurant.sa(), restaurant.sl(), itemId]);
                }
            };
        });
    },

    catalog: function (options) { // options is an array with either sasl or urlKey
        var sasl;
        return saslActions.getSasl(options)
            .then(function(ret) {
                sasl = ret;
                return catalogActions.getCatalog(sasl.sa(), sasl.sl());
            }).then(function (catalog) {
                return {
                    sasl: sasl,
                    catalog: catalog,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/catalog',
                    basket: catalogActions.getBasket(sasl.sa(), sasl.sl())
                };
            });
    },

    posts: function (options) { // options is an array with either sasl or urlKey
        return saslActions.getSasl(options)
            .then(function (sasl) {
                return {
                    collection: new Backbone.Collection(),
                    sasl: sasl,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/posts'
                };
            });
    },

    contests: function (options) {
        var sasl;
        return saslActions.getSasl(options)
            .then(function(ret) {
                sasl = ret;
                return contestActions.getContests(sasl.sa(), sasl.sl());
            }).then(function (contests) {
                return {
                    sasl: sasl,
                    contests: contests,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/contests'
                };
            });
    },

    photoContest: function (options) {
        return $.when(
                contestActions.photo(options.id),
                saslActions.getSasl(options.sasl)
            ).then(function (contest, sasl) {
                return {
                    sasl: sasl,
                    model: contest,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '?t=h&u=' + contest.contestUUID
                };
            }, function (e) {
                console.error(e);
                Vent.trigger('viewChange', 'root');
                return e;
            });
    },

    pollContest: function (options) {
        return $.when(
                contestActions.poll(options.id),
                saslActions.getSasl(options.sasl)
            ).then(function (contest, sasl) {
                return {
                    sasl: sasl,
                    model: contest,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '?t=l&u=' + contest.contestUUID
                };
            }, function (e) {
                console.error(e);
                Vent.trigger('viewChange', 'root');
                return e;
            });
    },

    checkinContest: function (options) {
        return $.when(
                contestActions.checkin(options.id),
                saslActions.getSasl(options.sasl)
            ).then(function (contest, sasl) {
                return {
                    sasl: sasl,
                    model: contest,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '?t=c&u=' + contest.contestUUID
                };
            }, function (e) {
                console.error(e);
                Vent.trigger('viewChange', 'root');
                return e;
            });
    },

    aboutUs: function (options) {
        var sasl;
        return saslActions.getSasl(options)
            .then(function(ret) {
                sasl = ret;
                return saslActions.getAboutUs(sasl.sa(), sasl.sl());
            }).then(function (html) {
                return {
                    html: html,
                    sasl: sasl,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/aboutUs'
                };
            });
    },

    order: function (options) {
        return saslActions.getSasl(options)
            .then(function (sasl) {
                return {
                    sasl: sasl,
                    user: sessionActions.getCurrentUser(),
                    url: getUrl(sasl) + '/catalog',
                    basket: catalogActions.getBasket(sasl.sa(), sasl.sl())
                };
            });
    }
};
