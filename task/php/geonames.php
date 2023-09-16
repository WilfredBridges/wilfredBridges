<?php

$apiUsername = 'wilfredbridges';

if (isset($_POST['country'])) {
    $country = $_POST['country'];
    $url = "http://api.geonames.org/neighboursJSON?geonameId=$country&username=$apiUsername";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    curl_close($ch);

    echo $result;
} else {
    echo json_encode(['error' => 'Country not specified']);
}
?>
