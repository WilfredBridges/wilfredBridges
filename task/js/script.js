$(document).ready(function () {
    // Function to fetch Geoname ID based on country name
    function fetchGeonameId(countryName, callback) {
        $.ajax({
            type: 'POST',
            url: 'get_geoname_id.php',
            data: { country: countryName, wilfredbridges: 'wilfredbridges' },
            success: function (data) {
                console.log(data);
                var geonameData = JSON.parse(data);
                if (geonameData.geonameId) {
                    callback(geonameData.geonameId);
                } else {
                    $('#results').html('Error: GeonameId not found.');
                }
            },
            error: function () {
                $('#results').html('Error fetching GeonameId.');
            }
        });
    }

    // First API call (neighboring countries)
    $('#fetchDataButton').click(function () {
        var countryName = $('#countryInput').val();
        fetchGeonameId(countryName, function (geonameId) {
            fetchNeighbours(geonameId);
        });
    });

    // Second API call (country regions)
    $('#fetchCountryRegionsButton').click(function () {
        var countryName = $('#countryInput2').val();
        fetchGeonameId(countryName, function (geonameId) {
            fetchCountryChildren(geonameId);
        });
    });

    // Third API call (Lattitude & Longitude)
    $('#fetchLatLngButton').click(function () {
        var countryName = $('#countryInput3').val();
        fetchGeonameId(countryName, function (geonameId) {
            fetchLatLng(geonameId);
        });
    });

    function fetchNeighbours(geonameId) {
        // Now, fetch data using the geonameId
        $.ajax({
            type: 'POST',
            url: 'php/geonames.php',
            data: { geonameId: geonameId, wilfredbridges: 'wilfredbridges' },
            success: function (data) {
                console.log(data);
                displayResults(data);
            },
            error: function () {
                $('#results').html('Error fetching data.');
            }
        });
    }

    function fetchCountryChildren(geonameId) {
        // Fetch children (regions) based on the Geoname ID
        $.ajax({
            type: 'POST',
            url: 'php/get_country_children.php',
            data: { geonameId: geonameId, wilfredbridges: 'wilfredbridges' },
            success: function (data) {
                console.log(data);
                displayCountryRegionsResults(data);
            },
            error: function () {
                $('#countryRegionsResults').html('Error fetching data.');
            }
        });
    }

    function fetchLatLng(geonameId) {
        // Fetch LatLng using the geonameId
        $.ajax({
            type: 'POST',
            url: 'php/get_latlng.php',
            data: { geonameId: geonameId, wilfredbridges: 'wilfredbridges' },
            success: function (data) {
                console.log(data);
                displayLatLng(data);
            },
            error: function () {
                $('#results').html('Error fetching data.');
            }
        });
    }

    function displayResults(data) {
        var resultHtml = '';
        var response = JSON.parse(data);

        if (response.totalResultsCount > 0) {
            $.each(response.geonames, function (index, neighbor) {
                resultHtml += '<tr>';
                resultHtml += '<td>' + neighbor.asciiName + '</td>';
                resultHtml += '<td>' + '(' + neighbor.countryName + ')' + '</td>';
                resultHtml += '<td></td>';
                resultHtml += '</tr>';
            });
        } else {
            resultHtml = '<tr><td colspan="3">No data available.</td></tr>';
        }

        $('#results').html(resultHtml);
    }

    function displayCountryRegionsResults(data) {
        var resultHtml = '';
        var response = JSON.parse(data);

        if (response.totalResultsCount > 0) {
            $.each(response.geonames, function (index, region) {
                resultHtml += '<tr>';
                resultHtml += '<td>' + region.toponymName + '</td>';
                resultHtml += '<td>' + region.countryName + '</td>';
                resultHtml += '<td></td>';
                resultHtml += '</tr>';
            });
        } else {
            resultHtml = '<tr><td colspan="3">No data available.</td></tr>';
        }

        $('#countryRegionsResults').html(resultHtml);
    }

    function displayLatLng(data) {
        var resultHtml = '';
        var response = JSON.parse(data);
    
        if (response.lat && response.lng) {
            resultHtml += '<tr><td> Name: ' + response.asciiName + '</td></tr>';
            resultHtml += '<tr><td> Code: ' + response.countryCode + '</td></tr>';
            resultHtml += '<tr><td> Latitude: ' + response.lat + '</td></tr>';
            resultHtml += '<tr><td> Longitude: ' + response.lng + '</td></tr>';
        } else {
            resultHtml = '<tr><td colspan="1">No data available.</td></tr>';
        }
    
        $('#LatLngResult').html(resultHtml);
    }
    
    

    // Preloader
    $(window).on('load', function () {
        if ($('#preloader').length) {
            $('#preloader').delay(1000).fadeOut('slow', function () {
                $(this).remove();
            });
        }
    });
});
