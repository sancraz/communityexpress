'use strict';

var Vent = require('../../Vent'),
	loader = require('../../loader');

var HeaderView = Backbone.View.extend({

	el: '#cmtyx_header',

	initialize: function(options) {
		this.options = options || {};
		this.page = options.page;
		this.options.text = 'Title';
		this.listenTo(this.parent, 'hide', this.remove, this);
	},

	render: function() {
		this.showHeaderTitle();
        return this;
    },

	showHeaderTitle: function() {
		this.$el.replaceWith(this.options.model.headerDiv);
	}
});

module.exports = HeaderView;