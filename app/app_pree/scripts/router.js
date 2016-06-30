var API = {
    dashboard: function() {
        var centralPartController = require('./controllers/centralPartController'),
        	rightPartController = require('./controllers/rightPartController'),
            headerController = require('./controllers/headerController');
        headerController.showLayout();
        centralPartController.showLayout();
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
