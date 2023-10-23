<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);


try {
    // Server settings
    $mail->SMTPDebug = 0; //SMTP::DEBUG_SERVER; // Enable verbose debug output
    $mail->isSMTP();
    $mail->Host       = 'smtp.sendgrid.net';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'apikey';
    $mail->Password   = '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';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('wbridges905@gmail.com', 'Wilfred');
    $mail->addAddress('wbridges905@gmail.com', 'Wilfred');

    // Content
    $mail->isHTML(true);
    $mail->Subject = $_POST['subject'];

    $emailBody = 'Name: ' . $_POST['name'] . '<br>';
    $emailBody .= 'Email: ' . $_POST['email'] . '<br>';
    $emailBody .= 'Message: ' . nl2br($_POST['message']);

    $mail->Body = $emailBody;

    $mail->send();

    // Echo 'OK' upon successful send
    echo 'OK';
} catch (Exception $e) {
    echo "Message could not be sent.";
}
?>
