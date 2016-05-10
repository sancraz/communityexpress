/*global define*/

'use strict';

var LocationList = require('./views/panels/locationList'),
    ButtonUnavailable = require('./views/popups/buttonUnavailable');

var viewMap = {
    locationList: LocationList,
    buttonUnavailable: ButtonUnavailable
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
