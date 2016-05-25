/*global define*/

'use strict';

var Vent = require('../../Vent'),
    tileActions = require('../../actions/tileActions'),
    sessionActions = require('../../actions/sessionActions'),
    userController = require('../../controllers/userController'),
    loader = require('../../loader');

var NavbarView = Backbone.View.extend({

    el: '#cmtyx_navbar',

    events: {
        'click .menu_button_1': 'showButtonUnavailable',
        'click .menu_button_2': 'showButtonUnavailable',
        'click .menu_button_3': 'selectLocation',
        'click .menu_button_4': 'triggerBusinessListView',
        'click .menu_button_5': 'toggle'
    },

    initialize: function(options) {
        this.options = options || {};
        this.page = options.page;

        this.user = sessionActions.getCurrentUser();
        if (this.user.getUID()) {
            $('.menu_button_5').removeClass('navbutton_sign_in').addClass('navbutton_sign_out');
        };

        this.listenTo(Vent, 'login_success logout_success', this.render, this);

        this.listenTo(this.parent, 'hide', this.remove, this);

        if (!this.page) {
            throw new Error('MapHeader::Expected a page');
        }
    },

    selectLocation: function() {
        var self = this;
        tileActions.getLocations()
            .then(function(locations) {
                self.page.openSubview('locationList', locations);
            });
    },

    triggerBusinessListView: function() {
        Vent.trigger('viewChange', 'businessList', this.options);
    },

    showButtonUnavailable: function() {
        this.page.openSubview('buttonUnavailable');
    },

    confirmSignout: function () {
        this.page.openSubview('confirmationPopup', {}, {
            text: 'Are you sure you want to sign out?',
            action: this.signout.bind(this)
        });
    },

    signout: function() {
        loader.show();
        userController.logout(this.user.getUID()).then(function(){
            loader.showFlashMessage( 'signed out' );
            $('.menu_button_5').removeClass('navbutton_sign_out').addClass('navbutton_sign_in');
        }, function(e){
            loader.showFlashMessage(h().getErrorMessage(e, config.defaultErrorMsg));
        });
    },

    signin: function() {
        this.page.openSubview('signin', this.model);
    },

    toggle: function () {
        if ( !this.user.getUID()) {
            this.signin();
        } else {
            this.confirmSignout();
        }
    }

});

module.exports = NavbarView;