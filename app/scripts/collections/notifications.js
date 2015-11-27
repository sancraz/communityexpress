/*global define*/

'use strict';

var Backbone = require('backbone'),
	config = require('../appConfig'),
	NotificationModel = require('../models/communicationModel.js');

var NotificationsCollection = Backbone.Collection.extend({

    model: NotificationModel,

});

module.exports = NotificationsCollection;
