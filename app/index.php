<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once ('Mobile_Detect.php');
include_once ('parser_api_utility.php');


/* is this for chalkboards?  */
 if (validateParams('tileViewDetails')) {
   $tileViewDetails = $_REQUEST['tileViewDetails']; 
 } else {
   $tileViewDetails = FALSE;
 } 
 
 
 
/*
 * TODO remove this when app start sending the
 * query parameter. 
 * 
 * HACK ALERT: FORCING CHALKBOARDS for now
 */
 $tileViewDetails = TRUE;
 /*
  * END HACK ALERT
  */

  
  
$detect = new Mobile_Detect;
/* is desktopiframe=true
 *
 * if this is true, we load normally even when we detect
 * desktop. This means the iframe src will not try to load
 * the desktop wrapper and thus prevent a re-entrant loop*/
if (validateParams('desktopiframe')) {
 $desktopIFrame = TRUE;
} else {
 $desktopIFrame = FALSE;
}

// not mobile or tablet and not already in the iframe  
if ((!$detect -> isMobile() || $detect -> isTablet()) && !$desktopIFrame) {

 include_once ('desktop/index.php');

} else {

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

 /* is IOS embedded specified?*/
 if (validateParams('embedded')) {
  $embedded = TRUE;
 } else {
  $embedded = FALSE;
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

 if (validateParams('friendlyURL')) {
  $friendlyURL = $_REQUEST['friendlyURL'];
 } else {
  $friendlyURL = NULL;
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

 if ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
  $directAccess = TRUE;
 } else {
  $directAccess = FALSE;
 }

 if (!is_null($friendlyURL)) {
  $publicAccess = TRUE;
 } else {
  $publicAccess = FALSE;
 }

 if ($debug) {
  echo '$completeURL=' . $completeURL . "</br>";
  echo '$friendlyURL=' . $friendlyURL . "</br>";
  echo '$server=' . $server . "</br>";
  echo '$embedded=' . ($embedded ? 'true' : 'false') . "</br>";
  echo '$demo=' . ($demo ? 'true' : 'false') . "</br>";
  echo '$serviceAccommodatorId=' . $serviceAccommodatorId . "</br>";
  echo '$serviceLocationId=' . $serviceLocationId . "</br>";

  echo '$UID=' . $UID . "</br>";
  echo '$directAccess=' . $directAccess . "</br>";
  echo '$publicAccess=' . $publicAccess . "</br>";
  echo '$desktopIFrame=' . $desktopIFrame . "</br>";
  if (!is_null($friendlyURL)) {
   echo '$friendlyURL is ' . $friendlyURL . "</br>";
   ;
  } else if ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
   echo '$serviceAccommodatorId is ' . $serviceAccommodatorId . ' and $serviceLocationId is ' . $serviceLocationId;
  } else {
   echo ' root case ';
  }

  return;
 }
 
 
 $errorMessage = NULL;
 $saslName = NULL;
 $appleTouchIcon60URL = NULL;

 $isPrivate = FALSE;
 $canCreateAnonymousUser = TRUE;

 if ($directAccess || $publicAccess) {
  if ($publicAccess) {
   $apiURL = $protocol . $server . "/apptsvc/rest/html/retrieveSiteletteByURLkey?UID=&latitude=&longitude=&urlKey=" . $friendlyURL.'&tileViewDetails='.($tileViewDetails ? 'true' : 'false');
  } else {
   $apiURL = $protocol . $server . "/apptsvc/rest/html/retrieveSiteletteBySASL?UID=&latitude=&longitude=&serviceAccommodatorId=" . $serviceAccommodatorId . '&serviceLocationId=' . $serviceLocationId.'&tileViewDetails='.($tileViewDetails ? 'true' : 'false');
  }

  $siteletteJSON = makeApiCall($apiURL);

  if ($siteletteJSON['curl_error']) {
   $errorMessage = $siteletteJSON['curl_error'];
   $errorMessage = 'Service unavailable.';
   include_once ('error_page/index.php');
  } else {
   if (isset($siteletteJSON['error'])) {
    $errorMessage = $siteletteJSON['error']['message'];

    include_once ('error_page/index.php');
   } else {

    $saslJSON = json_decode($siteletteJSON['saslJSON'], TRUE);
    //
    $themeId = $saslJSON['themeId'];
    $domain = $saslJSON['domainEnum'];
    $themeCSS = 'styles.css';

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
      } else {
       $friendlyURL = NULL;
      }
     } else
      $friendlyURL = NULL;
    }


    if($tileViewDetails){
      include_once ('chalkboards.php');
    }else{
      include_once ('sitelette.php');
    }



   }/*end valid sitelette*/
  }/*end can reach server */
 } else {
  
  /* 
   * neither direct access or public access. 
   * URL nor sa,sl provided 
   */
  include_once ('no_sitelette/index.php');
 }/* end no url supplied*/
}
?>