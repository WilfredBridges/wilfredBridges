<?php

$apiUsername = $_REQUEST['wilfredbridges'];

if (isset($_POST['geonameId'])) {
    $geonameId = $_POST['geonameId'];
    $url = "http://api.geonames.org/neighboursJSON?formatted=true&geonameId=$geonameId&username=$apiUsername&style=full";

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
