/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    PageLayout = require('./components/pageLayout');

var SaslDetailedView = PageLayout.extend({

    name: 'saslDetailed',

    initialize: function(options) {
        this.options = options || {};
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
    },

    renderData: function(){
        return _.extend(this.model);
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerBusinessListView'
        });
    },

    onHide: function() {
    },

    triggerBusinessListView: function() {
        Vent.trigger('viewChange', 'businessList', this.options);
    }

});

module.exports = SaslDetailedView;
