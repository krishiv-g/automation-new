<?php

require_once('inc/dep/func.php');
require_once('inc/conf/db.php');
require_once('inc/dep/login_register.php');
date_default_timezone_set('UTC');

$a = 0;
$active = 1;

// Check if user is logged in
if ($log == 0) {
    echo 'You should login.<script type="text/javascript">window.location.href = "/";</script>';
    header("Location: /");
    exit();
}

// Print the logged-in user's username
echo "<h1>Welcome, " . htmlspecialchars($name) . "!</h1>";

?>
