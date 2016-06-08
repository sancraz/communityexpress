'use strict';

var FeedModel = require('../models/FeedModel');

module.exports = {
	getQuestions: function() {
		return $.ajax({
			url: 'http://communitylive.co/apptsvc/rest/pree/retrieveFeed'
		}).then(function(resp) {
			return new FeedModel(resp);
		});
	}
};
