'use strict';

var userController = require('./controllers/userController'),
    configurationActions = require('./actions/configurationActions'),
    promotionActions = require('./actions/promotionActions'),
    sessionActions = require('./actions/sessionActions'),
    pageController = require('./pageController.js'),
    config = require('./appConfig.js'),
    h = require('./globalHelpers'),
    Vent = require('./Vent.js'),
    loader = require('./loader'),
    pageFactory = require('./pageFactory.js'),
    Geolocation = require('./Geolocation.js');

var hasUIDinQueryParams = function () {
    var params = location.search.match(/UID=/);
    return (params && params.length);
};

var App = function() {
    this.params = window.community;
    Vent.on('viewChange', this.goToPage, this);
    Vent.trigger('viewChange', 'locationSelect', window.community.friendlyURL);
};

App.prototype = {

    init: function() {

        // if (window.saslData.error) {
        //     loader.showFlashMessage(window.saslData.error.message);
        //     return;
        // }

        Geolocation.startWatching();

        var conf = configurationActions.getConfigurations();
        

        if (this.params.demo) { configurationActions.toggleSimulate(true); };
        if (this.params.embedded) { conf.set('embedded', true) };
        Backbone.history.start({pushState: true});
    },

    isEmbedded: function () {
        var params = location.search.match(/embedded=true/);
        return (params && params.length);
    },

    setGlobalConfigurations: function (options) {
        options = options || {};
        if ( options.demo === true ) {
            configurationActions.toggleSimulate(true);
        }
        if (options.server) {
            config.productionRoot = this.params.protocol + options.server + '/apptsvc/rest';
            config.simulateRoot = this.params.protocol + options.server + '/apptsvc/rest';
            config.apiRoot = config.productionRoot;
        }
    },

    goToPage: function( viewName, id, options ) {

        this.setGlobalConfigurations(options);

        if ( viewName === 'chat') { // redirect to restaurant view if user is not signed in
            viewName = userController.hasCurrentUser() ? 'chat' : 'restaurant';
        }

        loader.show('loading');

        this.initializePage(viewName, id, options).then(function(page){
            this.changePage(page, options);
            loader.hide();
        }.bind(this), function(e){
            loader.showErrorMessage(e, 'There was a problem loading this page');
        });

    },

    initializePage: function(viewName, options) {
        return pageController[viewName].call( pageController, options ).pipe(function(pageModel){
            return pageFactory.create( viewName, pageModel );
        }.bind(this));
    },

    changePage: function(view, jqmOptions) {
        var defaults = {
            allowSinglePageTransition: true,
            transition: 'none',
            changeHash:false,
            showLoader: false,
        };
        var settings = _.extend(defaults, jqmOptions);
        var content = view.renderContent().$el;

        // hide initial html content
        $('.theme2_background').hide();

        $.mobile.initializePage();
        $($.mobile.pageContainer).pagecontainer('change', content, settings);
        $('.splash_screen').remove();
    }

};

module.exports = App;
