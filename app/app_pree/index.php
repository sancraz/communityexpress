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
 $server = "communitylive.ws";
}
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


if ($debug) {
echo '$completeURL=' . $completeURL . "</br>";
echo '$serverName=' . $serverName . "</br>";

echo '$server=' . $server . "</br>";
echo '$embedded=' . ($embedded ? 'true' : 'false') . "</br>";
echo '$demo=' . ($demo ? 'true' : 'false') . "</br>";

echo '$UID=' . $UID . "</br>";


return;
}

$errorMessage = NULL;
$appleTouchIcon60URL = NULL;

$isPrivate = FALSE;
$canCreateAnonymousUser = FALSE;


$themeCSS = 'styles.css';

include_once ('pree.php');

?>
