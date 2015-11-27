/*global define*/

'use strict';

var Backbone = require('backbone');

var configurationModel = Backbone.Model.extend({

    defaults: {
        simulate: false
    }

});

module.exports = configurationModel;
