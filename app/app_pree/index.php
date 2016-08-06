<?php
  include_once ('preprocessing.php');
?>
<!DOCTYPE html>
<html lang="en" class="js flexbox flexboxlegacy canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths ui-mobile">
 <head>
  <!-- Title here -->
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
  <?php
    include_once ('pages/footer.php');
  ?>
 </body>
</html>
