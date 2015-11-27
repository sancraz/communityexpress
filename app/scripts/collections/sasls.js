/*global define*/

'use strict';

var Backbone = require('backbone'),
    config = require('../appConfig.js'),
    h = require('../globalHelpers.js'),
    RestaurantModel = require('../models/restaurantModel.js');

var RestaurantCollection = Backbone.Collection.extend({

    model: RestaurantModel

});

module.exports = RestaurantCollection;
