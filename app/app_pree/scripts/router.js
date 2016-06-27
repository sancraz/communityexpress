var API = {
    dashboard: function() {
        var centralPartController = require('./controllers/centralPartController'),
        	rightPartController = require('./controllers/rightPartController');
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
