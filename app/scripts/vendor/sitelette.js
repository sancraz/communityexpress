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

$(document).ready(
  function() {
   if ("undefined" !== typeof $("#apiURLprefix").get(0)) {
    var a = localStorage.getItem("cmxUID");
    if ("undefined" !== typeof a && null !== a) {
     window.updateLoyaltyStatus(a);

    } else {
     console.log("not logged in");
    }

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
       smsURL = buildUrl(smsURL, "toTelephoneNumber",
         $('#sms_input').val());
       
       $("#sms_input_block").slideUp('1000');
       $('#sms_sendResults').slideDown('1000').html(
         "Sending message...");
      
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
        $('#sms_sendResults') .slideDown('1000').html(
          jqXHR.explanation);
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
        $('#sms_sendResults').slideDown('1000').html(
          errorMessage);
        ;
       });
       request.always(function() {
        setTimeout(function() {
         $('#sms_sendResults').slideUp('1000');
        }, 4000);
       });
      });

    $('.phone_us').mask('(000) 000-0000');

   } else {
    console.log("no api url");
   }
   /* SMS share */

  });