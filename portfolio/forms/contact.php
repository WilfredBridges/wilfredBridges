<?php

$to = 'wbridges905@gmail.com';
$subject = $_POST['subject'];
$message = 'Name: ' . $_POST['name'] . "\r\n";
$message .= 'Email: ' . $_POST['email'] . "\r\n";
$message .= 'Message: ' . nl2br($_POST['message']);

$headers = 'From: wbridges905@gmail.com' . "\r\n" .
    'Reply-To: wbridges905@gmail.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

if (mail($to, $subject, $message, $headers)) {
    echo 'OK';
} else {
    echo 'Error: Unable to send email';
}
?>