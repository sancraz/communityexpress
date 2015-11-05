<!DOCTYPE html>
<html lang="en" class="js flexbox flexboxlegacy canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths ui-mobile">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 
<meta charset="utf-8">

 
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

<!-- Build styles -->
<link rel="stylesheet" href="./build/styles.css">

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

<!-- include all components -->
<?php

echo '<div id=landing><div>';

?>

<script src='./build/bundle.js'></script>


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
if (!is_null($mediaStream)) {
    echo $mediaStream;
}
?>

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

window.updateLoyaltyStatus = function(a) {
    var b = $("#loaltyQRCodeImg").attr("src");
    var c = b.replace("http://sitelettes.com", a);
    c = c.replace("html/getUserQRCode", "retail/retrieveLoyaltyStatus");
    c = buildUrl(c, "serviceAccommodatorId", window.saslData.serviceAccommodatorId);
    c = buildUrl(c, "serviceLocationId", window.saslData.serviceLocationId);
    console.log(c);
    $.get(c, function(a) {
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
    }, "json");
};

window.updateLoyaltyCard = function(a) {
    var b = $("#loaltyQRCodeImg").attr("src");
    b = b.replace("http://sitelettes.com", a);
    $("#loaltyQRCodeImg").attr("src", b);
    $("#loaltyQRCodeImg").fadeIn("slow");
    $("#qrCodePlaceholder").hide();
    console.log("image changed ");
};

$(document).ready(function() {
    if ("undefined" !== typeof $("#loyaltyStatus").get(0)) {
        var a = localStorage.getItem("cmxUID");
        if ("undefined" !== typeof a && null !== a) {
            window.updateLoyaltyCard(a);
            window.updateLoyaltyStatus(a);
        } else console.log("not logged in");
    }
});
</script> 

</body>
</html>