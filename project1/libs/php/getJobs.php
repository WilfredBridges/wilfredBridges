<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
// $app_id = '36fdd49e';
// $app_key = 'a8b43d5687fd4ded7975594012697ba2';


//$country = $_POST['country'];

$url = "https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=36fdd49e&app_key=a8b43d5687fd4ded7975594012697ba2&results_per_page=50&what_phrase=software%20engineer&category=it-jobs&full_time=1&permanent=1";
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>
