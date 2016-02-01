'use strict';

var userController = require('./controllers/userController'),
	configurationActions = require('./actions/configurationActions'),
    updateActions = require('./actions/updateActions'),
	sessionActions = require('./actions/sessionActions'),
	pageController = require('./pageController.js'),
	Router = require('./router.js'),
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
    this.router = new Router();
    this.params = window.community;
    // this.params = h().parseQueryString(location.search.substring(1)) || {};
    // {demo: true, desktopiframe: true}
    Vent.on('viewChange', this.goToPage, this);
};

App.prototype = {

    init: function() {

        if (window.saslData.error) {
            loader.showFlashMessage(window.saslData.error.message);
            return;
        }

        Geolocation.startWatching();
        var conf = configurationActions.getConfigurations();
        console.log(this.params);
        

        if (this.params.demo) { configurationActions.toggleSimulate(true); };
        if (this.params.embedded) { conf.set('embedded', true) };
        // if (this.params.embedded && !this.params.UID) {
        //     conf.set('embedded', true);
        //     Backbone.history.start({pushState: true});
        // } else if (this.params.embedded && this.params.UID) {
        //     conf.set('embedded', true);
        //     sessionActions.authenticate(this.params.UID)
        //         .always(function () {
        //             Backbone.history.start({pushState: true});
        //         });
        // } else {
        //     sessionActions.getSessionFromLocalStorage().then(function () {
        //         Backbone.history.start({pushState: true});
        //     });
        // }
        if (this.params.UID) {
            localStorage.setItem("cmxUID", this.params.UID);
            sessionActions.authenticate(this.params.UID)
                .always(function() {
                    Backbone.history.start({pushState: true});
                });
        } else if (localStorage.cmxUID) {
            sessionActions.getSessionFromLocalStorage().then(function () {
                Backbone.history.start({pushState: true});
            });
        } else if (this.params.canCreateAnonymousUser) {
            updateActions.createAnonymousUser();
            sessionActions.getSessionFromLocalStorage().then(function () {
                Backbone.history.start({pushState: true});
            });
        } else {
            return
        }
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
            // config.productionRoot = 'http://' + options.server + '/apptsvc/rest';
            // config.simulateRoot = 'http://' + options.server + '/apptsvc/rest';
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
            this.updateUrl(viewName, pageModel);
            this.updateTitle(viewName, pageModel);
            this.updateTouchIcon(viewName, pageModel);
            return pageFactory.create( viewName, pageModel );
        }.bind(this));
    },

    updateUrl: function (viewName, pageModel) {
        // var url;
        // switch (viewName) {
        // case 'tiles':
        //     url = 'tiles';
        //     break;
        // case 'map':
        //     url = '';
        //     break;
        // case 'promotions':
        //     url = pageModel.url + '?t=p&u=' + pageModel.pid;
        //     break;
        // default:
        //     url = pageModel.url;
        // }
        // this.router.navigate(url);
    },

    updateTitle: function (viewName, pageModel) {
        var title;
        switch (viewName) {
            case 'restaurant':
            case 'promotions':
                title = pageModel.model.get('saslName');
            break;
            case 'chat':
            case 'reviews':
                title = pageModel.restaurant.get('saslName');
            break;
            case 'editable':
                title = pageModel.restaurant.get('saslName');
            break;
            default:
                title = 'sitelette.com';
        }
        document.title = title;
    },

    updateTouchIcon: function (viewName, pageModel) {
        var icon;
        switch (viewName) {
            case 'restaurant':
            case 'promotions':
                icon = pageModel.model.get('appleTouchIcon60URL');
                break;
            case 'chat':
                icon = pageModel.restaurant.get('appleTouchIcon60URL');
            break;
            case 'reviews':
                icon = pageModel.restaurant.get('appleTouchIcon60URL');
            break;
            default:
                icon = 'icon_57.png';
        }
        var links = document.getElementsByTagName('link');
        _(links).each(function (link) {
            if (link.getAttribute('rel') === 'apple-touch-icon') {
                link.href = icon;
            }
        });
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
        // $('.ui-header').hide();

        $.mobile.initializePage();
        $($.mobile.pageContainer).pagecontainer('change', content, settings);
        $('.splash_screen').remove();
    }

};

module.exports = App;
