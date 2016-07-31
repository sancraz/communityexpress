'use strict';

var PreeQuestionModel = Backbone.Model.extend({

    defaults : {
        title:'na',
        isAnswered : false,
        currentAnswerChecked : 0,
        options : null,
        anotatation : null,
        expandResults:false,
        showInformation:false,
        answers:['This is answer 1','This is answer 2','None of the above'],
        highlighted:false
    },

    initialize : function(attributes, options) {
        console.log("PreeQuestionModel instantiated");
        /* pull up the answered state */
        this.isAnswered=attributes['userStatus']['enumText']==='ANSWERED';
        this.currentAnswerChecked=attributes['currentChoiceForUser'];
        this.highlighted=attributes['displayStyle']==='HIGHLIGHT';
        console.log('Question '+this.isAnswered);
    },

    changedAttribute: function() {
        console.log('changed');
    }
});

module.exports = PreeQuestionModel;
