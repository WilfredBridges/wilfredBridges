<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Form data
    $name = $_POST["name"];
    $email = $_POST["email"];
    $guests = $_POST["guests"];
    $attendance = $_POST["attendance"];
    $message = $_POST["message"];

    // Recipient email address
    $to = 'wbridges905@gmail.com'; // Replace with your actual email address

    // Subject
    $subject = 'RSVP Submission';

    // Message body
    $body = "Name: $name\nEmail: $email\nGuests: $guests\nAttendance: $attendance\nMessage: $message";

    // Additional headers
    $headers = "From: $email" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo 'Message has been sent';
    } else {
        echo 'Message could not be sent.';
    }
}
?>
