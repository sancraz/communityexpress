'use strict';

var moment = require('moment');

var template = require('ejs!./templates/messageItem.ejs');

var MessageModel = require('../../models/MessageModel');

var MessageItemView = Mn.ItemView.extend({

	template: template,

	tagName: 'li',

	attributes: function() {
		return {
			messageId: this.model.get('messageId'),
			threadUUID: this.model.get('communicationId')
		}
	},

	ui: {
		postComment: '.post_comment',
		messageBody: '.message_body',
		messageLength: '.reply_comment_field .message_length',
		reply: '.reply',
		replyCommentField: '.reply_comment_field',
		postReplyComment: '.reply_comment_field a',
		messageReplyBody: '.reply_comment_field textarea',
		deleteComment: '.trash'
	},

	events: {
		'click @ui.postComment': 'postComment',
		'click @ui.reply': 'showReplyField',
		'click @ui.postReplyComment': 'postComment',
		'keyup @ui.messageReplyBody': 'calculateMessageLength',
		'click @ui.deleteComment': 'deleteComment'
	},

	initialize: function() {
		this.timeAgo = moment(this.model.get('timeStamp')).fromNow();
	},

	onShow: function() {
		var displayOffset = this.model.get('inReplyToMessageId');
		var marginLeft;
		displayOffset > 1 ? marginLeft = 20 : marginLeft = 0;

		// temporary decision to show deep replies
		if (this.$el.width() < 400 && marginLeft > 180) {
			marginLeft = 180;
		}
		this.ui.messageBody.css('margin-left', marginLeft + 'px');
	},

	serializeData: function() {
		return {
			user: this.options.user,
			message: this.model.toJSON(),
			timeAgo: this.timeAgo
		};
	},

	postComment: function() {
		var options = {
            messageBody: this.ui.messageReplyBody.val(),
            inReplyToMessageId: this.model.get('messageId'),
            authorId: this.options.user.UID,
            communicationId: this.model.get('communicationId'),
            urgent: false
        };
		this.trigger('postComment', options);
	},

	deleteComment: function() {
		var options = {
			communicationId: this.model.get('communicationId'),
			messageId: this.model.get('messageId')
		};
		this.trigger('deleteComment', options);
	},

	showReplyField: function() {
		if (this.expandedReply) {
			this.expandedReply = false;
			this.onHideReplyField();
			this.trigger('showRootCommentField');
			return;
		}
		this.trigger('hideRootCommentField');
		this.trigger('hideOpenedReply');
		this.ui.replyCommentField.slideDown();
		this.expandedReply = true;
	},

	onHideReplyField: function() {
		this.ui.replyCommentField.slideUp();
	},

	calculateMessageLength: function(e) {
        var maxLength = 500;
        var messageLength = this.ui.messageReplyBody.val().length;
        if (messageLength >= maxLength) {
            this.ui.messageReplyBody.val(this.ui.messageReplyBody.val().substring(0, maxLength));
            this.ui.messageLength.html(0);
            this.ui.messageReplyBody.attr('maxlength', maxLength);
            return;
        }
        var counter = messageLength;
        this.ui.messageLength.html(counter);

        if(e.keyCode == 8) {
            this.ui.messageReplyBody.attr('maxlength', '');
        }

		this.ui.messageReplyBody.css('height', 0);
        var height = this.ui.messageReplyBody[0].scrollHeight + 2;
        this.ui.messageReplyBody.css({
            overflow: 'hidden',
            height: height + 'px'
        });
    }
});

var PreeQuestionMessagesView = Mn.CollectionView.extend({

	tagName: 'ul',

	className: 'messages_list',

	childView: MessageItemView,

	childEvents: {
		'postComment': 'postComment',
		'hideRootCommentField': 'hideRootCommentField',
		'hideOpenedReply': 'hideOpenedReply',
		'showRootCommentField': 'showRootCommentField',
		'deleteComment': 'deleteComment'
	},

	childViewOptions: function() {
		return {
			user: this.options.user,
			parent: this.options.parent
		};
	},

	hideRootCommentField: function() {
		this.trigger('hideRootCommentField');
	},

	showRootCommentField: function() {
		this.trigger('showRootCommentField');
	},

	hideOpenedReply: function(view) {
		if (this.viewWithExpandedReply) {
			this.viewWithExpandedReply.triggerMethod('hideReplyField');
		}
		this.viewWithExpandedReply = view;
	},

	postComment: function(view, options) {
		this.trigger('postComment', this.options.parent, options);
	},

	deleteComment: function(options) {
		this.trigger('deleteComment', this.options.parent, options);
	}

});

module.exports = PreeQuestionMessagesView;
