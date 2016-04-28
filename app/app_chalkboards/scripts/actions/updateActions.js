'use strict';

// require('fullcalendar');
// require('jquery-mask-plugin');

module.exports = {

    updateLoyaltyStatus: function(UID) {
        // var urlPrefix = $("#apiURLprefix").text();
        var urlPrefix = community.protocol+community.server+'/apptsvc/rest/';
        var loyaltyAPIURL = urlPrefix + "retail/retrieveLoyaltyStatus";
        loyaltyAPIURL = this.buildUrl(loyaltyAPIURL, 'UID', UID);
        loyaltyAPIURL = this.buildUrl(loyaltyAPIURL, "serviceAccommodatorId",
        window.saslData.serviceAccommodatorId);
        loyaltyAPIURL = this.buildUrl(loyaltyAPIURL, "serviceLocationId",
        window.saslData.serviceLocationId);
        console.log(loyaltyAPIURL);
        $.get(loyaltyAPIURL, function(a) {
            if (a.hasLoyaltyProgram) {
                $("#loyaltyLine1").text(a.loyaltyBlockLine1);
                $("#loyaltyLine2").text(a.loyaltyBlockLine2);
                $("#loyaltyLine3").text(a.loyaltyBlockLine3);
            } else {
            /*
            * nothing to do. Loyalty block is not visible
            */
            }
            /*
            * regardless of loyalty program, update the qr code block since we may use
            * this for other things.
            */
            $("#qrCodePlaceholder").hide();
            $("#qrCodeBlock").show();
            $("#qrCodeImage").empty();
            $("#qrCodeImage").prepend(
            '<img id="theQRCodeImage" src=' + a.qrcodeURL + ' />');
            $("#qrCodeBlockLine1").text(a.qrCodeBlockLine1);
            $("#qrCodeBlockLine2").text(a.qrCodeBlockLine2);
            $("#qrCodeBlockLine3").text(a.qrCodeBlockLine3);
        }, "json");
    },

    retrieveCalendar: function(UID) {
        // var urlPrefix = $("#apiURLprefix").text();
        var urlPrefix = community.protocol+community.server+'/apptsvc/rest/';
        var appointmentURL = urlPrefix + "appointments/fc_retrieveEvents";
        appointmentURL = this.buildUrl(appointmentURL, 'UID', UID);
        appointmentURL = this.buildUrl(appointmentURL, "serviceAccommodatorId",
        window.saslData.serviceAccommodatorId);
        appointmentURL = this.buildUrl(appointmentURL, "serviceLocationId",
        window.saslData.serviceLocationId);

        $('#calendar').fullCalendar(
            {
                contentHeight : 475,
                displayEventTime : false,
                displayEventEnd : false,
                minTime : "09:00:00",
                maxTime : "17:00:00",
                header : {
                left : 'title',
                right : 'prev,next today',
                center : null
                // center: 'title',
                // right: 'month,basicWeek,basicDay'
            },
            views : {
                agendaDay : { // name of view
                titleFormat : 'MMM D \'YY',
                allDaySlot : false
                // other view-specific options here
                }
            },
            defaultDate: '2015-12-05',
            defaultView : 'agendaDay',
            editable : false,
            eventLimit : true, // allow "more" link when too many events
            eventClick : function(calEvent, jsEvent, view) {
                if (typeof calEvent.cmtyx === 'undefined'
                || calEvent.cmtyx !== 'NOT_AVAILABLE') {
                    $.ajax({
                        url : calEvent.apiURL,
                        data : "", // 'type=changetitle&title='+title+'&eventid='+event.id,
                        type : 'PUT',
                        dataType : 'json',
                        success : function(response) {
                            $('#calendarSuccess').html("Success");
                            $('#calendarSuccess').slideDown("slow");
                            setTimeout(function() {
                                $('#calendarSuccess').slideUp();
                                }, 2000);
                            if (response.success === true) {
                                $('#calendar').fullCalendar('refetchEvents');
                            } else {
                                $('#calendarWarning').html("Error:" + response.explanation);
                                $('#calendarWarning').slideDown("slow");
                                setTimeout(function() {
                                    $('#calendarWarning').slideUp();
                                }, 2000);
                            }
                        },
                        error : function(jqXHR, error, errorThrown) {
                            $('#calendarSuccess').hide();
                            $('#calendarLoading').hide();
                            var msg = "Service unavailable";
                            if (typeof jqXHR !== 'undefined') {

                                try {
                                    var errorObj = JSON.parse(jqXHR.responseText);
                                    msg = errorObj.error.message;
                                } catch (error) {
                                    msg = 'Service unavailable';
                                }
                            } else {
                                msg = jqXHR.responseText;
                            }

                            $('#calendarWarning').html("Error:" + msg);
                            $('#calendarWarning').slideDown("slow");
                            setTimeout(function() {
                                $('#calendarWarning').slideUp();
                            }, 5000);
                        }
                    });

                }

            },
            events : {
                url : appointmentURL,
                error : function(jqXHR, error, errorThrown) {
                    // var errorObj = JSON.parse(jqXHR);
                    $('#calendarSuccess').hide();
                    $('#calendarLoading').hide();

                    var msg = "Service not available";
                    if (typeof jqXHR.error !== 'undefined') {
                        try {
                            var errorObj = JSON.parse(jqXHR.responseText);
                            msg = errorObj.error.message;
                        } catch (exception) {
                            msg = "Service unavailable";
                        }

                    } else {
                        msg = jqXHR.responseText;
                    }

                    $('#calendarWarning').html("Error:" + msg);
                    $('#calendarWarning').slideDown("slow");

                    $('#calendar').slideUp("slow");
                },
                success : function(e) {
                    $('#calendarLoading').slideUp("slow");
                }
            }
        });
    },

    createAnonymousUser: function(UID) {
        var self = this;
        // var urlPrefix = $("#apiURLprefix").text();
        var urlPrefix = community.protocol+community.server+'/apptsvc/rest/';
        var ancnUserCreateAPI = urlPrefix + "authentication/registerAnonymousAdhocMember";
        ancnUserCreateAPI = this.buildUrl(ancnUserCreateAPI, "serviceAccommodatorId",
        window.saslData.serviceAccommodatorId);
        ancnUserCreateAPI = this.buildUrl(ancnUserCreateAPI, "serviceLocationId",
        window.saslData.serviceLocationId);
        console.log(ancnUserCreateAPI);
        $.post(
            ancnUserCreateAPI,
            function(userRegistrationDetails) {
                if (typeof userRegistrationDetails.uid !== 'undefined') {

                    /*
                    * save it in localstorage
                    * 
                    */
                    console.log(" saving to local storage cmxUID:"
                    + userRegistrationDetails.uid)
                    localStorage.setItem("cmxUID", userRegistrationDetails.uid);

                    require([ "./sessionActions" ], function(c) {
                    c.setUser(userRegistrationDetails.uid, userRegistrationDetails.userName);
                    });
                    self.updateLoyaltyStatus(userRegistrationDetails.uid);
                    self.retrieveCalendar(userRegistrationDetails.uid);
                }
            }, "json").fail(function(e) {
            console.log("2. error in API call" + e);
        });
    },

    attachSharingButtons: function() {
        $("#sms_button").click(function() {
            $("#sms_input_block").slideToggle('1000');
            $('#sms_input').val('').focus();
        });

        $("#sms_send_button").click(function() {
            var urlPrefix = $("#apiURLprefix").text();
            var smsURL = urlPrefix + "html/sendAppURLForSASLToMobileviaSMS";
            smsURL = this.buildUrl(smsURL, 'UID', 'user.anonymous');
            smsURL = this.buildUrl(smsURL, "serviceAccommodatorId",
            window.saslData.serviceAccommodatorId);
            smsURL = this.buildUrl(smsURL, "serviceLocationId",
            window.saslData.serviceLocationId);
            smsURL = this.buildUrl(smsURL, "toTelephoneNumber", $('#sms_input').val());

            $("#sms_input_block").slideUp('1000');
            $('#sms_sendResults').slideDown('1000').html("Sending message...");

            var request = $.ajax({
                headers : {
                    Accept : 'application/json;charset=utf-8'
                },
                type : 'GET',
                url : smsURL,
                contentType : "application/json;charset=utf-8",
                dataType : 'json',
                timeout : 3000
            });

            request.done(function(jqXHR) {
                console.log("results:" + jqXHR);
                $('#sms_sendResults').slideDown('1000').html(jqXHR.explanation);
            });

            request.fail(function(jqXHR, textStatus) {
                var errorMessage = "Operation failed";
                if (textStatus === "timeout") {
                    errorMessage = 'Service Unavailable';
                } else {
                    if (typeof jqXHR.responseJSON !== 'undefined') {
                        if (typeof jqXHR.responseJSON.error !== 'undefined') {
                            errorMessage = jqXHR.responseJSON.error.message;
                        }
                    }
                }
                $('#sms_sendResults').slideDown('1000').html(errorMessage);
            });

            request.always(function() {
                setTimeout(function() {
                    $('#sms_sendResults').slideUp('1000');
                }, 4000);
            });
        });

        $('.phone_us').mask('(000) 000-0000');

    },

    openCustomURLinIFrame: function(a) {
        var b = document.documentElement;
        var c = document.createElement("IFRAME");
        c.setAttribute("src", a);
        b.appendChild(c);
        c.parentNode.removeChild(c);
    },

    iosJavascriptLogin: function(a, b, c, d) {
        var e = "js2ios://community_login";
        e = e + "?functionName=" + a;
        console.log("url being invoked:" + e);
        openCustomURLinIFrame(e);
    },

    IOSLoginSucceeded: function(a, b) {
        console.login("IOSloginSucceeded:" + a + ", " + b);
        require([ "./sessionActions" ], function(c) {
        c.setUser(a, b);
        });
    },

    buildUrl: function(a, b, c) {
        var d = a.indexOf("?") > -1 ? "&" : "?";
        return a + d + b + "=" + c;
    },

    initOwlCarousel: function() {
        $('#media_carousel').owlCarousel({ 
            items:1,
            loop:true,
            margin:0,
            autoplay:true,
            autoplayTimeout:3000,
            dots:false,
            animateOut:'fadeOut',
            animateIn:'fadeIn'
        });
    },

    pollContestAction: function(uuid,choice) {
        if (typeof choice !== 'undefined') {
            $('#' + uuid + ' input[type=radio]').attr('disabled', true);
            $('#' + uuid + ' a').fadeTo('slow', .3).removeAttr('href');
            $('#' + uuid + ' a').off();
            var url = community.protocol + community.server + '/apptsvc/rest/contests/enterPollAnonymous';
            console.log(' url:' + url);
            var data = {
                'choiceId' : choice,
                'serviceAccommodatorId' : community.serviceAccommodatorId,
                'serviceLocationId' : community.serviceLocationId,
                'contestUUID' : uuid
            };
            $(event.target).fadeOut('slow');
            $('#pollresultsplot' + uuid).fadeIn('slow');
            $(document).ready(function() {
                console.log('starting');
                var request = $.ajax({
                headers : {
                    Accept : 'application/json;charset=utf-8'
                },
                type : 'POST',
                url : url,
                contentType : 'application/json;charset=utf-8',
                data : JSON.stringify(data)
                }).done(function(response) {
                    console.log('done:');
                    var dataArray = response.dataArray, options = response.options;
                    options.seriesDefaults.renderer = eval(options.seriesDefaults.renderer);
                    options.axes.yaxis.renderer = eval(options.axes.yaxis.renderer);
                    options.axes.yaxis.rendererOptions.tickRenderer = eval(options.axes.yaxis.rendererOptions.tickRenderer);
                    $.jqplot('pollresultsplot' + uuid, dataArray, options);
                }).fail(function(e, o) {
                    console.log('Request failed: ' + o);
                    if ('undefined' != typeof e.responseJSON && 'undefined' != typeof e.responseJSON.error)
                    console.log(' Error:' + e.responseJSON.error.message);
                }).always(function() {
                    console.log(' All done');
                });
            });
        }
    }

};
