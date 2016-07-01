'use strict';

var moment = require('moment'),
	gateway = require('../APIGateway/gateway'),
	template = require('ejs!../templates/createQuestion.ejs'),
	TagsView = require('./autocomplete/NewQuestionTagsView');

var CreateQuestionView = Mn.LayoutView.extend({

	template: template,

	moment: moment, // temporary hack

	regions: {
		categoriesRegion: '#new-question-categories-region',
		tagsRegion: '#new-question-tags-region'
	},

	ui: {
		container: '.create-question-container',
		discard: '.discard-btn',
		save: '.save-btn',
		post: '.post-btn',
		type: '.pree_question_edit_type input',
		anonymous: '.pree_question_is_anonymous_item input',
		question: '.question-text',
		answerInfo: '.answer-info-text',
		additionalLinks: '.additional-links-container',
		answers: '.pree_question_edit_answers li',
		answerChoice: '.pree_question_edit_answers li .answer-choice',
		answerExample: '.pree_question_edit_answers li .answer-example',
		atributionBtn: '.atribution-link-btn',
		atributionInput: '#atributionLinkInput',
		bonusPoints: '#bonusPointsInput',
		basePoints: '#basePointsInput',
		expirationDate: '#expirationDatePicker',
		// expirationTime: '#expirationTimePicker',
		notificationDate: '#notificationDatePicker',
		// notificationTime: '#notificationTimePicker'
	},

	events: {
		'click @ui.discard': 'onDiscardQuestion',
		'click @ui.save': 'onQuestionSave',
		'click @ui.post': 'onQuestionPost',
		'change @ui.type': 'onTypeChanged',
		'change @ui.anonymous': 'onIsAnonymousChanged',
		'change @ui.answerChoice': 'onChoiceChanged',
		'change @ui.answerExample': 'onExampleChanged',
		'change @ui.question': 'onQuestionChanged',
		'change @ui.answerInfo': 'onAnswerInfoChanged',
		'click @ui.atributionBtn': 'onAddAtributionUrl',
		'keydown @ui.bonusPoints': 'onKeyDownBonusPoints',
		'keydown @ui.basePoints': 'onKeyDownBasePoints',
		'change @ui.bonusPoints': 'onChangeBonusPoints',
		'change @ui.basePoints': 'onChangeBasePoints'
	},

	serializeData: function() {
		console.log(this.model.toJSON());
		return {
			model: this.model.toJSON()
		};
	},

	onShow: function() {
		this.ui.container.collapse('show');

		this.trigger('getTags', _.bind(this.showTags, this), true); // true means silent
		this.trigger('getCategories', _.bind(this.showCategories, this), true); // true means silent
		this.onInitDatepickers();
	},

	onInitDatepickers: function() {

		this.ui.expirationDate.datetimepicker({
			format: 'MM/DD/YYYY h:mm:ss'
		});
		// this.ui.expirationTime.datetimepicker({
		// 	format: 'LT'
		// });
		this.ui.notificationDate.datetimepicker({
			format: 'MM/DD/YYYY h:mm:ss'
		});
		// this.ui.notificationTime.datetimepicker({
		// 	format: 'LT'
		// });
	},

	showCategories: function(categories) {
		var categoriesView = new TagsView({
			type: 'categories',
			items: categories,
			preselected: this.model.get('categories'),
			updateFilters: _.bind(this.setCategories, this)
		});
		this.getRegion('categoriesRegion').$el.show();
		this.getRegion('categoriesRegion').show(categoriesView);
	},

	showTags: function(tags) {
		var tagsView = new TagsView({
			type: 'tags',
			items: tags,
			preselected: this.model.get('hashTags'),
			updateFilters: _.bind(this.setTags, this)
		});
		this.getRegion('tagsRegion').$el.show();
		this.getRegion('tagsRegion').show(tagsView);
	},

	setCategories: function(categories) {
		this.model.set('categories', categories);
	},

	setTags: function(tags) {
		this.model.set('hashTags', tags);
	},

	onDiscardQuestion: function() {
		this.ui.container.collapse('hide');
		this.trigger('onNewQuestin:discarded');
		this.destroy();
	},

	onTypeChanged: function(e) {
		var $target = $(e.currentTarget);
		this.ui.type.each(_.bind(function(index, item){
			if (item !== $target.get(0)) {
				item.checked = false;
			} else {
				item.checked = true;
				this.model.set('subType', index);
			}
		}, this));
	},

	onIsAnonymousChanged: function(e) {
		var $target = $(e.currentTarget),
			checked = $target.is(':checked');
		this.model.set('isAnonymous', checked);
	},

	onChoiceChanged: function(e) {
		var $target = $(e.currentTarget),
			cIndex = $target.data('index'),
			choices = this.model.get('choices');

		_.each(choices, function(choice, index){
			if (index === cIndex) {
				choice.isCorrect = true;
			} else {
				choice.isCorrect = false;
			}
		});

		this.model.set('choices', choices);
	},

	onExampleChanged: function(e) {
		var $target = $(e.currentTarget),
			cIndex = $target.data('index'),
			choices = this.model.get('choices');

		choices[cIndex].displayText = $target.val();

		this.model.set('choices', choices);
	},

	onQuestionChanged: function(e) {
		var $target = $(e.currentTarget),
			text = $target.val();

		this.model.set('displayText', text);
	},

	onAnswerInfoChanged: function(e) {
		var $target = $(e.currentTarget),
			text = $target.val();

		this.model.set('additionalInformation', text);
	},

	onQuestionSave: function() {
		console.log('on save question');
		if (this.model.isValid()) {
			// save model
		} else {
			//on error
			this.onValidationError(this.model.validationError);
		}
		//I don't know where we save question on local storage or on backend
	},

	onValidationError: function(errors) {
		console.log('fields error: ', errors);
	},

	onQuestionPost: function() {
		console.log('on post question');
		this.checkDatepickersDate();
		if (this.model.isValid()) {
			// post model
			this.trigger('onNewQuestin:post', this.model, _.bind(this.onDiscardQuestion, this));
		} else {
			//on error
			this.onValidationError(this.model.validationError);
		}
	},

	onAddAtributionUrl: function(){
		var url = this.ui.atributionInput.val(),
			expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
  	 		regex = new RegExp(expression),
  	 		links = this.ui.additionalLinks.find('div'),
  	 		available,
  	 		template;

  		if (url.match(regex)) {
  			if (!this.model.get('infoURL1')) {
  				available = links.eq(0);
  				this.model.set('infoURL1', url);
  			} else if (!this.model.get('infoURL2')) {
  				available = links.eq(1);
  				this.model.set('infoURL2', url);
  			}

  			if (available) {
  				console.log('add url ', url);
  				template = this.createTemplate(url);
  				available.html(template);
  				available.find('.remove-link').on('click', _.bind(this.removeLink, this));
  				this.ui.atributionInput.val('');
  			} else {
  				//show message
  			}
  		}
	},

	createTemplate: function(url) {
		var expresion = /^(http:\/\/)|(https:\/\/)/g,
			link;

		if (!url.match(expresion)) {
			link = 'http://' + url;
		}
		return '<a href="' + link + '">' + url
			+ '</a><i class="remove-link fa fa-times remove-tag"></i>';
	},

	removeLink: function(e) {
		var $target = $(e.currentTarget),
			parent = $target.parent();

		parent.html('');
		if (parent.hasClass('first-link')) {
			this.model.set('infoURL1', '');
		} else {
			this.model.set('infoURL2', '');
		}
	},

	onKeyDownBonusPoints: function(e) {
		this.testKeyPressed(e);
	},

	onKeyDownBasePoints: function(e) {
		this.testKeyPressed(e);
	},

	testKeyPressed: function(e) {
		if (e.keyCode === 190) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	},

	onChangeBonusPoints: function(e) {
		var $target = $(e.currentTarget),
			value = this.checkCorrectValue($target);

		this.model.set('bonusPoints', value);
	},

	onChangeBasePoints: function(e) {
		var $target = $(e.currentTarget),
			value = this.checkCorrectValue($target);

		this.model.set('basePoints', value);
	},

	checkCorrectValue: function($target) {
		var value = $target.val(),
			min = $target.attr('min') || 0,
			max = $target.attr('max') || 1000,
			testValue = parseInt(value, 10);

		testValue = isNaN(testValue) ? 0 : testValue;
		value = testValue < min ? min : testValue > max ? max : testValue;
		$target.val(value);
		return value;
	},

	//TODO not completely working
	checkDatepickersDate: function() {
		//check datepickers
		var expiration = this.ui.expirationDate.val(),
			notification = this.ui.notificationDate.val(),
			convertedExpire,
			convertedNotify;

		try {
			convertedExpire = this.moment(expiration).format();
			convertedNotify = this.moment(notification).format();
		} catch (e) {
			//error
		}
		if (convertedExpire) {
			this.model.set('expirationDate', convertedExpire);
		}
		if (convertedNotify) {
			this.model.set('activationDate', convertedNotify);
		}
	}

});

module.exports = CreateQuestionView;
