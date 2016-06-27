/*global define*/

'use strict';

var userController = require('../controllers/userController.js'),
    Vent = require('../Vent'),
    appCache = require('../appCache.js'),
    gateway = require('../APIGateway/gateway'),
    User = require('../models/user.js');

var onLoginSuccess = function (response) {

    var user = appCache.fetch('user', new User());
    user.initiate(response.uid, response.userName);

    if (response.localStorage !== false) {
        localStorage.setItem('cmxUID', response.uid);
    };
    Vent.trigger('login_success');

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
    },

    createAnonymousUser: function() {
        var self = this;
        return gateway.sendRequest('createAnonymousUser', {
            serviceAccommodatorId: '',
            serviceLocationId: ''
        }).then(function(userRegistrationDetails) {
            if (typeof userRegistrationDetails.uid !== 'undefined') {

                /*
                * save it in localstorage
                *
                */
                console.log(" saving to local storage cmxUID:"
                + userRegistrationDetails.uid)
                localStorage.setItem("cmxUID", userRegistrationDetails.uid);

                self.setUser(userRegistrationDetails.uid, userRegistrationDetails.userName);
            }
        })
    }

};
