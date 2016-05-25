/*global define*/

'use strict';

var LocationList = require('./views/panels/locationList'),
    ButtonUnavailable = require('./views/popups/buttonUnavailable'),
    MobilePopup = require('./views/popups/mobilePopup'),
    EmailPopup = require('./views/popups/emailPopup'),
    SigninView = require('./views/panels/signinView'),
    SignupView = require('./views/panels/signupView'),
    ConfirmationPopup = require('./views/popups/confirmationPopup');

var viewMap = {
    locationList: LocationList,
    buttonUnavailable: ButtonUnavailable,
    mobilePopup: MobilePopup,
    emailPopup: EmailPopup,
    signin: SigninView,
    signup: SignupView,
    confirmationPopup: ConfirmationPopup
};

module.exports = {

    create: function(viewname, model, parent, options) {
        if (viewname === 'legend') {
            return this.createLegendView();
        }
        else if ( viewMap[viewname] ){
            return new viewMap[viewname](_.extend({},{
                collection: model,
                model: model,
                parent: parent
            }, options ));
        }
        throw new Error('unknown view ' + viewname);
    },

    createLegendView: function () {
        return configurationActions.getLegendInfo()
            .then(function (response) {
                return new LegendView(response);
            });
    }

};
