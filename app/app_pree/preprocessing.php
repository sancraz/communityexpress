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

/*is demo=true */
if (validateParams('embedded')) {
$embedded= TRUE;
} else {
$embedded = FALSE;
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

if (validateParams('shareId')) {
  $shareId = $_REQUEST['shareId'];
} else {
  $shareId = NULL;
}

if($type==='l'){
  $sharedPree=TRUE;
}else {
  $sharedPree=FALSE;
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

$siteletteJSON = makeApiCall($apiURL);
if ($siteletteJSON['curl_error']) {
 $errorMessage = $siteletteJSON['curl_error'];
 $errorMessage = 'Service unavailable.';
} else {
 if (isset($siteletteJSON['error'])) {
  $errorMessage = $siteletteJSON['error']['message'];
 } else {
  $saslJSON = json_decode($siteletteJSON['saslJSON'], TRUE);
  $serviceAccommodatorId = $saslJSON['serviceAccommodatorId'];
  $serviceLocationId = $saslJSON['serviceLocationId'];
  $themeCSS = 'styles.css';
  /* PREE specific: sharing related meta data */
  $og_url=$completeURL;
  $og_type="article";
  $og_title="Where Great Minds Don't Think Alike";
  $og_description="Test your knowledge. Share with friends. Learn while having fun.";
  $og_image=$protocol.$server."/apptsvc/rest/media/retrieveStaticMedia/pree/default.jpg";

  if( $sharedPree ){
    /* pull up the question and prepare the meta data */

    $apiURL = $protocol . $server . "/apptsvc/rest/pree/retrieveQuestion?contestUUID=".$uuidURL;
    $questionJSON = makeApiCall($apiURL);
    if ($questionJSON['curl_error']) {
     $errorMessage = $siteletteJSON['curl_error'];
     $errorMessage = 'Service unavailable.';
    } else if (isset($questionJSON['error'])) {
      $errorMessage = $questionJSON['error']['message'];
    } else {
      /* change meta data based on question */
      $og_url=$completeURL;
      $og_type="article";
      $og_title=$questionJSON['ogTitle'];
      $og_description=$questionJSON['ogDescription'];
      $og_image =$questionJSON['ogImage'];

    }
  }
 }
}

if ($debug) {
 echo '$completeURL=' . $completeURL . "</br>";
 echo '$serverName=' . $serverName . "</br>";
 echo '$server=' . $server . "</br>";
 echo '$embedded=' . ($embedded ? 'true' : 'false') . "</br>";
 echo '$demo=' . ($demo ? 'true' : 'false') . "</br>";
 echo '$UID=' . $UID . "</br>";
 echo '$apiURL='.$apiURL."</br>";
 echo '$type='.$type."</br>";
 echo '$uuidURL='.$uuidURL."</br>";
 echo '$sharedPree='.$sharedPree."</br>";
 echo '$shareId='.$shareId.'</br>';
 if($errorMessage){
   echo '$errorMessage='.$errorMessage.'</br>';
 }else{
   echo '$og_url='.$og_url.'</br>';
   echo '$og_type='.$og_type.'</br>';
   echo '$og_title='.$og_title.'</br>';
   echo '$og_description='.$og_description.'</br>';
   echo '$og_image='.$og_image.'</br>';
 }
 exit("End of debug output");
}

?>
<script>
   window.community={};
   window.community.protocol='<?php echo $protocol?>';
   window.community.UID='<?php echo $UID ?>';
   window.community.type='<?php echo $type ?>';
   window.community.uuidURL='<?php echo $uuidURL ?>';
   window.community.demo='<?php echo  $demo==TRUE?'true':'false'?>';
   window.community.server='<?php echo $server ?>';
   window.community.host='<?php echo $serverName ?>';
   window.community.serviceAccommodatorId='<?php echo $serviceAccommodatorId ?>';
   window.community.serviceLocationId='<?php echo $serviceLocationId ?>';
   window.community.canCreateAnonymousUser=<?php echo  $canCreateAnonymousUser==TRUE?'true':'false'?>;
   window.community.sharedPree=<?php echo $sharedPree==TRUE?'true':'false'?>;
   window.community.shareId='<?php echo $shareId ?>';
</script>
