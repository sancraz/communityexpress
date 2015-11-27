<?php

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

include_once ('parser_api_utility.php');

// php_log('starting php');

$completeURL = full_url($_SERVER, true);

// php_log("URL: ".$completeURL);

if (validateParams('demo')) {
 $demo = TRUE;
}
else {
 $demo = FALSE;
}

if (validateParams('server')) {
 $server = $_REQUEST['server'];
 if (strcmp($server, 'localhost') === 0) $server = $server . ':8080';

 // php_log("server was specified:".$server);

}
else {

 // php_log("server was NOT specified");

 if ($demo) {

  // php_log("DEMO was specified");

  $server = "simfel.com";
 }
 else {

  // php_log("DEMO was NOT specified");

  $server = "communitylive.ws";
 }
}

if (validateParams('embedded')) {
 $embedded = TRUE;
}
else {
 $embedded = FALSE;
}

if (validateParams('serviceAccommodatorId')) {
 $serviceAccommodatorId = $_REQUEST['serviceAccommodatorId'];
}
else {
 $serviceAccommodatorId = NULL;
}

if (validateParams('serviceLocationId')) {
 $serviceLocationId = $_REQUEST['serviceLocationId'];
}
else {
 $serviceLocationId = NULL;
}

if (validateParams('friendlyURL')) {
 $friendlyURL = $_REQUEST['friendlyURL'];
}
else {
 $friendlyURL = NULL;
}

if (validateParams('UID')) {
 $UID = $_REQUEST['UID'];
}
else {
 $UID = NULL;
}

if (validateParams('debug')) {
 $debug = TRUE;
}
else {
 $debug = FALSE;
}

if (is_null($friendlyURL) && is_null($serviceLocationId)) {
 $rootrequest = TRUE;
}
else {
 $rootrequest = FALSE;
}

if ($debug) {
 echo '$completeURL=' . $completeURL . "</br>";
 echo '$friendlyURL=' . $friendlyURL . "</br>";
 echo '$server=' . $server . "</br>";
 echo '$embedded=' . ($embedded ? 'true' : 'false') . "</br>";
 echo '$demo=' . ($demo ? 'true' : 'false') . "</br>";
 echo '$serviceAccommodatorId=' . $serviceAccommodatorId . "</br>";
 echo '$serviceLocationId=' . $serviceLocationId . "</br>";
 echo '$rootrequest=' . ($rootrequest ? 'true' : 'false') . "</br>";
 echo '$UID=' . $UID . "</br>";;
 if (!is_null($friendlyURL)) {
  echo '$friendlyURL is ' . $friendlyURL . "</br>";;
 }
 else
 if ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
  echo '$serviceAccommodatorId is ' . $serviceAccommodatorId . ' and $serviceLocationId is ' . $serviceLocationId;
 }
 else {
  echo ' root case ';
 }

 return;
}

$saslName = NULL;
$appleTouchIcon60URL = NULL;

if ($rootrequest) {
 include_once ('../no_sitelette/index.php');

}
else {

 //

 if (((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) || (!is_null($friendlyURL))) {
  if (!is_null($friendlyURL)) {
   $apiURL = "http://" . $server . "/apptsvc/rest/sasl/getSASLByURLkey?UID=&latitude=&longitude=&urlKey=" . $friendlyURL;
  }
  else
  if ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
   $apiURL = "http://" . $server . "/apptsvc/rest/sasl/getSASLBySASL?UID=&latitude=&longitude=&serviceAccommodatorId=" . $serviceAccommodatorId . '&serviceLocationId=' . $serviceLocationId;
  }

  // php_log("API:".$apiURL);

  $saslJSON = makeApiCall($apiURL);

  // check if there was an error.

  if (isset($saslJSON['error'])) {

   // bad url
   // MUST REMOVE THESE CALLS

   $apiURL = "http://" . $server . "/apptsvc/rest/html/retrieveSiteletteHTML" . "?embedded=" . ($embedded ? "true" : "false");

   // php_log("API:".$apiURL);

   $siteletteBodyJSON = makeApiCall($apiURL);
   $siteletteHome = $siteletteBodyJSON['home'];
  }
  else {

   // good url

   $serviceAccommodatorId = $saslJSON['serviceAccommodatorId'];
   $serviceLocationId = $saslJSON['serviceLocationId'];
   $saslName = $saslJSON['saslName'];
   $appleTouchIcon60URL = $saslJSON['appleTouchIcon60URL'];
   $androidHomeScreenIconURL = $saslJSON['androidHomeScreenIconURL'];
   if (is_null($friendlyURL)) {
    if (array_key_exists("anchorURL", $saslJSON)) {
     $anchorURL = $saslJSON['anchorURL'];
     if (array_key_exists("friendlyURL", $anchorURL)) {
      $friendlyURL = $anchorURL['friendlyURL'];
     }
     else {
      $friendlyURL = NULL;
     }
    }
    else $friendlyURL = NULL;
   }

   $apiURL = "http://" . $server . "/apptsvc/rest/html/retrieveSiteletteHTML?themeId=" . $saslJSON['themeId'] . "&serviceAccommodatorId=" . $serviceAccommodatorId . "&serviceLocationId=" . $serviceLocationId . "&embedded=" . ($embedded ? "true" : "false");

   // php_log("API:".$apiURL);

   $siteletteBodyJSON = makeApiCall($apiURL);
   $siteletteHome = $siteletteBodyJSON['home'];
  } // end good url
 }

 include_once ('sitelette.php');

}

?>

