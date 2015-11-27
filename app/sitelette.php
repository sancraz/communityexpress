<!DOCTYPE html>
<html lang="en" class="js flexbox flexboxlegacy canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths ui-mobile">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 
<meta charset="utf-8">
<!-- owlslider  file -->
<link rel="stylesheet" href="styles/owl.carousel.css">
<link rel="stylesheet" href="styles/animate.min.css">
<link href="//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&amp;subset=latin" rel="stylesheet">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
 
<title><?php
if (!is_null($saslName)) {
    echo $saslName;
} else
    echo 'sitelette.com';
?></title>
 

<!-- for IOS web app-->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="viewport"
 content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">


 
<link rel="apple-touch-icon"  href="<?php
if (!is_null($appleTouchIcon60URL)) {
    echo $appleTouchIcon60URL;
} else {
    echo 'someicon';
}
?>"> 
 
<link rel="icon" sizes="192x192" href="<?php
if (!is_null($androidHomeScreenIconURL)) {
    echo $androidHomeScreenIconURL;
    
} else {
    echo 'someicon';
}
?>">

<link rel="stylesheet" href="scripts/bower_components/jquery-mobile-bower/css/jquery.mobile-1.4.5.min.css"/>
<link rel="stylesheet" href="styles/sitelette.css"/>
<link rel="stylesheet" href="styles/sitelette_icons.css"/>
<link rel="stylesheet" href="styles/sitelette_mediastream1.css"/>
<link rel="stylesheet" href="styles/sitelette_mediastream2.css"/>
<link rel="stylesheet" href="vendor/add-to-homescreen/style/addtohomescreen.css"/>

<style>
* {
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    /*-webkit-user-select: none;*/
}

body {
    margin: 0;
}
</style>

</head>



<body class="ui-mobile-viewport ui-overlay-a">


<script>
      window.saslData = <?php
if (!is_null($saslJSON)) {
    echo json_encode($saslJSON);
} else {
    echo '{"error":"null sasl"}';
}
?>; 
      
      
</script>

<?php
if (!is_null($siteletteHome)) {
   echo $siteletteHome;
}
?>

<script  src="build/bundle.js"></script>


<script>
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
    var loyaltyAPIURL =urlPrefix+"retail/retrieveLoyaltyStatus";
        loyaltyAPIURL  = buildUrl(loyaltyAPIURL,'UID',UID);  
    loyaltyAPIURL = buildUrl(loyaltyAPIURL, "serviceAccommodatorId", window.saslData.serviceAccommodatorId);
    loyaltyAPIURL = buildUrl(loyaltyAPIURL, "serviceLocationId", window.saslData.serviceLocationId);
    console.log(loyaltyAPIURL);
    $.get(loyaltyAPIURL, function(a) {
         if (a.hasLoyaltyProgram) {
       
            $("#loyaltyProgramName").text(a.programName);
            $("#loyaltyPrefix").text(a.prefix);
            $("#loyaltyDetails").text(a.details);
            $("#loyaltySuffix").text(a.suffix);
            
         } else {
            $("#loyaltyProgramName").text("(No active loyalty program)");
            $("#loyaltyPrefix").text("");
            $("#loyaltyDetails").text("");
            $("#loyaltySuffix").text("");
          }
        $("#loyaltyStatus").show();
        $("#qrCodePlaceholder").hide();
        $("#qrCodeImage").empty();
         $("#qrCodeImage").prepend('<img id="theQRCodeImage" src='+a.qrcodeURL+' />');
    }, "json");
};

 

$(document).ready(function() {
    if ("undefined" !== typeof $("#apiURLprefix").get(0)) {
        var a = localStorage.getItem("cmxUID");
        if ("undefined" !== typeof a && null !== a) {
            window.updateLoyaltyStatus(a);
         
        } else {
         console.log("not logged in");
        }
    }else{
      console.log("no api url");
    }
});
</script> 
<!-- Include js plugin -->
<script src="scripts/owl.carousel.min.js"></script>

</body>
</html>