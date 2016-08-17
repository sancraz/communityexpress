<?php
  include_once ('preprocessing.php');
?>
<!DOCTYPE html>
<html lang="en" class="js flexbox flexboxlegacy canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths ui-mobile">
 <head>
   <script>
      window.community={};
      window.community.protocol='<?php echo $protocol?>';
      window.community.UID='<?php echo $UID ?>';
      window.community.type='<?php echo $type ?>';
      window.community.uuidURL='<?php echo $uuidURL ?>';
      window.community.demo='<?php echo  $demo==TRUE?'true':'false'?>';
      window.community.server='<?php echo $server ?>';
      window.community.host='<?php echo $serverName ?>';
      window.community.serviceAccommodatorId='<?php echo $serviceAccommodatorId ?>';
      window.community.serviceLocationId='<?php echo $serviceLocationId ?>';
      window.community.canCreateAnonymousUser=<?php echo  $canCreateAnonymousUser==TRUE?'true':'false'?>;
      window.community.sharedPree=<?php echo $sharedPree==TRUE?'true':'false'?>;
      window.community.shareId='<?php echo $shareId ?>';
   </script>


 <!-- og meta tags -->
<meta property="og:type"               content="article" />
<meta property="og:title"              content="<?PHP echo $og_title?>"/>
<meta property="og:description"        content="<?PHP echo $og_description?>"/>
<meta property="og:image"              content="<?PHP echo $og_image?>"/>

 <!-- twitter meta tags -->
<meta name="twitter:card"              content="<?PHP echo $twitter_card?>"/>
<meta name="twitter:site"              content="<?PHP echo $twitter_site?>"/>
<meta name="twitter:creator"           content="@Pree"/>
<meta name="twitter:title"             content="<?PHP echo $twitter_title?>"/>
<meta name="twitter:description"       content="<?PHP echo $twitter_description?>"/>
<meta name="twitter:image"             content="<?PHP echo $twitter_image?>"/>


 <title>Pree - Home</title>
 <?php
     include_once ('pages/header.php');
 ?>

 <!-- TODO
     Add og tags here using PHP  if preprocessing detected that this is s share -->

 </head>

 <body>
  <?php
    include_once ('pages/navbar.php');
  ?>
 <?php
    include_once ('pages/index_content.php');
  ?>
  <!--
  <?php
    include_once ('pages/footer.php');
  ?>
-->
 </body>
</html>
