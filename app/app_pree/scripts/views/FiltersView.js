'use strict';

var gateway = require('../APIGateway/gateway'),
	template = require('ejs!../templates/filters.ejs'),
	TagsView = require('./autocomplete/TagsView');

var FiltersView = Mn.LayoutView.extend({

	template: template,

	regions: {
		categoriesRegion: '.js-select-categories-region'
	},

	serializeData: function() {
		return {};
	},

	onShow: function() {

		gateway.sendRequest('getPreeCategories', {
      	}).then(_.bind(function(resp) {
     		this.showCategories(resp);
        }, this), function(e) {

        });
	},

	showCategories: function(categories) {
		var categoriesView = new TagsView({
			items: categories
		});
		this.getRegion('categoriesRegion').show(categoriesView);
	}
});

module.exports = FiltersView;