'use strict';

var PreeQuestionCollectionModel = require('./PreeQuestionCollectionModel'),
	PreeQuestionModel = require('./PreeQuestionModel');

var FeedModel = Backbone.Model.extend({

	defaults : {
		hasNext : false,
		hasPrevious : false,
		pageCount : 0,

		currentSelection : 0,
		retrieving : false
	},

	initialize : function(attributes, options) {
		this.questionCollection = new PreeQuestionCollectionModel(this.attributes.questions);
	},

	feedSelectorClicked : function(attributes) {
		//console.log('feedModel::feedSelectorClicked:'+attributes.selectorName);
		/*start wait cursor, make ajax call to get data*/
		/* TODO replace this with ajax call.*/

		switch(attributes.selectorName) {
		case 'TRENDING':
			console.log("Getting trending questions");
			this.questionCollection.reset();
			this.questionCollection.add(new PreeQuestionModel({
				title : 'who are the biggest Trump supporters'
			}));
			break;
		case 'FOLLOWING':
			this.questionCollection.reset();
			this.questionCollection.add(new PreeQuestionModel({
				title : 'my toyota needs a new name'
			}));

			console.log("Getting  questions from people we are following");
			break;
		case 'CATEGORIES':
			this.questionCollection.reset();
			this.questionCollection.add(new PreeQuestionModel({
				title : 'this is a typical football question'
			}));

			console.log("Getting  questions by categories");
			break;
		default:

		}

		this.feedReceived();
	},

	feedReceived : function(attributes) {
		/*stop wait cursor, tell view to refresh*/
		/* clear collection. Add items. fire event.*/
		this.trigger("change", this, {});
	},

	feedFailed : function(attributes) {

		/*stop wait cursor, tell message handler to show message*/
	}
});

module.exports = FeedModel;
