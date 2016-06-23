'use strict';

var PreeTagsCollection = Backbone.Collection.extend({
	//makes collections models unique
    add : function(truck) {
    	var isDuplicated = this.any(function(_truck) { 
	        return _truck.get('displayText') === truck.get('displayText');
	    });
	    return isDuplicated ? false : Backbone.Collection.prototype.add.call(this, truck);
	}
});
    
module.exports = PreeTagsCollection;
