'use strict';

require('./vendor/add-to-homescreen/src/addtohomescreen.min');
require('./vendor/add-to-homescreen/style/addtohomescreen.css');
require('./scripts/jquerymobile_config');
require('./vendor/jquery-mobile/js/jquery.mobile-1.4.0.min');
require('./styles/main.scss');
require('./styles/sitelette_icons.css');
require('./vendor/swipe/swipe');

var App = require('./scripts/app.js'),
    h = require('./scripts/globalHelpers.js'),
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
