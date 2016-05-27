<?php include 'php/detecturl.php'
?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <?php
include ('includes/stylesheets.html');
  ?>
  <title>Chalkboards </title>
<style type="text/css">
     .form-control-feedback
    {
        top:38px !important;
    }
    .form-control{
        color:#fff;
    }
    .help-block
    {
        color: red;
    }
    .validationErrorMessageClass {
        margin-top: -10px;
    }
     </style>
 </head>
 <body data-spy="scroll" data-target=".navbar-fixed-top" >

  <!-- Header start -->
  <?php
include ('includes/navbar.php');
  ?>
  <!-- Header end -->

  <?php
include ('pages/content_index.php');
  ?>

  <?php
include ('includes/footer.php');
  ?>

  <?php
include ('includes/scriptfiles.html');
  ?>
  <script>
	new WOW().init();
  </script>
  <script>
	$.backstretch(["images/bg/bg1.jpg", "images/bg/bg2.jpg", "images/bg/bg3.jpg"], {
		fade : 950,
		duration : 10000
	});

  </script>
  <script>
	$('.counter').counterUp({
		delay : 100,
		time : 2000
	});
  </script>
     <script type="text/javascript" src="/pages_js/content_contactUs.js"></script>
 </body>
</html>