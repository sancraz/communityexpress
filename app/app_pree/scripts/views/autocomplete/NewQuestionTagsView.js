'use strict';

var template = require('ejs!./newQuestionTagsTpl.ejs'),
	AutocompleteView = require('./AutocompleteView'),
	TagsCollection = require('./../../models/PreeTagsCollection'),
	TagsCollectionView = require('./TagsCollectionView');

var TagsView = Mn.LayoutView.extend({

	template: template,

	regions: {
		inputRegion: '.js-input-region',
		tagsRegion: '.js-tags-region'
	},

	ui: {
		
	},


	serializeData: function() {
		return {
			type: this.options.type
		};
	},

	onRender: function() {
		var categoriesAutocompleteView = new AutocompleteView(this.getCategoriesAutocompleteOptions());

		this.getRegion('inputRegion').show(categoriesAutocompleteView);

		this.tagsCollection = new TagsCollection();

		this.tagsCollection.off('change add remove reset')
			.on('change add remove reset', _.bind(this.updateFilters, this));

		var tagsCollectionView = new TagsCollectionView({
			collection: this.tagsCollection,
			type: this.options.type
		});
		this.getRegion('tagsRegion').show(tagsCollectionView);
	},

	onShow: function() {
		this.preselectItems();
	},

	preselectItems: function() {
		var items = this.options.items;
		if (this.options.preselected) {
			_.each(this.options.preselected, _.bind(function(preselected){
				var item = _.findWhere(items, {displayText: preselected});
				if (item) {
					item.value = item.displayText;
					this.tagsCollection.add(new Backbone.Model(item));
				} else if (this.options.type === 'tags') {
					item = {
						value: preselected,
						displayText: preselected,
						domainId: 29 // temporary for testing
					}
					this.tagsCollection.add(new Backbone.Model(item));
				}
			}, this));
		}
	},

	getCategoriesAutocompleteOptions: function() {
		var categories = this.options.items;
		return {
			data: categories,
			valueKey: 'displayText',
			apiKey: 'domainId',
			limit: 10,
			name: 'categories',
			callback: _.bind(function(name, model){
				this.tagsCollection.add(model);
			}, this)
		};
	},

	updateFilters: function() {
		if (typeof this.options.updateFilters === 'function') {
			this.options.updateFilters(this.tagsCollection.getTagsArray());
		}
	}

});

module.exports = TagsView;
