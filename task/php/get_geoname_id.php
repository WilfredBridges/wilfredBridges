<?php

$apiUsername = $_REQUEST['wilfredbridges'];

if (isset($_POST['country'])) {
    $country = $_POST['country'];
    $url = "http://api.geonames.org/searchJSON?q=$country&maxRows=1&username=$apiUsername";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    curl_close($ch);

    $data = json_decode($result, true);

    if ($data && isset($data['geonames'][0]['geonameId'])) {
        $geonameId = $data['geonames'][0]['geonameId'];
        echo json_encode(['geonameId' => $geonameId]);
    } else {
        echo json_encode(['error' => 'GeonameId not found']);
    }
} else {
    echo json_encode(['error' => 'Country not specified']);
}
?>
