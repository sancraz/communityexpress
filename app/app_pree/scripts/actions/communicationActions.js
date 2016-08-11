'use strict';

var gateway = require('../APIGateway/gateway'),
	sessionActions = require('./sessionActions');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {
	getMessages: function(uuid) {
		return gateway.sendRequest('getConversationBetweenUserSASL', {
			UID: getUID(),
			// serviceAccommodatorId: window.community.serviceAccommodatorId,
			// serviceLocationId: window.community.serviceLocationId,
			count: 10,
			threadUUID: uuid
		});
	},

	postComment: function(options) {
		var payload = {
			messageBody: options.messageBody,
			authorId: options.authorId,
			toServiceAccommodatorId: window.community.serviceAccommodatorId,
			toServiceLocationId: window.community.serviceLocationId,
			urgent: options.urgent,
			communicationId: options.communicationId,
			inReplyToCommunicationId: options.inReplyToCommunicationId
		};
		return gateway.sendRequest('sendMessageToSASL', {
			UID: getUID(),
			payload: payload
		});
	}
}
