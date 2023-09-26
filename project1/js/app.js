$(document).ready(function () {
    // Initialize the map
    var map = L.map('map').setView([0, 0], 2); // Centered on (0, 0) with zoom level 2
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

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
