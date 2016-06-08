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
        answers:['This is answer 1','This is answer 2','None of the above']
    }, 

    initialize : function(attributes, options) {
        console.log("PreeQuestionModel instantiated");
    }
});

module.exports = PreeQuestionModel;
