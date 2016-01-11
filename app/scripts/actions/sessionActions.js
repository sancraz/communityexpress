/*global define*/

'use strict';

var userController = require('../controllers/userController.js'),
    favoriteActions = require('./favoriteActions.js'),
    communicationActions = require('./communicationActions.js'),
    Vent = require('../Vent.js'),
    appCache = require('../appCache.js'),
    gateway = require('../APIGateway/gateway'),
    User = require('../models/user.js'),
    updateActions = require('./updateActions');

var onLoginSuccess = function (response) {

    var user = appCache.fetch('user', new User());
    user.initiate(response.uid, response.userName);

    favoriteActions.getFavoritesForCurrentUser();

    if (response.localStorage !== false) {
        localStorage.setItem('cmxUID', response.uid);
    };
    Vent.trigger('login_success');

    if ("undefined" !== typeof $("#apiURLprefix").get(0)) {
         var a = localStorage.getItem("cmxUID");
         if ("undefined" !== typeof a && null !== a) {
             updateActions.updateLoyaltyStatus(a);
         }
    };

    if ("undefined" !== typeof $("#apiURLprefix").get(0)) {
            var a = localStorage.getItem("cmxUID");
            if ("undefined" !== typeof a && null !== a) {
                updateActions.updateLoyaltyStatus(a);
                updateActions.retrieveCalendar(a);
            } else {
                console.log("1. NO cmxUID, try to create one");
                /*
                * create user
                */
                updateActions.createAnonymousUser();
                console.log("anonymous user created");
            }

            updateActions.attachSharingButtons(); 

        } else {
            console.log("no api url");
        }

    return {
        uid: response.uid,
        username: response.userName
    };
};

module.exports = {

    getCurrentUser: function () {
        return appCache.fetch('user', new User());
    },

    setUser: function (uid, username) {
        return appCache.set('user', new User(uid, username));
    },

    enterInvitationCode: function (code, username, password, email) {
        return gateway.sendRequest('registerNewMemberWithInvitationCode', {
            code: code,
            username: username,
            password: password,
            email: email
        });
    },

    authenticate: function (uid) {
        return gateway.sendRequest('getAuthenticationStatus', {UID: uid}).then(function (response) {
            if (response.action && response.action.enumText === 'NO_ACTION') {
                onLoginSuccess({
                    uid: uid,
                    userName: response.userName
                });
            }
        });
    },

    getSessionFromLocalStorage: function () {
        var dfd = $.Deferred();
        var persistedUID;

        updateActions.createAnonymousUser();

        persistedUID = localStorage.getItem('cmxUID');
        if (persistedUID) {
            window.asdesds=persistedUID;
            gateway.sendRequest('getAuthenticationStatus', {UID: persistedUID}).then(function (response) {
                if (response.action && response.action.enumText === 'NO_ACTION') {
                    onLoginSuccess({
                        uid: persistedUID,
                        userName: response.userName
                    });
                } else {
                    localStorage.removeItem('cmxUID');
                }
                dfd.resolve();
            }, function onRequestError () {
                localStorage.removeItem('cmxUID');
                dfd.resolve();
            });
        } else {
            dfd.resolve();
            // checkAnonymous();
        }
        return dfd.promise();
    },

    startSession: function ( username, password ) {
        return userController.loginUser(username, password)
            .then(onLoginSuccess);
    },

    registerNewMember: function (sa, sl, username, password, email) {
        return gateway.sendRequest('registerNewMember', {
            serviceAccommodatorId: sa,
            serviceLocationId: sl,
            username: username,
            password: password,
            email: email
        }).then(onLoginSuccess);
    }

};
