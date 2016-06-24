'use strict';

var template = require('ejs!./tagsTpl.ejs'),
	itemTemplate = require('ejs!./itemTpl.ejs'),
	AutocompleteView = require('./AutocompleteView'),
	TagsCollection = require('./../../models/PreeTagsCollection');

var TagsItemView = Mn.ItemView.extend({
	template: itemTemplate,

	className: 'tag-item',

	ui: {
		tag: '.remove-tag'
	},

	events: {
		'click @ui.tag': 'removeTag'
	},

	serializeData: function() {

		return {
			tag: this.model.get('value')
		};
	},

	removeTag: function() {
		this.trigger('removeTag');
	}
});

var TagsCollectionView = Mn.CollectionView.extend({
	childView: TagsItemView,

	childEvents: {
    	removeTag: function(tagView) {
    		this.collection.remove(tagView.model);
    	}
    },

	childViewOptions: function() {
      return {
        tagInfo: {}
      };
    }
});

var TagsView = Mn.LayoutView.extend({

	template: template,

	regions: {
		inputRegion: '.js-input-region',
		tagsRegion: '.js-tags-region'
	},

	ui: {
		'go' : '.go-button',
		'viewContent': '.tags-container',
		'collapsibleContent': '.tags-filter-expanded'

	},

	events: {
		'click @ui.go': 'updateFilters'
	},

	serializeData: function() {
		return {};
	},

	onShow: function() {
		var categoriesAutocompleteView = new AutocompleteView(this.getCategoriesAutocompleteOptions());
		this.ui.viewContent.on('shown.bs.collapse', function() {
			this.collapsibleContent.collapse('show');
		}, this);
		this.ui.viewContent.collapse('toggle');
		this.getRegion('inputRegion').show(categoriesAutocompleteView);

		this.tagsCollection = new TagsCollection();

		// this.listenTo(this.tagsCollection, 'change reset add remove', this.updateFilters, this);

		var tagsCollectionView = new TagsCollectionView({
			collection: this.tagsCollection
		});
		this.getRegion('tagsRegion').show(tagsCollectionView);
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
			this.options.updateFilters(
				this.tagsCollection.createQueryParams(this.options.type));
		}
	}

});

module.exports = TagsView;
