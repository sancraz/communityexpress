'use strict';

require('./styles/main.scss');
require('bootstrap-webpack');
require('./vendor/scripts/bootstrap-datetimepicker.min');

var App = require('./scripts/app');

var h = require('./scripts/globalHelpers');

App.start();
h().startLogger();
