<?php
// Database connection details
$servername = "localhost"; // Your MySQL server name
$username = "u337267359_WilfredB"; // Your MySQL username
$password = "Wbridges905"; // Your MySQL password
$database = "u337267359_rsvp"; // Your MySQL database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Form data
    $name = $_POST["name"];
    $email = $_POST["email"];
    $guests = $_POST["guests"];
    $attendance = $_POST["attendance"];
    $message = $_POST["message"];

    // SQL query to insert data into the rsvp table
    $sql = "INSERT INTO rsvp (name, email, guests, attendance, message) VALUES ('$name', '$email', '$guests', '$attendance', '$message')";

    if ($conn->query($sql) === TRUE) {
        // Send confirmation email
        $to = $email;
        $subject = 'RSVP Confirmation';
        $confirmationMessage = "Thank you for your RSVP, $name! We look forward to seeing you at the wedding.";
        $headers = "From: wbridges905@gmail.com"; // Replace with your email address

        mail($to, $subject, $confirmationMessage, $headers);

       // Return a success response
    echo 'success';
} else {
    // Return an error response
    echo 'error';
}
}

// Close the database connection
$conn->close();
?>
