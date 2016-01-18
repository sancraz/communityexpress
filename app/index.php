<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once ('parser_api_utility.php');

//php_log('starting php');
$completeURL = full_url($_SERVER, true);
//php_log("URL: ".$completeURL);

$serverName = $_SERVER['SERVER_NAME'];

if (strpos($serverName, 'localhost') !== false) {
    $protocol = 'http://';
} else {
    $protocol = 'https://';
}

if (validateParams('demo')) {
    $demo = 'true';
} else {
    $demo = 'false';
}

if (validateParams('desktopiframe')) {
    $desktop = 'true';
} else {
    $desktop = 'false';
}

if (validateParams('server')) {
    $server = $_REQUEST['server'];
    if (strcmp($server, 'localhost') === 0)
        $server = $server . ':8080';
    //php_log("server was specified:".$server);
} else {
    //php_log("server was NOT specified");

    if ($demo) {
        //php_log("DEMO was specified");
        $server = "simfel.com";
    } else {
        //php_log("DEMO was NOT specified");
        $server = "communitylive.ws";
    }
}

if (validateParams('embedded')) {
    $embedded = 'true';
} else {
    $embedded = 'false';
}

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

if (validateParams('debug')) {
    $debug = TRUE;
} else {
    $debug = FALSE;
}

if ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
    $directAccess = 'true';
} else {
    $directAccess = 'false';
}

if (!is_null($friendlyURL)) {
    $publicAccess = 'true';
} else {
    $publicAccess = 'false';
}

if ($debug) {
    echo '$completeURL=' . $completeURL . "</br>";
    echo '$friendlyURL=' . $friendlyURL . "</br>";
    echo '$server=' . $server . "</br>";
    echo '$embedded=' . ($embedded ? 'true' : 'false') . "</br>";
    echo '$demo=' . ($demo ? 'true' : 'false') . "</br>";
    echo '$serviceAccommodatorId=' . $serviceAccommodatorId . "</br>";
    echo '$serviceLocationId=' . $serviceLocationId . "</br>";
     
    echo '$UID=' . $UID . "</br>"; ;

    if (!is_null($friendlyURL)) {
        echo '$friendlyURL is ' . $friendlyURL . "</br>"; ;
    } else if ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
        echo '$serviceAccommodatorId is ' . $serviceAccommodatorId . ' and $serviceLocationId is ' . $serviceLocationId;
    } else {
        echo ' root case ';
    }

    return;
}

$saslName = NULL;
$appleTouchIcon60URL = NULL;

//
$isPrivate ='false';
$canCreateAnonymousUser = 'true';

if ($directAccess || $publicAccess) {
    if ($publicAccess) {
        $apiURL = $protocol . $server . "/apptsvc/rest/sasl/getSASLByURLkey?UID=&latitude=&longitude=&urlKey=" . $friendlyURL;
    } else {
        $apiURL = $protocol . $server . "/apptsvc/rest/sasl/getSASLBySASL?UID=&latitude=&longitude=&serviceAccommodatorId=" . $serviceAccommodatorId . '&serviceLocationId=' . $serviceLocationId;
    }

    // php_log("API:".$apiURL);

    $saslJSON = makeApiCall($apiURL);
    // check if there was an error.
    if (isset($saslJSON['error'])) {
        //bad url
        //TODO MUST REMOVE THESE CALLS
        $apiURL = $protocol . $server . "/apptsvc/rest/html/retrieveSitelette" . "?embedded=" . ($embedded ? "true" : "false");

        // php_log("API:".$apiURL);

        $siteletteJSON = makeApiCall($apiURL);
    } else {
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
                } else {
                    $friendlyURL = NULL;
                }
            } else
                $friendlyURL = NULL;
        }

        $apiURL = $protocol . $server . "/apptsvc/rest/html/retrieveSitelette?themeId=" . $saslJSON['themeId'] . "&serviceAccommodatorId=" . $serviceAccommodatorId . "&serviceLocationId=" . $serviceLocationId . "&embedded=" . ($embedded ? "true" : "false");

        // php_log("API:".$apiURL);

        $siteletteJSON = makeApiCall($apiURL);
    }// end good url

    include_once ('sitelette.php');
} else {
    include_once ('../no_sitelette/index.php');
}
?>