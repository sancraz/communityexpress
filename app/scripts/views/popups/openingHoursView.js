/*global define*/

'use strict';

var template = require('../../templates/openingHours.hbs'),
    PopupView = require('../components/popupView'),
    h = require('../../globalHelpers');

var OpeningHoursView = PopupView.extend({

    template: template,

    id: 'cmntyex_opening_hours_popup',

    className: 'popup',

    _parseHours: function (data) {
        var dayStrings = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        var hours = [];
        _.each(data.shiftPolicies, function (shift, i) {
            _.each(shift.weekDayPolicies, function (v, k) {
                var index = dayStrings.indexOf(k);
                if (v && v.maxSeatCount == -2) {
                    hours[index] = hours[index] || [k];
                    hours[index].push('closed');
                } else if (v && v.timeRange) {
                    hours[index] = hours[index] || [k];
                    hours[index].push(h().toTwoDigit(v.timeRange.openingHours.startClock.hour) +
                            ':' + h().toTwoDigit(v.timeRange.openingHours.startClock.minute));
                    hours[index].push(h().toTwoDigit(v.timeRange.openingHours.endClock.hour) +
                            ':' + h().toTwoDigit(v.timeRange.openingHours.endClock.minute));
                } else {
                    hours[index] = hours[index] || [k];
                }
            });
        });
        return hours;
    },

    oHours: function() {
        var hours = this._parseHours(this.model);
        var r = [];
        _.each(hours, function (hour) {
            var midHour = [];
            var F = function() {
                if (hour[1] == "closed") {
                    return [0,'closed', ''];
                } else {
                    return _.each(hour, function(v, i) {
                        if (i == 1 && hour[1] && hour[2]) {
                            return hour[1] + hour[2];
                        } if (i > 2 && i % 2 > 0 && hour[i+1]) {
                            return hour[i]+hour[i+1];
                        }
                    });
                }
            };
        var P = '<tr>'+'<td>'+hour[0]+'</td>'+'<td>'+'<div>'+F()[1]+' - '+F()[2]+'</div>'+'</td>'+'</tr>';
        r.push(P);
        });

        return r[0]+r[1]+r[2]+r[3]+r[4]+r[5]+r[6];
    },

    render: function () {
        this.$el.html(this.template({ oh: this.oHours({ hours: this._parseHours(this.model) }) }));
        return this;
    }

});

module.exports = OpeningHoursView;
