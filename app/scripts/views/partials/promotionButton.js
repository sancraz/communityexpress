/*global define*/

'use strict';

var Backbone = require('backbone'),
    template = require('../../templates/partials/promotionButton.hbs'),
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
        loader.show('retrieving promotions');
        promotionsController.fetchPromotionUUIDsBySasl(
            this.model.sa(),
            this.model.sl(),
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
