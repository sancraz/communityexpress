/*global define*/

'use strict';

var Backbone = require('backbone');

var filterOptionModel = Backbone.Model.extend({

    idAttribute: "displayText"

});

module.exports = filterOptionModel;
