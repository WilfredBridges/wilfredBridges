$(document).ready(function () {
    const map = ''
    // Set Map Layers
lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik', {
    noWrap: true,
    bounds: [
      [-90, -180],
      [90, 180],
    ],
  })
  lyrSatellite = L.tileLayer.provider('Esri.WorldImagery', {
    noWrap: true,
    bounds: [
      [-90, -180],
      [90, 180],
    ],
  })


    function fetchExchangeRates() {
        $.ajax({
            url: 'https://openexchangerates.org/api/latest.json?app_id=0abdd2aba07142dda4e1701b48907917',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                // Populate the modal with exchange rate data
                var rates = data.rates;
                var exchangeRateContent = '<ul>';
                for (var currency in rates) {
                    exchangeRateContent += '<li>' + currency + ': ' + rates[currency] + '</li>';
                }
                exchangeRateContent += '</ul>';
                $('#exchangeRateContent').html(exchangeRateContent);

                // Show the modal
                $('#exchangeRateModal').modal('show');
            },
            error: function () {
                // Handle errors here
                alert('Error fetching exchange rates.');
            }
        });
    }

    // Event handler for opening the exchange rate modal
    $('#showExchangeRateBtn').click(function () {
        fetchExchangeRates();
    });

    // Function to display country info modal
    function displayCountryInfo(countryCode) {
        // Implement AJAX request to fetch country information here
        // Populate modal elements with fetched data (e.g., country name, population, weather)
        // Example: $('#countryName').text(countryName);
        // Show the modal: $('#countryInfoModal').modal("show");
    }

    // Event handler for country selection
    $('#countrySelect').change(function () {
        var selectedCountryCode = $(this).val();
        displayCountryInfo(selectedCountryCode);
    });

    // Detect user's location using navigator.geolocation
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLat = position.coords.latitude;
            var userLng = position.coords.longitude;
            // Update map and display the user's location
            map.setView([userLat, userLng], 6); // Adjust zoom level as needed
            // Highlight the user's country border (You'll need GeoJSON data for this)
            // Example: L.geoJSON(userCountryGeoJSON).addTo(map);
        });
    }
});

// Preloader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});
