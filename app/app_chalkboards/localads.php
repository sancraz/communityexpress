<?php include 'php/detecturl.php'
?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <?php
include ('includes/stylesheets.html');
  ?>

  <title>LocalAds by Orinoco</title>
  <?php
include ('includes/scriptfiles.html');
  ?>
 </head>
 <body data-spy="scroll" data-target=".navbar-fixed-top" >

  <!-- Header start -->
  <?php
include ('includes/navbar.php');
  ?>
  <!-- Header end -->

  <?php
include ('pages/localads.php');
  ?>

  <?php
include ('includes/footer.php');
  ?>
 </body>
</html>