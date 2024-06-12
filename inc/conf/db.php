<?php
$server="10.10.100.17";
$user="pranish";
$pw="Pranish@1234";
$db="steem_automation";
$conn = new mysqli($server,$user,$pw,$db);
$conn->set_charset('utf8mb4');
// $BACKENDSERVER  = 'http://127.0.0.1:3001/';
// $FRONTEND = "http://localhost/steemauto/";
$BACKENDSERVER  = 'https://automation.botsteem.com/';
$FRONTEND = "https://automation.botsteem.com/";
?>
