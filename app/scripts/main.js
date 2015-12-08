'use strict';

require('./vendor/add-to-homescreen/src/addtohomescreen.min');
require('./jquerymobile_config');

var App = require('./app.js'),
	h = require('./globalHelpers.js'),
	FastClick = require('fastclick');

	addToHomescreen({
        autostart: false,
        maxDisplayCount: 1
    });

    console.log('Starting...');

    $(function() {
        FastClick.attach(document.body);
    });

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


new App().init();
h().startLogger();
