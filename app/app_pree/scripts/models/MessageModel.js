'use strict';

var MessageModel = Backbone.Model.extend({
	defaults: {
		showMessageInput: false,
		showReply: true,
		fromUser: false,
		offset: 1,
		messageBody: '',
		authorId: '',
		userName: '',
		communicationId: '',
		inReplyToCommunicationId: 1,
		timeStamp: ''
	}
});

module.exports = MessageModel;
