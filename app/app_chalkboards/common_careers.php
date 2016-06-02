<?php include 'desktop/php/detecturl.php'
?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <?php
include ('desktop/includes/stylesheets.html');
  ?> 
  
    <title>Careers at Orinoco</title>
 
 </head>
 <body data-spy="scroll" data-target=".navbar-fixed-top" >

  <!-- Header start -->
  <?php
include ('desktop/includes/navbar.php');
  ?>
  <!-- Header end -->

  <?php
include ('desktop/pages/content_careers.php');
  ?>
 
   <?php
include ('desktop/includes/footer.php');
  ?>
 </body>
</html>