<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $user1  = $_POST['user1'];
    $user2 = $_POST['user2'];
    $user3  = $_POST['user3'];

    echo "Received: " . $user1 . ", " . $user2 . ", and " . $user3;
}
?>
