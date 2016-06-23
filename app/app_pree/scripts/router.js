var loader = require('./loader');

var API = {
    dashboard: function() {
        loader.show('questions');
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
