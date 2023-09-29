
// initialise the map
var map = L.map('map').setView([51.505, -0.09], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// user current location
navigator.geolocation.getCurrentPosition(success, error);

function success(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    let userMarker = L.marker([lat, lng]).addTo(map);
    let userCircle = L.circle([lat, lng], { radius: accuracy }).addTo(map);

    map.fitBounds(userCircle.getBounds());
}

function error(err) {
    if (err.code === 1) {
        alert('Please allow geolocation access')
    } else {
        alert('Cannot get current location')
    }
}

// Preloader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});
