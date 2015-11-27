/*global define*/

'use strict';

var PanelView = require('../components/panelView'),
    config = require('../../appConfig');

var defaults = {
    imagePath: config.imagePath
};

var RestaurantMenuView = PanelView.extend({

    template: require('../../templates/restaurantMenu.hbs'),

    initialize: function(options){
        this.options = options || {};
        this.$el.attr('id', 'cmntyex_menu_panel');
        this.menuOptions = _.extend({}, defaults, options);
    },

    render: function() {
        var buttons = _.filter(this.options, function (option, key) {
            if (!option || !option.masterEnabled) return false;
            option.key = key;
            return true;
        });
        this.$el.html(this.template({buttons: buttons}));
        return this;
    }
});

module.exports = RestaurantMenuView;
