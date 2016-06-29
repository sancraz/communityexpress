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
        subType: null,
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
        ]//,
        //answerInfo: null //this field makes an error 
    },

    requiredFields: {
        displayText: {
            length: 1
        },
        subType: {
            type: 'number'
        },
        choices: {
            length: 2,
            fields: {
                displayText: {
                    length: 1
                },
                isCorrect: {
                    type: 'boolean'
                }
            }
        }
    },

    validate: function(attrs) {
        var fails = [],
            validated = this._validator(attrs, this.requiredFields, fails);

        return validated ? false : fails;
    },

    _validator: function (attrs, fieldValidator, fails) {
        for (var field in fieldValidator) {
            var options = fieldValidator[field];
            for (var option in options) {
                var value = options[option];
                switch (option) {
                    case 'length':
                        if (!attrs[field] || attrs[field].length < value) {
                            fails.push(field);
                        }
                        break;
                    case 'type':
                        if (typeof attrs[field] === 'undefined' || attrs[field] === null || 
                            typeof attrs[field] !== value) {
                            fails.push(field);
                        }
                        break;
                    case 'fields':
                        if (!attrs[field]) {
                            fails.push(field);
                        } else {
                            var filtered = _.filter(attrs[field], _.bind(function(field){
                                var fails = [];
                                return this._validator(field, value, fails);
                            }, this));
                            if (filtered.length !== attrs[field].length) {
                                fails.push(field);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return fails.length === 0;
    }

});

module.exports = PreeNewQuestionModel;