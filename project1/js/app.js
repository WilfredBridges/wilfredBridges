
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

let countryInfoBtn = L.easyButton(
    'fas fa-info',
    function () {
      $('.txtCountry').html($('#selectCountry option:selected').text())
      getCountryInfo()
      $('#modalInfoBox').modal('show')
    },
    'Country Info'
  )
    .setPosition('topleft')
    .addTo(map)


    const loading = $('#loadingDiv').hide()

    function getCountryInfo() {
      $.ajax({
        url: 'php/getCountryInfo.php',
        type: 'POST',
        dataType: 'json',
        data: {
          country: selectCountry.val(),
        },
        beforeSend: () => {
          loading.show()
        },
        complete: () => {
          loading.hide()
        },
        success: function (result) {
          if (result.status.name == 'ok') {
            langArr = []
            Object.values(result.data.languages).forEach(val => langArr.push(val))
    
            function strChop(str) {
              if (str.length > 30) {
                return (str = str.substring(0, 30) + '... ')
              } else return str
            }
    
            $('#flag').attr('src', result.data.flags.png)
            $('#txtRegion').html(result.data.region)
            $('#txtCapital').html(result.data.capital)
            $('#txtLanguages').html(strChop(langArr.join(', ')))
            $('#txtPopulation').html((result.data.population / 1000000).toFixed(1) + ' million')
            $('#txtArea').html(result.data.area.toLocaleString())
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
        },
      })
    }
    
    $('#modalInfoBox').on('hide.bs.modal', function () {
      $('#txtRegion, #txtCapital, #txtLanguages, #txtPopulation, #txtArea').empty()
      $('#flag').attr('src', '')
    })

// Preloader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});
