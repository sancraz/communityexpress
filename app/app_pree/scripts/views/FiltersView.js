'use strict';

var template = require('ejs!../templates/filters.ejs'),
	AutocompleteView = require('./autocomplete/AutocompleteView');

var FiltersView = Mn.LayoutView.extend({

	template: template,

	regions: {
		categoriesRegion: '.js-select-categories-region'
	},

	serializeData: function() {
		return {};
	},

	onShow: function() {
		var categoriesAutocompleteView = new AutocompleteView(this._getCategoriesAutocompleteOptions());
		this.categoriesRegion.show(categoriesAutocompleteView);
	},

	_getCategoriesAutocompleteOptions: function() {

		var categories = [
			{
			  'id': 1,
		      'name':'Politics'
			},
			{
			  'id': 2,
		      'name':'Animals'
			},
			{
			  'id': 3,
		      'name':'Artists'
			}
		];
      return {
        data: categories,
        valueKey: 'name',
        apiKey: 'id',
        limit: 10,
   		name: 'categories',
        callback: function(name, model){
        	// debugger;
        }
      };
	}
});

module.exports = FiltersView;