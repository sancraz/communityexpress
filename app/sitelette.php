<!DOCTYPE html>
<html lang="en" class="js flexbox flexboxlegacy canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths ui-mobile">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 
<meta charset="utf-8">
<!-- owlslider  file -->
<link rel="stylesheet" href="styles/owl.carousel.css">
<link rel="stylesheet" href="styles/animate.min.css">
<link rel="stylesheet" href="vendor/jqplot/jquery.jqplot.min.css">
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

html,body{margin:0;height:100%}#cmtyx_header{font-family:arial;color:#FFF;text-align:center;background-color:blue;width:100%;height:40px}#cmtyx_navbar{font-family:arial;color:#FFF;text-align:center;background-color:green;width:100%;height:40px}#cmtyx_landingView{font-family:arial;color:#FFF;text-align:center;background-color:red;width:100%;min-height:100%;height:auto !important;height:100%;margin:0 auto -60px}
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
if (!is_null($siteletteJSON)) {
   echo $siteletteJSON['headerDiv'];
   echo $siteletteJSON['navBarDiv'];  
   echo $siteletteJSON['landingViewDiv'];
}
?>

<script  src="build/bundle.js"></script>
<script src="scripts/owl.carousel.min.js"></script>

 
<!-- Include js plugins -->
<script src="vendor/jquery-migrate-1.2.1.min.js"></script>
<script src="scripts/owl.carousel.min.js"></script>
<script src="vendor/jqplot/jquery.jqplot.js"></script>
<script src="vendor/jqplot/plugins/jqplot.barRenderer.min.js"></script>
<script src="vendor/jqplot/plugins/jqplot.categoryAxisRenderer.min.js"></script>
<script src="vendor/jqplot/plugins/jqplot.pointLabels.min.js"></script> 
<script src="vendor/jquery.mask.js"></script>
<!-- <script src="scripts/sitelette.js"></script>  -->
</body>
</html>