<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once ('parser_api_utility.php');


$completeURL = full_url($_SERVER, true);
$serverName = $_SERVER['SERVER_NAME'];
/* determine the http host */
if (strpos($serverName, 'localhost') !== false) {
$protocol = 'http://';
} else {
$protocol = 'https://';
}
/*is demo=true */
if (validateParams('demo')) {
$demo = TRUE;
} else {
$demo = FALSE;
}

/* is API server specified? */
if (validateParams('server')) {
$server = $_REQUEST['server'];
if (strcmp($server, 'localhost') === 0)
 $server = $server . ':8080';
} else {
if ($demo) {
 $server = "simfel.com";
} else {
 $server = "communitylive.co";
}
}

/* is serviceAccomodatorId specified (only from Portal) */
if (validateParams('serviceAccommodatorId')) {
 $serviceAccommodatorId = $_REQUEST['serviceAccommodatorId'];
} else {
 $serviceAccommodatorId = NULL;
}

if (validateParams('serviceLocationId')) {
 $serviceLocationId = $_REQUEST['serviceLocationId'];
} else {
 $serviceLocationId = NULL;
}


if (validateParams('UID')) {
$UID = $_REQUEST['UID'];
} else {
$UID = NULL;
}

if (validateParams('t')) {
$type = $_REQUEST['t'];
} else {
$type = NULL;
}

if (validateParams('u')) {
$uuidURL = $_REQUEST['u'];
} else {
$uuidURL = NULL;
}

/* NOTE: if debug=true then PHP will echo variables and exit */
if (validateParams('debug')) {
$debug = TRUE;
} else {
$debug = FALSE;
}



$errorMessage = NULL;
$appleTouchIcon60URL = NULL;

$isPrivate = FALSE;
$canCreateAnonymousUser = FALSE;

$apiURL = $protocol . $server . "/apptsvc/rest/pree/retrieveSitelette?UID=&latitude=&longitude=";


if ($debug) {
 echo '$completeURL=' . $completeURL . "</br>";
 echo '$serverName=' . $serverName . "</br>";
 echo '$server=' . $server . "</br>";
 echo '$embedded=' . ($embedded ? 'true' : 'false') . "</br>";
 echo '$demo=' . ($demo ? 'true' : 'false') . "</br>";
 echo '$UID=' . $UID . "</br>";
 echo '$apiURL='.$apiURL."</br>";
 return;
}


$siteletteJSON = makeApiCall($apiURL);

if ($siteletteJSON['curl_error']) {
 $errorMessage = $siteletteJSON['curl_error'];
 $errorMessage = 'Service unavailable.';

 include_once ('pree.php');

} else {
 if (isset($siteletteJSON['error'])) {
  $errorMessage = $siteletteJSON['error']['message'];

  include_once ('pree.php');

 } else {
  $saslJSON = json_decode($siteletteJSON['saslJSON'], TRUE);
  $serviceAccommodatorId = $saslJSON['serviceAccommodatorId'];
  $serviceLocationId = $saslJSON['serviceLocationId'];


  $themeCSS = 'styles.css';

  include_once ('pree.php');
 }
}

?>
