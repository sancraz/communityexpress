'use strict';

var moment = require('moment');

var template = require('ejs!./templates/messageItem.ejs');

var MessageModel = require('../../models/MessageModel');

var MessageItemView = Mn.ItemView.extend({

	template: template,

	tagName: 'li',

	ui: {
		postComment: '.post_comment',
		messageBody: '.message_body'
	},

	events: {
		'click @ui.postComment': 'postComment'
	},

	initialize: function() {
		this.timeAgo = moment(this.model.get('timeStamp')).fromNow();
	},

	serializeData: function() {
		return {
			user: this.options.user,
			message: this.model.toJSON(),
			timeAgo: this.timeAgo
		};
	},

	postComment: function() {
		this.trigger('postComment');
	}
});

var PreeQuestionMessagesView = Mn.CollectionView.extend({

	// el: '.messages_list',

	tagName: 'ul',

	className: 'messages_list',

	childView: MessageItemView,

	childEvents: {
		'postComment': 'postComment'
	},

	childViewOptions: function() {
		return { user: this.options.user };
	},

	initialize: function() {
		// this.collection.add(new MessageModel({
		// 		showMessageInput: true,
		// 		showReply: false
		// 	}), { at: 0 }
		// );
	},

	postComment: function(view) {
		this.trigger('postComment', view);
	}

});

module.exports = PreeQuestionMessagesView;
