var API = {
    dashboard: function() {
        var centralPartController = require('./controllers/centralPartController');
        centralPartController.showLayout();
    }
};

var AppRouter = Mn.AppRouter.extend({

    controller: API,

    appRoutes: {
        '': 'dashboard'
    }
});

module.exports = AppRouter;
