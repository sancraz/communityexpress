<?php include_once ('sitefiles/php/detecturl.php')?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <?php
include ('sitefiles/includes/stylesheets.html');
  ?>
  <title>Chalkboards-Signup</title>
 </head>
 <body data-spy="scroll" data-target=".navbar-fixed-top" >
  <!-- Header start -->
  <?php
include ('sitefiles/includes/navbar.php');
  ?>
  <!-- Header end -->
  <?php
include ('sitefiles/pages/content_createadhocbusiness.php');
  ?>
  <?php
include ('sitefiles/includes/scriptfiles.html');
  ?>

  <script type="text/javascript" src="sitefiles/pages_sitefiles/js/content_createadhocbusiness.js"></script>
  <?php
include ('sitefiles/includes/footer.php');
  ?>
 </body>
</html>
