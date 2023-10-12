<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='https://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$_POST['lonMin'].'&lat_min='.$_POST['latMin'].'&lon_max='.$_POST['lonMax'].'&lat_max='.$_POST['latMax'].'&kinds=other_hotels&limit=30&format=geojson&apikey=5ae2e3f221c38a28845f05b6b5f94691f7821ed68912043642e2a939'; 

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);
