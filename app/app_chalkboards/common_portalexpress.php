<?php include 'desktop/php/detecturl.php'
?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<?php
		include ('desktop/includes/stylesheets.html');
		?>
		<title>Chalkboards-Portal</title>
	</head>
	<body data-spy="scroll" data-target=".navbar-fixed-top" >
		<!-- Header start -->
		<?php
		include ('desktop/includes/navbar.php');
		?>
		<!-- Header end -->
		<?php
		include ('desktop/pages/content_portalexpress.php');
		?>
		<?php
		include ('desktop/includes/scriptfiles.html');
		?>
		<script type="text/javascript" src="/desktop/pages_js/content_portalexpress.js"></script>
		<?php
		include ('desktop/includes/footer.php');
		?>
	</body>
</html>