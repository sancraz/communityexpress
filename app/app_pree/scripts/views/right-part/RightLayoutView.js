'use strict';

var template = require('ejs!./rightLayout.ejs');

var RightLayoutView = Mn.LayoutView.extend({

    template: template,

    className: 'right-panel',

    regions: {
        createQuestionRegion: '#create-question-btn-region',
        whoToFollowRegion: '#who-to-follow-region'
    },

    showCreateQuestionBtn: function(view){
        this.createQuestionRegion.show(view);
    },

    showWhoToFollow: function(view) {
        this.whoToFollowRegion.show(view);
    }
});

module.exports = RightLayoutView;
