'use strict';

var template = require('ejs!./templates/messageItem.ejs');

var MessageModel = require('../../models/MessageModel');

var MessageItemView = Mn.ItemView.extend({

	template: template,

	ui: {
		postComment: '.post_comment'
	},

	events: {
		'click @ui.postComment': 'postComment'
	},

	serializeData: function() {
		return {
			user: this.options.user,
			message: this.model.toJSON()
		};
	},

	postComment: function() {
		this.trigger('postComment');
	}
});

var PreeQuestionMessagesView = Mn.CollectionView.extend({

	el: '.messages_list',

	childView: MessageItemView,

	childEvents: {
		'postComment': 'postComment'
	},

	childViewOptions: function() {
		return { user: this.options.user };
	},

	initialize: function() {
		this.collection.add(new MessageModel({
				showMessageInput: true,
				showReply: false
			}), { at: 0 }
		);
	},

	postComment: function(view) {
		this.trigger('postComment', view);
	}

});

module.exports = PreeQuestionMessagesView;
