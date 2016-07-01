'use strict';

var PreeNewQuestionModel = Backbone.Model.extend({

    defaults : {
        activationDate: null,  // 07/27/2016 12:00 AM
        expirationDate : null, // '2016-11-01T09:45:00.000+02',
        notifyAuthorDaysAfterExpiration: 0,
        contestName : 'N/A',
        displayText : '', //'What is the oldest tree in the world'
        hiddenText : '',
        contestCustomerId : null,
        isAnonymous : false,
        contestUUID: null,
        subType: 0,
        url: '',
        infoURL1: '',
        infoURL2: '',
        categories: [], //['Nature']
        hashTags: [], //['SaveWhales']
        choices: [
            {
                choiceName: null,
                displayText: '', //'It is a Redwood somewhere in California'
                isCorrect: false
            },
            {
                choiceName: null,
                displayText: '', //'Its a Joshua Tree in Australia'
                isCorrect: false //true
            }
        ],
        additionalInformation: '', 
        bonusPoints: 0,
        basePoints: 0
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
        },
        activationDate: { //TODO date validation
            length: 15
        },
        expirationDate: {
            length: 15
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