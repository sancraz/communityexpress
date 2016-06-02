<?php include 'desktop/php/detecturl.php'
?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <?php
include ('desktop/includes/stylesheets.html');
  ?>

  <title>LocalAds by Orinoco</title>
  <?php
include ('desktop/includes/scriptfiles.html');
  ?>
 </head>
 <body data-spy="scroll" data-target=".navbar-fixed-top" >

  <!-- Header start -->
  <?php
include ('desktop/includes/navbar.php');
  ?>
  <!-- Header end -->

  <?php
include ('desktop/pages/localads.php');
  ?>

  <?php
include ('desktop/includes/footer.php');
  ?>
 </body>
</html>