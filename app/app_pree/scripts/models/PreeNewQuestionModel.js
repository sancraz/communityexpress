'use strict';

var PreeNewQuestionModel = Backbone.Model.extend({

    defaults : {
        activationDate:'2016-05-01T09:45:00.000+02',
        expirationDate : '2016-11-01T09:45:00.000+02',
        contestName : 'Oldest tree',
        displayText : 'What is the oldest tree in the world',
        isAnonymous : false,
        contestUUID: 'wwwwwwww3',
        // userPointsEarned: 10, //this field makes an error 
        subType: 2,
        categories: ['Nature'],
        hashTags: ['SaveWhales'],
        choices: [
            {
                choiceName: 'A Redwood',
                displayText: 'It is a Redwood somewhere in California',
                isCorrect: false
            },
            {
                choiceName: 'A Joshua Tree',
                displayText: 'Its a Joshua Tree in Australia',
                isCorrect: true
            }
        ]
    }

});

module.exports = PreeNewQuestionModel;