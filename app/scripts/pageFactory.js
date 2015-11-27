/*global define*/

'use strict';

var Backbone = require('backbone'),
    RestaurantView = require('./views/restaurantView'),
    ChatView = require('./views/chatView'),
    ReviewsView = require('./views/reviewsView'),
    EditView = require('./views/editView'),
    CatalogView = require('./views/catalogView'),
    PostsView = require('./views/postsView'),
    ContestsView = require('./views/contestsView'),
    PhotoContestView = require('./views/photoContestView'),
    PollContestView = require('./views/pollContestView'),
    CheckinContestView = require('./views/checkinContestView'),
    RootView = require('./views/rootView'),
    AboutUsView = require('./views/aboutUsView'),
    OrderView = require('./views/orderView'),
    RestaurantHeader = require('./views/headers/restaurantHeader'),
    SimpleHeader = require('./views/headers/simpleHeader'),
    ContestHeader =require('./views/headers/contestHeader'),
    EmptyHeader = require('./views/headers/emptyHeader'),
    PaginationHeader = require('./views/headers/paginationHeader');

module.exports = {
    create: function(viewName,options) {
        var view;
        switch(viewName){
        case 'root':
            view = new RootView({
                headerView: EmptyHeader,
                headerData: {}
            });
            break;
        case 'restaurant':
        case 'promotions':
            view = new RestaurantView(_.extend(options, {
                headerView: RestaurantHeader,
                headerData: {
                    restaurant: options.model,
                    back: false
                }
            }));
            break;
        case 'chat':
            view = new ChatView(_.extend(options, {
                headerView: PaginationHeader,
                headerData: {
                    sasl: options.restaurant,
                    title: 'Chat'
                }
            }));
            break;
        case 'reviews':
            view = new ReviewsView(_.extend(options, {
                headerView: PaginationHeader,
                headerData: {
                    sasl: options.restaurant,
                    title: 'Reviews'
                }
            }));
            break;
        case 'editable':
            view = new EditView(_.extend(options, {
                headerView: SimpleHeader,
                headerData: {
                    sasl: options.restaurant,
                    title: ''
                }
            }));
            break;
        case 'catalog':
            view = new CatalogView(_.extend(options, {
                headerView: SimpleHeader,
                headerData: {
                    sasl: options.sasl,
                    title: 'Menu'
                }
            }));
            break;
        case 'posts':
            view = new PostsView(_.extend(options, {
                headerView: SimpleHeader,
                headerData: {
                    sasl: options.sasl,
                    title: 'Wall'
                }
            }));
            break;
        case 'contests':
            view = new ContestsView(_.extend(options, {
                headerView: SimpleHeader,
                headerData: {
                    sasl: options.sasl,
                    title: 'Contests'
                }
            }));
            break;
        case 'photoContest':
            view = new PhotoContestView(_.extend(options, {
                headerView: ContestHeader,
                headerData: {
                    sasl: options.sasl,
                    contest: options.model,
                    title: 'Photo Contest'
                }
            }));
            break;
        case 'pollContest':
            view = new PollContestView(_.extend(options, {
                headerView: ContestHeader,
                headerData: {
                    sasl: options.sasl,
                    contest: options.model,
                    title: 'Poll Contest'
                }
            }));
            break;
        case 'checkinContest':
            view = new CheckinContestView(_.extend(options, {
                headerView: ContestHeader,
                headerData: {
                    sasl: options.sasl,
                    contest: options.model,
                    title: 'Checking Contest'
                }
            }));
            break;
        case 'aboutUs':
            view = new AboutUsView(_.extend(options, {
                headerView: SimpleHeader,
                headerData: {
                    sasl: options.sasl,
                    title: 'About Us'
                }
            }));
            break;
        case 'order':
            view = new OrderView(_.extend(options, {
                headerView: SimpleHeader,
                headerData: {
                    sasl: options.sasl,
                    title: 'Order'
                }
            }));
            break;
        }
        return view;
    }
};
