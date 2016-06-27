'use strict';

var App = require('../app'),
    RightLayoutView = require('../views/right-part/RightLayoutView'),
    CreateQuestionBtnView = require('../views/right-part/CreateQuestionBtnView'),
    WhoToFollowView = require('../views/right-part/WhoToFollowView');

module.exports = {

    showLayout: function() {
        this.rightLayoutView = new RightLayoutView();
        App.regions.getRegion('rightRegion').show(this.rightLayoutView);
        this.showViews();
    },

    showViews: function() {
        var createQuestion = new CreateQuestionBtnView(),
            whoToFollow = new WhoToFollowView();
        this.rightLayoutView.showCreateQuestionBtn(createQuestion);
        this.rightLayoutView.showWhoToFollow(whoToFollow);
    }
}
