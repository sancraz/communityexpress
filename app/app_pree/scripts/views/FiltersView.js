'use strict';

var gateway = require('../APIGateway/gateway'),
	template = require('ejs!../templates/filters.ejs'),
	TagsView = require('./autocomplete/TagsView');

var FiltersView = Mn.LayoutView.extend({

	template: template,

	regions: {
		categoriesRegion: '.js-select-categories-region',
		tagsRegion: '.js-select-tags-region'
	},

	ui: {
		'trending': '.trending-tab'
	},

	events: {
		'click @ui.trending': 'onGetTrending' 
	},

	serializeData: function() {
		return {};
	},

	onShow: function() {
		this.getCategories();
	},

	onGetTrending: function() {

	},

	getCategories: function() {
		this.trigger('getCategories', _.bind(this.showCategories, this));
	},

	showCategories: function(categories) {
		var categoriesView = new TagsView({
			items: categories,
			updateFilters: _.bind(this.updateFilters, this)
		});
		this.getRegion('categoriesRegion').show(categoriesView);
	},

	updateFilters: function(filters) {
		this.trigger('getQuestionsByFilters', filters);
	}
});

module.exports = FiltersView;