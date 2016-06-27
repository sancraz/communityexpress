/*global define*/

'use strict';

var  CatalogBasketModel = require('../models/CatalogBasketModel'),//
 
var RosterBasketModel = Backbone.Collection.extend({

	model : CatalogBasketModel,

	initialize : function(options) {
		this.prices = new Backbone.Model();
		this.sa="";
		this.sl="";
	},

	 

	addCatalog  : function(catalog, count ) {
		 
		this.dumpCartToConsole();
	},
	
	addCatalogRaw : function(catalogRaw, count ) { 
		this.dumpCartToConsole();
	},
	
	removeCatalog: function(catalog) {
		this.remove(catalog.get('uUID'));
	},

	getNumOf : function(catalog) {
		var model = this.get(catalog.get('uUID'));
		if (model) {
			return model.get('quantity');
		} else {
			return 0;
		}
	},

	getTotalPrice : function() {
		return this.reduce(function(sum, catalog, id) {
			return sum += catalog.get('quantity') * catalog.get('price');
		}.bind(this), 0).toFixed(2);
	},

	count : function() {
		return this.reduce(function(sum, catalog) {
			return sum += catalog.get('quantity');
		}.bind(this), 0);
	},

	dumpCartToConsole : function() {
		console.log("************----- current rosterCart --------");
		this.each(function(catalog, index, list) {
		    catalog.dumpCartToConsole();
 
		});
		console.log("*************---------------------------");
	},

	removeAllItems : function() {
		this.reset();
	}

});

module.exports = RosterBasketModel;
