/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/promotionButton.ejs'),
    loader = require('../../loader'),
    promotionsController = require('../../controllers/promotionsController');

var PromotionButton = Backbone.View.extend({

    template: template,

    events: {
        'click': 'open'
    },

    initialize: function (options) {
        options = options || {};
        this.parent = options.parent;

        this.listenTo(this.parent, 'hide', this.remove, this);
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    open: function(pid) {
        var sa = saslData.serviceAccommodatorId,
            sl = saslData.serviceLocationId;
        loader.show('retrieving promotions');
        promotionsController.fetchPromotionUUIDsBySasl(
            sa,
            sl,
            // this.model.sa(),
            // this.model.sl(),
            this.parent.user.getUID()
        ).then(function(promotions) {
            if(promotions.length < 1) {
                loader.showFlashMessage('No promotions were found');
            } else {
                this.parent.openSubview('promotions', promotions, {pid: pid, sasl: this.model});
            }
        }.bind(this), function () {
            loader.showFlashMessage('error retrieving promotions');
        });
    }

});

module.exports = PromotionButton;
