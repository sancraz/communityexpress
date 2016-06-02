<?php include 'desktop/php/detecturl.php'
?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <?php
include ('desktop/includes/stylesheets.html');
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
include ('desktop/includes/navbar.php');
  ?>
  <!-- Header end -->

  <?php
include ('desktop/pages/content_index.php');
  ?>

  <?php
include ('desktop/includes/footer.php');
  ?>

  <?php
include ('desktop/includes/scriptfiles.html');
  ?>
  <script>
	new WOW().init();
  </script>
  <script>
	$.backstretch(["desktop/images/bg/bg1.jpg", "desktop/images/bg/bg2.jpg", "desktop/images/bg/bg3.jpg"], {
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
     <script type="text/javascript" src="desktop/pages_js/content_contactUs.js"></script>
 </body>
</html>