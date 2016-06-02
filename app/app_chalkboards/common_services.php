<?php include 'php/detecturl.php'
?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<?php
		include ('includes/stylesheets.html');
		?>
		<title>Chalkboards-Services</title>
	</head>
	<body data-spy="scroll" data-target=".navbar-fixed-top" >
		<!-- Header start -->
		<?php
		include ('includes/navbar.php');
		?>
		<!-- Header end -->
		<?php
		include ('pages/content_services.php');
		?>
		<?php
		include ('includes/scriptfiles.html');
		?>

		<script type="text/javascript" src="pages_js/content_services.js"></script>
		<?php
			include ('includes/footer.php');
		?>
	</body>
</html>