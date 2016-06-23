'use strict';

// require('./styles/pree_styles.css');
require('./styles/style.css');
require('./styles/main.scss');

var App = require('./scripts/app');

var h = require('./scripts/globalHelpers');

App.start();
h().startLogger();
