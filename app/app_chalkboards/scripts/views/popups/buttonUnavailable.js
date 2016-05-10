/*global define*/

'use strict';

var template = require('ejs!../../templates/buttonUnavailable.ejs'),
    PopupView = require('../components/popupView');

var ButtonUnavailable = PopupView.extend({

    template: template

});

module.exports = ButtonUnavailable;
