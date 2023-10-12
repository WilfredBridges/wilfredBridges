<?php
$app_id = '0abdd2aba07142dda4e1701b48907917';
$url = "https://openexchangerates.org/api/latest.json?app_id=$app_id";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$data = json_decode($result, true);

if (isset($data['rates'])) {
    $output['status']['code'] = '200';
    $output['status']['name'] = 'ok';
    $output['status']['description'] = 'success';
    $output['rates'] = $data['rates'];
} else {
    $output['status']['code'] = '500';
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Failed to fetch exchange rates.';
}

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
