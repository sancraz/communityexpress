'use strict';

require('./styles/main.scss');
require('bootstrap-webpack');
require('./vendor/scripts/bootstrap-datetimepicker');
require('jquery-mask-plugin');
require('moment');

var App = require('./scripts/app'),
    h = require('./scripts/globalHelpers');

$(document).on('click', 'a[href]:not([data-bypass])', function(evt) {
    // Get the absolute anchor href.
    var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
    // Get the absolute root.
    var root = location.protocol + '//' + location.host;

    // Ensure the root is part of the anchor href, meaning it's relative.
    if (href.prop.slice(0, root.length) === root) {
        evt.preventDefault();
        // Backbone.history.navigate(href.attr, true);
    }
});

App.start();
h().startLogger();
