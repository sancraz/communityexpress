'use strict';

var Vent = require('./Vent.js'),
	h = require('./globalHelpers.js');

var params = function () {
    return h().parseQueryString(location.search.substring(1));
};

var RouterRouter = Backbone.Router.extend({

    routes: {
        '': 'root',
        ':id': 'restaurant',
        ':id/chat': 'chat',
        ':id/reviews': 'reviews',
        ':id/catalog': 'catalog',
        ':id/posts': 'posts',
        ':id/contests': 'contests',
        ':id/promotions/:pid': 'promotions'
    },

    root: function() {
        var p = params();
        if (p && p.serviceAccommodatorId && p.serviceLocationId) {
            Vent.trigger('viewChange', 'restaurant', [p.serviceAccommodatorId, p.serviceLocationId], params());
        } else {
            Vent.trigger('viewChange', 'root', params());
        }
    },

    restaurant: function(id) {
        var p = params();
        if (p && p.u) {
            this.subPage(id, p.u, p.t);
        } else {
            Vent.trigger('viewChange', 'restaurant', id, p);
        }
    },

    subPage: function(saslId, UUID, type) {
        switch (type) {
            case 'h':
                Vent.trigger('viewChange', 'photoContest', {sasl: saslId, id: UUID}, params());
            break;
            case 'l':
                Vent.trigger('viewChange', 'pollContest', {sasl: saslId, id: UUID}, params());
            break;
            case 'c':
                Vent.trigger('viewChange', 'checkinContest', {sasl: saslId, id: UUID}, params());
            break;
            case 'p':
                Vent.trigger('viewChange', 'promotions', [saslId, UUID], params());
            break;

        }
    },

    promotions: function(sasl, pid) {
        Vent.trigger('viewChange', 'promotions', [sasl, pid], params());
    },

    chat: function(id) {
        Vent.trigger('viewChange', 'chat', id, params());
    },

    reviews: function(id) {
        Vent.trigger('viewChange', 'reviews', id, params());
    },

    posts: function(id) {
        Vent.trigger('viewChange', 'posts', id, params());
    },

    catalog: function(id) {
        Vent.trigger('viewChange', 'catalog', id, params());
    },

    contests: function(id) {
        Vent.trigger('viewChange', 'contests', id, params());
    }

});

module.exports = RouterRouter;
