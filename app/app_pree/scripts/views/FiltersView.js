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
		'filtersTabs': '#pree_feed_tabs_items li'
	},

	events: {
		'click @ui.filtersTabs': 'onSelectFiltersTab'
	},

	serializeData: function() {
		return {};
	},

	onShow: function() {
		this.onGetTrending();
	},

	onSelectFiltersTab: function(e) {
		var $target = $(e.currentTarget),
			filter = $target.data('filtertype');

		if ($target.find('a').hasClass('active')) return;
		this.ui.filtersTabs.find('a').removeClass('active');
		$target.find('a').addClass('active');
		switch(filter) {
			case 'FOLLOWING':
				this.onGetFollowing();
				break;
			case 'CATEGORIES':
				this.onGetCategories();
				break;
			case 'TAGS':
				this.onGetTags();
				break;
			default: 
				this.onGetTrending();
				break;
		}
	},

	onGetTrending: function() {
		this.getRegion('tagsRegion').$el.hide();
		this.getRegion('categoriesRegion').$el.hide();
		this.trigger('getQuestions');
	},

	onGetFollowing: function() {
		this.getRegion('tagsRegion').$el.hide();
		this.getRegion('categoriesRegion').$el.hide();
		this.trigger('getQuestions', {
			UID: null,
			filterType:'FOLLOWING'
		});
	},

	onGetTags: function() {
		this.trigger('getTags', _.bind(this.showTags, this));
	},

	onGetCategories: function() {
		this.trigger('getCategories', _.bind(this.showCategories, this));
	},

	showCategories: function(categories) {
		var categoriesView = new TagsView({
			type: 'categories',
			items: categories,
			updateFilters: _.bind(this.updateFilters, this)
		});
		this.getRegion('categoriesRegion').show(categoriesView);
		this.getRegion('tagsRegion').$el.hide();
		this.getRegion('categoriesRegion').$el.show();
	},

	showTags: function(tags) {
		var tagsView = new TagsView({
			type: 'tags',
			items: tags,
			updateFilters: _.bind(this.updateFilters, this)
		});
		this.getRegion('tagsRegion').show(tagsView);
		this.getRegion('categoriesRegion').$el.hide();
		this.getRegion('tagsRegion').$el.show();
	},

	updateFilters: function(params) {
		this.trigger('getQuestions', params);
	}
});

module.exports = FiltersView;