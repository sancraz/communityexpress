/* sitelette.js */window.retrieveCalendar = function(UID) {
 var urlPrefix = $("#apiURLprefix").text();
 var appointmentURL = urlPrefix + "appointments/fc_retrieveEvents";
 appointmentURL = buildUrl(appointmentURL, 'UID', UID);
 appointmentURL = buildUrl(appointmentURL, "serviceAccommodatorId",
   window.saslData.serviceAccommodatorId);
 appointmentURL = buildUrl(appointmentURL, "serviceLocationId",
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
    // defaultDate: '2015-12-05',
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
};

window.createAnonymousUser = function(UID) {
 var urlPrefix = $("#apiURLprefix").text();
 var ancnUserCreateAPI = urlPrefix
   + "authentication/registerAnonymousAdhocMember";
 ancnUserCreateAPI = buildUrl(ancnUserCreateAPI, "serviceAccommodatorId",
   window.saslData.serviceAccommodatorId);
 ancnUserCreateAPI = buildUrl(ancnUserCreateAPI, "serviceLocationId",
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

     //window.require([ "actions/sessionActions" ], function(c) {
     // c.setUser(userRegistrationDetails.uid, userRegistrationDetails.userName);
     //});
     window.updateLoyaltyStatus(userRegistrationDetails.uid);
     window.retrieveCalendar(userRegistrationDetails.uid);
    }
   }, "json").fail(function(e) {
  console.log("2. error in API call" + e);
 });
};

window.attachSharingButtons = function() {
 $("#sms_button").click(function() {
  $("#sms_input_block").slideToggle('1000');
  $('#sms_input').val('').focus();
 });

 $("#sms_send_button").click(
   function() {

    var urlPrefix = $("#apiURLprefix").text();
    var smsURL = urlPrefix + "html/sendAppURLForSASLToMobileviaSMS";
    smsURL = buildUrl(smsURL, 'UID', 'user.anonymous');
    smsURL = buildUrl(smsURL, "serviceAccommodatorId",
      window.saslData.serviceAccommodatorId);
    smsURL = buildUrl(smsURL, "serviceLocationId",
      window.saslData.serviceLocationId);
    smsURL = buildUrl(smsURL, "toTelephoneNumber", $('#sms_input').val());

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

};

window.openCustomURLinIFrame = function(a) {
 var b = document.documentElement;
 var c = document.createElement("IFRAME");
 c.setAttribute("src", a);
 b.appendChild(c);
 c.parentNode.removeChild(c);
};

window.iosJavascriptLogin = function(a, b, c, d) {
 var e = "js2ios://community_login";
 e = e + "?functionName=" + a;
 console.log("url being invoked:" + e);
 openCustomURLinIFrame(e);
};

window.IOSLoginSucceeded = function(a, b) {
 console.login("IOSloginSucceeded:" + a + ", " + b);
 require([ "actions/sessionActions" ], function(c) {
  c.setUser(a, b);
 });
};

var buildUrl = function(a, b, c) {
 var d = a.indexOf("?") > -1 ? "&" : "?";
 return a + d + b + "=" + c;
};

window.updateLoyaltyStatus = function(UID) {
 var urlPrefix = $("#apiURLprefix").text();
 var loyaltyAPIURL = urlPrefix + "retail/retrieveLoyaltyStatus";
 loyaltyAPIURL = buildUrl(loyaltyAPIURL, 'UID', UID);
 loyaltyAPIURL = buildUrl(loyaltyAPIURL, "serviceAccommodatorId",
   window.saslData.serviceAccommodatorId);
 loyaltyAPIURL = buildUrl(loyaltyAPIURL, "serviceLocationId",
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
};

$(document).ready(function() {
 if ("undefined" !== typeof $("#apiURLprefix").get(0)) {
  var a = localStorage.getItem("cmxUID");
  if ("undefined" !== typeof a && null !== a) {
   window.updateLoyaltyStatus(a);
   window.retrieveCalendar(a);
  } else {
   console.log("1. NO cmxUID, try to create one");
   /*
    * create user
    */
   window.createAnonymousUser();
   console.log("anonymous user created");
  }

  window.attachSharingButtons(); 

 } else {
  console.log("no api url");
 }
 /* SMS share */

});