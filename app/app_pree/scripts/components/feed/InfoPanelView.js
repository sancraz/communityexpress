'use strict';

var InfoPanelView = Mn.ItemView.extend({

    el: '.infoPanel',

    ui: {
        filterTab: '.filter_tab',
        expandedFilters: '.collapsed-filters',
        createQuestionBtn: '.create_question_btn'
    },

    events: {
        'click @ui.filterTab': 'onSelectFiltersTab',
        'click @ui.createQuestionBtn': 'triggerCreateQuestion'
    },

    initialize: function() {
    },

    onSelectFiltersTab: function(e) {
        $(this.ui.expandedFilters).collapse('hide');
        var $target = $(e.currentTarget),
			filter = $target.data('filtertype');
		this.trigger('selectFilter', filter);
    },

    triggerCreateQuestion: function() {
        $('.js-select-tags-region').slideUp('slow', _.bind(function() {
            this.trigger('createQuestion');
        }, this));
    }
});

module.exports = InfoPanelView;
