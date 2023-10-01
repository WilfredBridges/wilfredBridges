// app.js
var osmMap = L.tileLayer.provider('OpenStreetMap.Mapnik');
var imageryMap = L.tileLayer.provider('Esri.WorldImagery');
var darkMap = L.tileLayer.provider('CartoDB.DarkMatter');

var baseMaps = {
    OSM: osmMap,
    'Satellite Map': imageryMap,
    'Dark Map': darkMap
}

// Initialise the map
var map = L.map('map').setView([51.505, -0.09], 5);

var mapLayers = L.control.layers(baseMaps).addTo(map);
osmMap.addTo(map);

// Buttons
let locationBtn = L.easyButton(
  'fa-light fa-location-arrow',
  function () {
    getLocation()
  },
  'Home Country'
)
  .setPosition('topleft')
  .addTo(map)

L.control.scale({ position: 'bottomright', imperial: false }).addTo(map)

// Preloader, Populate Select List, Get Current/Default Location, Apply Initial Border & Markers
let selectCountry = $('#selectCountry')
selectCountry.empty()

$(document).ready(function () {
  // Populate Select List & Order
  $.ajax({
    url: 'php/getSelectList.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.name == 'ok') {
        for (let i = 0; i < result.data.length; i++) {
          selectCountry
            .append(
              $('<option>', {
                value: result.data[i].code,
                text: result.data[i].name,
              })
            )
        }
        // Initialize Select2 after options are added
        selectCountry.select2();

        selectCountry.prepend('<option selected="true" disabled>Choose / Search Country</option>');
        selectCountry.prop('selectedIndex', 0);
      }
      // Get Location, Set Border & Markers
      getLocation = function () {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              $.ajax({
                url: 'php/getCountryCodeA2.php',
                type: 'POST',
                dataType: 'json',
                data: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                success: function (result) {
                  if (result.status.name == 'ok') {
                    currentCode = result.data.countryCode
                    selectCountry.val(currentCode).trigger('change')
                  }
                },
              })
            },
            function () {
              alert('Dev Location Selected')
              selectCountry.val('GB').trigger('change')
            }
          )
        } else {
          console.log('Browser does not support geolocation!')
        }
      }
      getLocation();
    },
  });
});
