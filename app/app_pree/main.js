'use strict';

require('./styles/main.scss');
require('bootstrap-webpack');

var App = require('./scripts/app');

var h = require('./scripts/globalHelpers');

App.start();
h().startLogger();
