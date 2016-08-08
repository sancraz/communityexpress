'use strict';

var gateway = require('../APIGateway/gateway'),
	sessionActions = require('./sessionActions');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {
	getMessages: function() {
		return gateway.sendRequest('getConversationBetweenUserSASL', {
			UID: getUID(),
			serviceAccommodatorId: window.community.serviceAccommodatorId,
			serviceLocationId: window.community.serviceLocationId,
			count: 100
		});
	}
}