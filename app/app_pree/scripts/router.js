var API = {
    dashboard: function() {
        var centralPartController = require('./controllers/centralPartController'),
        	rightPartController = require('./controllers/rightPartController'),
            headerController = require('./controllers/headerController'),
            leftPartController = require('./controllers/leftPartController');
        headerController.showLayout();
        centralPartController.showLayout();
        leftPartController.showLayout();
        rightPartController.showLayout();
    }
};

var AppRouter = Mn.AppRouter.extend({

    controller: API,

    appRoutes: {
        '': 'dashboard'
    }
});

module.exports = AppRouter;
