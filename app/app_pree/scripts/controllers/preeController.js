'use strict';

var FeedModel = require('../models/FeedModel'),
	loader = require('../loader'),
	gateway = require('../APIGateway/gateway');

module.exports = {
	getQuestions: function() {
		return gateway.sendRequest('getPreeQuestions', {
			// throw: true
		}).then(function(resp) {
			return new FeedModel(resp);
		}, function(e) {
			loader.hide();
			loader.showErrorMessage(e, 'unable to load questions')
		});
	}
};
