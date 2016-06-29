'use strict';

var template = require('ejs!./tagsTpl.ejs'),
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
		'go' : '.go-button',
		'discard' : '.discard-button',
		'collapsibleContent': '#tags-filter-expanded',
		'toggle': '.pree_tags_close img'
	},

	events: {
		'click @ui.go': 'updateFilters',
		'click @ui.discard': 'discardChanges'
	},

	arrows: {
		down: 'images/arrow_down.png',
		up: 'images/arrow_up.png'
	},

	serializeData: function() {
		return {
			type: this.options.type
		};
	},

	onRender: function() {
		var tagsAutocompleteView = new AutocompleteView(this.getTagsAutocompleteOptions());

		this.getRegion('inputRegion').show(tagsAutocompleteView);

		this.tagsCollection = new TagsCollection();

		var tagsCollectionView = new TagsCollectionView({
			collection: this.tagsCollection,
			type: this.options.type
		});
		this.getRegion('tagsRegion').show(tagsCollectionView);
	},

	onShow: function() {
		this.toggleCollapsible();
		//change collapse/expande arrow
		this.ui.collapsibleContent.on('shown.bs.collapse', _.bind(function() {
			this.ui.toggle.attr('src', this.arrows.up);
		}, this));
		this.ui.collapsibleContent.on('hidden.bs.collapse', _.bind(function() {
			this.ui.toggle.attr('src', this.arrows.down);
		}, this));
	},

	toggleCollapsible: function() {
		//looks much better with timeout
		setTimeout(_.bind(function() {
			this.ui.collapsibleContent.collapse('toggle');
		}, this), 10);
	},

	getTagsAutocompleteOptions: function() {
		var tags = this.options.items;
		return {
			data: tags,
			valueKey: 'displayText',
			apiKey: 'domainId',
			limit: 10,
			name: this.options.type,
			callback: _.bind(function(name, model){
				this.tagsCollection.add(model);
			}, this)
		};
	},

	discardChanges: function() {
		this.tagsCollection.reset();
		this.updateFilters();
	},

	updateFilters: function() {
		this.toggleCollapsible();
		if (typeof this.options.updateFilters === 'function') {
			this.options.updateFilters(
				this.tagsCollection.createQueryParams(this.options.type));
		}
	}

});

module.exports = TagsView;
