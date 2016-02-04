'use strict';

require('./styles/main.scss');
require('./styles/sitelette_icons.css');
require('./vendor/styles/jquery.jqplot.min.css');
require('./vendor/add-to-homescreen/style/addtohomescreen.css');
require('./vendor/styles/owl.carousel.css');
require('./vendor/styles/fullcalendar.min.css');
require('./vendor/styles/sitelette_theme1.css');
require('./vendor/styles/sitelette_theme2.css');
require('./styles/sitelette.css');

require('./vendor/add-to-homescreen/src/addtohomescreen.min');
require('./scripts/jquerymobile_config');
require('./vendor/jquery-mobile/js/jquery.mobile-1.4.5');
// require('./vendor/jquery-mobile/js/jquery.mobile-1.4.0.min');
require('imports?$=jquery!./vendor/scripts/owl.carousel.min');
require('imports?$=jquery!./vendor/scripts/jquery.jqplot.min');
require('imports?$=jquery!./vendor/scripts/jqplot.barRenderer.min');
require('imports?$=jquery!./vendor/scripts/jqplot.categoryAxisRenderer.min');
require('imports?$=jquery!./vendor/scripts/jqplot.pointLabels.min');
require('imports?$=jquery!./vendor/scripts/jquery-radiobutton.min');
require('./vendor/swipe/swipe');
require('jquery-mask-plugin');
require('moment');
require('fullcalendar');

var App = require('./scripts/app.js'),
    h = require('./scripts/globalHelpers.js'),
    updateActions = require('./scripts/actions/updateActions'),
    FastClick = require('fastclick');

    addToHomescreen({
        autostart: false,
        maxDisplayCount: 1
    });

    console.log('Starting...');

    $(function() {
        FastClick.attach(document.body);

        // Activate Carousel and Radiobutton
        updateActions.initOwlCarousel();
        updateActions.initRadiobutton();
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
