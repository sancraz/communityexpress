/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    eventActions = require('../actions/eventActions'),
    h = require('../globalHelpers');

module.exports = PageLayout.extend({

    name: 'eventActive',

    renderData: function () {
        return { attrs: this.attrs};
    },

    initialize: function(options) {
        debugger;
        this.options = options || {};
        this.attrs = this.options.eventAttrs;
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
        console.log(this.attrs);
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerLandingView'
        });
    },

    triggerLandingView: function() {
        Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), { reverse: true })
    }

});