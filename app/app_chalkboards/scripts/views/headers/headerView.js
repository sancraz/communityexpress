'use strict';

var Vent = require('../../Vent'),
	loader = require('../../loader');

var HeaderView = Backbone.View.extend({

	initialize: function(options) {
		this.options = options || {};
		this.page = options.page;
		this.listenTo(this.page, 'hide', this.remove, this);
	},

	render: function() {
		this.showHeader();
		return this;
	},

	showHeader: function() {
		var header = $('#cmtyx_header');
		this.setElement($(header[0].outerHTML));
		this.$el.appendTo('body');
		this.$el.find('.theme2_banner').text(this.model.name);
	}
});

module.exports = HeaderView;