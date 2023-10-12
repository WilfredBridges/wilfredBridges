<?php

$apiUsername = $_REQUEST['wilfredbridges'];

if (isset($_POST['lat']) && isset($_POST['lng'])) {
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];
    
    $url = "http://api.geonames.org/timezoneJSON?lat=$lat&lng=$lng&username=$apiUsername";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    curl_close($ch);

    $data = json_decode($result, true);

    if ($data && isset($data['countryName']) && isset($data['time']) && isset($data['gmtOffset'])) {
        $countryName = $data['countryName'];
        $time = $data['time'];
        $timezone = $data['gmtOffset'];
        
        echo json_encode([
            'countryName' => $countryName,
            'time' => $time,
            'gmtOffset' => $timezone
        ]);
    } else {
        echo json_encode(['error' => 'Data not found in the API response']);
    }
} else {
    echo json_encode(['error' => 'Latitude and Longitude not specified']);
}
?>
