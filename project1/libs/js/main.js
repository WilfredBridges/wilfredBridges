// Variables




var ctlPan
var objOverlays

let border
let webcams
let earthquakes
let cities
let hotels
let fuel

let tempFuel = null
let tempHotels = null
let tempCities = null
let tempEarthquakes = null
let tempWebcams = null

// Set Map Layers
let lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik', {
  noWrap: true,
  bounds: [
    [-90, -180],
    [90, 180],
  ],
})
let lyrSatellite = L.tileLayer.provider('Esri.WorldImagery', {
  noWrap: true,
  bounds: [
    [-90, -180],
    [90, 180],
  ],
})

let lyrDark = L.tileLayer.provider('CartoDB.DarkMatter', {
  noWrap: true,
  bounds: [
    [-90, -180],
    [90, 180],
  ],
})

let overlays = L.markerClusterGroup()

objBasemaps = {
  "<span style=''>Streets</span>": lyrOSM,
  "<span style=''>Satellite</span>": lyrSatellite,
  "<span style=''>Dark Map</span>": lyrDark
}

const overlayMaps = {
  "All Markers<hr style='margin:0.5em 0'>": overlays,
}

// initialize the map on the "map" div with a given center and zoom
let map = L.map('map', {
  center: [51, 0],
  zoom: 2,
  minZoom: 2,
  zoomControl: false,
  zoomsliderControl: false,
  layers: [lyrOSM, overlays],
})

// Display Zoom, Location and Layer Buttons

L.control
  .zoomslider({
    position: 'topright',
  })
  .addTo(map)

let layerControl = L.control.layers(objBasemaps, overlayMaps).addTo(map)
layerControl.setPosition('topright');

let locationBtn = L.easyButton(
  'fa-light fa-home',
  function () {
    getLocation()
  },
  'Home Country'
)
  .setPosition('topleft')
  .addTo(map)

L.control.scale({ position: 'bottomright', imperial: false }).addTo(map)

// Buttons

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

let weatherBtn = L.easyButton(
  'fas fa-cloud-sun',
  function () {
    $('#resetWeather').trigger('click')
    $('#modalWeatherBox').modal('show')
  },
  'Weather Info'
).addTo(map)

let wikiInfoBtn = L.easyButton(
  'fab fa-wikipedia-w',
  function () {
    getWikiInfo()
    $('#modalWikiBox').modal('show')
  },
  'Wikipedia'
).addTo(map)

var exchangeRateButton = L.easyButton({
  states: [
      {
          icon: 'fas fa-dollar-sign',
          title: 'Exchange Rate',
          onClick: function (control) {
              // Open the Exchange Rate modal when the button is clicked
              $('#modalExchangeRateBox').modal('show');
          },
      },
  ],
});
exchangeRateButton.addTo(map);


// Preloader, Populate Select List, Get Current/Default Location, Apply Initial Border & Markers

let selectCountry = $('#selectCountry')
selectCountry.empty()

$(window).on('load', function () {
  // Display Preloader

  $('#preloader')
    .delay(1000)
    .fadeOut('slow', function () {
      $(this).remove()
    })

  // Populate Select List & Order

  $.ajax({
    url: 'libs/php/getSelectList.php',
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
            .select2()
        }
        selectCountry.prepend('<option selected="true" disabled>Choose / Search Country</option>')
        selectCountry.prop('selectedIndex', 0)
      }

      // Get Location, Set Border & Markers

      getLocation = function () {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              $.ajax({
                url: 'libs/php/getCountryCodeA2.php',
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
      getLocation()
    },
  })
})

// Add Selected Country Border To Map

function countryBorder() {
  $.ajax({
    url: 'libs/php/getCountryBorders.php',
    type: 'POST',
    dataType: 'json',
    data: {
      country: selectCountry.val(),
    },
    success: function (result) {
      if (result.status.name == 'ok') {
        function setColor() {
          let myStyle = {
            fillColor: '',
            weight: 4,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.4,
          }

          if (map.hasLayer(lyrOSM)) {
            myStyle.fillColor = 'blue'
          } else {
            myStyle.fillColor = 'lightgray',
            myStyle.color = 'white'
          }
          return myStyle
        }

        function setBorder() {
          border = L.geoJSON(result.data[0].borders, {
            style: setColor(),
          }).addTo(map)
          map.fitBounds(border.getBounds())
        }

        if (border === undefined) {
          setBorder()
        } else {
          map.removeLayer(border)
          setBorder()
        }
      }
    },
  })
}

// Add Selected Country Markers To Map

function getOverlays() {
  overlays.clearLayers()

  if (tempEarthquakes || tempWebcams || tempCities) {
    setTimeout(() => {
      tempWebcams.removeFrom(layerControl).clearLayers()
      tempCities.removeFrom(layerControl).clearLayers()
      tempEarthquakes.removeFrom(layerControl).clearLayers()
      tempFuel.removeFrom(layerControl).clearLayers()
      tempHotels.removeFrom(layerControl).clearLayers()
    }, 30)
  }

  // Get Bounding Box

  $.ajax({
    url: 'libs/php/getBoundingBox.php',
    type: 'POST',
    dataType: 'json',
    data: {
      country: selectCountry.val(),
    },
    beforeSend: () => {
      loading.show()
    },
    success: function (result) {
      if (result.status.name == 'ok') {
        north = result.data[0].north
        south = result.data[0].south
        east = result.data[0].east
        west = result.data[0].west

        lonMin = west > east ? east : west
        latMin = south > north ? north : south
        lonMax = east > west ? east : west
        latMax = north > south ? north : south
      }

      console.log('----- Console log DATA -----')

      // Get Webcams Markers

      $.ajax({
        url: 'libs/php/getWebcams.php',
        type: 'GET',
        dataType: 'json',
        data: {
          country: selectCountry.val(),
        },
        complete: () => {
          loading.hide()
        },
        success: function (result) {
          if (result.status.name == 'ok') {
            console.log(result)
            let outputdata = []

            for (let i = 0; i < result.data.length; i++) {
              lat = result.data[i].location.latitude
              lng = result.data[i].location.longitude
              city = result.data[i].location.city
              webcam = result.data[i].player.day.embed

              let camIcon = L.ExtraMarkers.icon({
                icon: 'fas fa-camera fa-2x',
                markerColor: 'red',
                shape: 'square',
                tooltipAnchor: [2, -35],
                popupAnchor: [0, -35],
              })

              webcams = L.marker([lat, lng], { icon: camIcon })

              webcams
                .bindTooltip('<b>' + city + '</b><br>' + '(' + lat.toFixed(4) + ', ' + lng.toFixed(4) + ')', {
                  direction: 'top',
                  className: 'custom-tooltip',
                })
                .openTooltip()

              webcams.bindPopup(
                '<b>' +
                  city +
                  '</b><br>' +
                  '(' +
                  lat.toFixed(4) +
                  ', ' +
                  lng.toFixed(4) +
                  ')<hr class="m-2">' +
                  `<div class="webcam"><iframe title="${city} webcam" src=${webcam}></iframe><div>`,
                { className: 'custom-windy-popup' }
              )

              overlays.addLayer(webcams)

              outputdata.push(webcams)
            }
            tempWebcams = L.layerGroup(outputdata)
            layerControl.addOverlay(tempWebcams, 'Webcams')
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
        },
      })

      // Get Earthquake Markers

      $.ajax({
        url: 'libs/php/getEarthquakes.php',
        type: 'POST',
        dataType: 'json',
        data: {
          north: north,
          south: south,
          east: east,
          west: west,
        },
        success: function (result) {
          if (result.status.name == 'ok') {
            console.log(result)
            let outputdata = []

            if (result.data.length > 0) {
              for (let i = 0; i < result.data.length; i++) {
                lat = result.data[i].lat
                lng = result.data[i].lng
                mag = result.data[i].magnitude
                depth = result.data[i].depth
                datetime = Date.parse(result.data[i].datetime).toString('MMMM dS, yyyy')

                let earthquakeIcon = L.ExtraMarkers.icon({
                  icon: 'fas fa-exclamation-triangle fa-2x',
                  markerColor: 'yellow',
                  iconColor: 'black',
                  shape: 'red',
                  tooltipAnchor: [2, -37],
                  popupAnchor: [0, -35],
                })

                earthquakes = L.marker([lat, lng], { icon: earthquakeIcon })

                earthquakes
                  .bindTooltip('<b>Earthquake</b><br>' + '(' + lat.toFixed(4) + ', ' + lng.toFixed(4) + ')', {
                    direction: 'top',
                    className: 'custom-tooltip',
                  })
                  .openTooltip()

                earthquakes.bindPopup(
                  '<b>Earthquake</b><br>' +
                    '(' +
                    lat.toFixed(4) +
                    ', ' +
                    lng.toFixed(4) +
                    ')<hr class="m-2">' +
                    datetime +
                    '<br>Magnitude: ' +
                    mag +
                    '<br>Depth: ' +
                    depth,
                  { className: 'custom-popup' }
                )

                overlays.addLayer(earthquakes)
                outputdata.push(earthquakes)
              }
              tempEarthquakes = L.layerGroup(outputdata)
              layerControl.addOverlay(tempEarthquakes, 'Earthquakes')
            } else {
              console.log('No earthquakes found in this countries bounding box')
            }
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
        },
      })

      // Get City Markers

      $.ajax({
        url: 'libs/php/getCities.php',
        type: 'POST',
        dataType: 'json',
        data: {
          north: north,
          south: south,
          east: east,
          west: west,
        },

        success: function (result) {
          if (result.status.name == 'ok') {
            console.log(result)
            let outputdata = []
            if (result.data.hasOwnProperty('geonames')) {
              for (let i = 0; i < result.data.geonames.length; i++) {
                lat = result.data.geonames[i].lat
                lng = result.data.geonames[i].lng
                if (result.data.geonames[i].hasOwnProperty('population')) {
                  pop = result.data.geonames[i].population.toLocaleString()
                } else pop = 'N/A'
                wiki = result.data.geonames[i].wikipedia

                let citiesIcon = L.ExtraMarkers.icon({
                  icon: 'fas fa-star',
                  markerColor: 'white',
                  iconColor: 'black',
                  shape: 'square',
                  tooltipAnchor: [2, -35],
                  popupAnchor: [0, -35],
                })

                cities = L.marker([lat, lng], { icon: citiesIcon })

                cities
                  .bindTooltip('<b>' + result.data.geonames[i].name + '</b><br>' + '(' + lat.toFixed(4) + ', ' + lng.toFixed(4) + ')', {
                    direction: 'top',
                    className: 'custom-tooltip',
                  })
                  .openTooltip()

                cities.bindPopup(
                  '<b>' +
                    result.data.geonames[i].name +
                    '</b><br>' +
                    '(' +
                    lat.toFixed(4) +
                    ', ' +
                    lng.toFixed(4) +
                    ')<hr class="m-2">' +
                    'Population: ' +
                    pop +
                    '<br>' +
                    `<a target="_blank" style="color:white; text-decoration:none;" href="//${wiki}">Click For More</a>`,
                  { className: 'custom-popup' }
                )

                overlays.addLayer(cities)
                outputdata.push(cities)

                if (i > 28) break
              }
              tempCities = L.layerGroup(outputdata)
              layerControl.addOverlay(tempCities, 'Cities')
            } else {
              console.log(result.data.status)
            }
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
        },
      })

      // Get Hotel Markers

      $.ajax({
        url: 'libs/php/getHotels.php',
        type: 'POST',
        dataType: 'json',
        data: {
          latMax: latMax,
          latMin: latMin,
          lonMax: lonMax,
          lonMin: lonMin,
        },
        success: function (result) {
          let outputdata = []
          if (result.status.name == 'ok') {
            console.log(result)

            function onEachFeature(feature, layer) {
              function titleCase(str) {
                var splitStr = str.toLowerCase().split(' ')
                for (var i = 0; i < splitStr.length; i++) {
                  splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
                }
                return splitStr.join(' ')
              }

              function clickForMore() {
                if (feature.properties.hasOwnProperty('wikidata')) {
                  return `//wikidata.org/wiki/${feature.properties.wikidata}`
                } else {
                  googleSearch =
                    '//google.com/search?q=' +
                    feature.properties.name.replace(/ /g, '%20') +
                    '%20' +
                    $('#selectCountry option:selected').text().replace(/ /g, '%20')
                  return googleSearch
                }
              }

              layer.bindTooltip(
                '<b>Hotel</b><br>' +
                  '(' +
                  feature.geometry.coordinates[1].toFixed(4) +
                  ', ' +
                  feature.geometry.coordinates[0].toFixed(4) +
                  ')',
                { direction: 'top', className: 'custom-tooltip' }
              )

              layer.bindPopup(
                '<b>' +
                  titleCase(feature.properties.name) +
                  '</b><br>' +
                  '(' +
                  feature.geometry.coordinates[1].toFixed(4) +
                  ', ' +
                  feature.geometry.coordinates[0].toFixed(4) +
                  ')<hr class="m-2">' +
                  `<a target="_blank" style="color:white; text-decoration:none;" href=${clickForMore()}>Click For More</a>`,
                { className: 'custom-popup' }
              )
            }

            let hotelIcon = L.ExtraMarkers.icon({
              icon: 'fas fa-bed',
              markerColor: 'green',
              shape: 'square',
              tooltipAnchor: [1, -37],
              popupAnchor: [1, -35],
            })

            hotels = L.geoJSON(result.data, {
              onEachFeature: onEachFeature,
              pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: hotelIcon })
              },
            })

            overlays.addLayer(hotels)
            outputdata.push(hotels)
          }
          tempHotels = L.layerGroup(outputdata)
          layerControl.addOverlay(tempHotels, 'Hotels')
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
        },
      })

      // Get Fuel Markers

      $.ajax({
        url: 'libs/php/getFuel.php',
        type: 'POST',
        dataType: 'json',
        data: {
          latMax: latMax,
          latMin: latMin,
          lonMax: lonMax,
          lonMin: lonMin,
        },
        success: function (result) {
          let outputdata = []
          if (result.status.name == 'ok') {
            console.log(result)

            function onEachFeature(feature, layer) {
              function name() {
                if (feature.properties.name === '') {
                  return 'Fuel'
                } else return feature.properties.name
              }

              function titleCase(str) {
                var splitStr = str.toLowerCase().split(' ')
                for (var i = 0; i < splitStr.length; i++) {
                  splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
                }
                return splitStr.join(' ')
              }

              function clickForMore() {
                if (feature.properties.hasOwnProperty('wikidata')) {
                  return `//wikidata.org/wiki/${feature.properties.wikidata}`
                } else {
                  googleSearch =
                    '//google.com/search?q=' +
                    feature.properties.name.replace(/ /g, '%20') +
                    '%20fuel%20' +
                    $('#selectCountry option:selected').text().replace(/ /g, '%20')
                  return googleSearch
                }
              }

              layer.bindTooltip(
                '<b>Fuel</b><br>' +
                  '(' +
                  feature.geometry.coordinates[1].toFixed(4) +
                  ', ' +
                  feature.geometry.coordinates[0].toFixed(4) +
                  ')',
                { direction: 'top', className: 'custom-tooltip' }
              )

              layer.bindPopup(
                '<b>' +
                  titleCase(name(feature.properties.name)) +
                  '</b><br>' +
                  '(' +
                  feature.geometry.coordinates[1].toFixed(4) +
                  ', ' +
                  feature.geometry.coordinates[0].toFixed(4) +
                  ')<hr class="m-2">' +
                  `<a target="_blank" style="color:white; text-decoration:none;" href=${clickForMore()}>Click For More</a>`,
                { className: 'custom-popup' }
              )
            }

            let fuelIcon = L.ExtraMarkers.icon({
              icon: 'fas fa-gas-pump',
              markerColor: 'blue',
              shape: 'square',
              tooltipAnchor: [1, -37],
              popupAnchor: [1, -35],
            })

            fuel = L.geoJSON(result.data, {
              onEachFeature: onEachFeature,
              pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: fuelIcon })
              },
            })

            overlays.addLayer(fuel)
            outputdata.push(fuel)
          }
          tempFuel = L.layerGroup(outputdata)
          layerControl.addOverlay(tempFuel, 'Fuel')
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
        },
      })
    },
  })
}

map.on('baselayerchange', function () {
  countryBorder()
})

selectCountry.on('change', function () {
  getOverlays()
  countryBorder()
})

map.on('overlayadd', function (eo) {
  if (eo.name !== "All Markers<hr style='margin:0.5em 0'>") {
    setTimeout(function () {
      map.removeLayer(overlays)
    }, 10)
  }
})

map.on('overlayadd', function (eo) {
  if (eo.name === "All Markers<hr style='margin:0.5em 0'>") {
    setTimeout(function () {
      map.removeLayer(tempFuel).removeLayer(tempHotels).removeLayer(tempCities).removeLayer(tempWebcams).removeLayer(tempEarthquakes)
    }, 30)
  }
})

// Popup / Tooltip Display Functions

map.on('popupclose', function (e) {
  let tooltip = e.popup._source.getTooltip()
  if (tooltip) {
    tooltip.setOpacity(0.9)
  }
})

map.on('popupopen', function (e) {
  let tooltip = e.popup._source.getTooltip()
  if (tooltip) {
    e.target.closeTooltip()
    tooltip.setOpacity(0)
  }
})

var marker = L.marker([40, -4]).addTo(map)

var ctlMeasure = L.control.polylineMeasure({
  position: 'topleft',
  measureControlTitle: 'Measure Lenght'
}).addTo(map);

/////////////////////////////////////////////// MODAL BUTTONS /////////////////////////////////////////////////////////////

const loading = $('#loadingDiv').hide()

function getCountryInfo() {
  $.ajax({
    url: 'libs/php/getCountryInfo.php',
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

// Weather Button

let selectedCity = $('#selectedCity')

function getWeatherInfo() {
  // Get bounding box of county

  $.ajax({
    url: 'libs/php/getBoundingBox.php',
    type: 'POST',
    dataType: 'json',
    data: {
      country: selectCountry.val(),
    },
    beforeSend: () => {
      loading.show()
    },
    success: function (result) {
      if (result.status.name == 'ok') {
        north = result.data[0].north
        south = result.data[0].south
        east = result.data[0].east
        west = result.data[0].west
        capital = result.data[0].capital
      }

      // Pre-populate with default (capital city) values

      $.ajax({
        url: 'libs/php/getWeather.php',
        type: 'POST',
        dataType: 'json',
        data: {
          citysearch: capital,
          countrycode: selectCountry.val(),
        },
        success: function (result) {
          if (result.status.name == 'ok') {
            function setWeather(res) {
              $('.txtCountry').html(res.data.name)
              $('#weatherIcon').attr('src', 'https://openweathermap.org/img/wn/' + res.data.weather[0].icon + '@2x.png')
              $('#weatherMain').html(res.data.weather[0].main + ' - ')
              $('#weatherDesc').html(res.data.weather[0].description)
              $('#weatherTemp').html(res.data.main.temp.toFixed(0) + '&#8451;')
              $('#weatherTempMax').html(res.data.main.temp_max.toFixed(0) + '&#8451;')
              $('#weatherTempMin').html(res.data.main.temp_min.toFixed(0) + '&#8451;')
              $('#weatherHumidity').html(res.data.main.humidity + '%')
              $('#weatherPressure').html(res.data.main.pressure + ' hPa')
              $('#weatherWindSd').html((res.data.wind.speed * 2.237).toFixed(0) + ' mph')
              $('#weatherSunrise').html(
                new Date(res.data.sys.sunrise * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              )
              $('#weatherSunset').html(
                new Date(res.data.sys.sunset * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              )
            }
            setWeather(result)

            // Filter cities and populate select list

            $.ajax({
              url: 'libs/php/getCities.php',
              type: 'POST',
              dataType: 'json',
              data: {
                north: north,
                south: south,
                east: east,
                west: west,
              },
              complete: () => {
                loading.hide()
              },
              success: function (result) {
                if (result.status.name == 'ok') {
                  let filteredCities = []

                  if (result.data.hasOwnProperty('geonames')) {
                    for (let i = 0; i < result.data.geonames.length; i++) {
                      if (result.data.geonames[i].countrycode === selectCountry.val()) {
                        filteredCities.push(result.data.geonames[i])
                      }
                    }
                    for (let i = 0; i < filteredCities.length; i++) {
                      selectedCity.append(
                        $('<option>', {
                          value: filteredCities[i]['name'],
                          text: filteredCities[i]['name'],
                        })
                      )
                    }
                  } else {
                    console.log(result.data.status)
                    selectedCity.append(
                      $('<option>', {
                        value: capital,
                        text: capital,
                      })
                    )
                  }

                  let optionList = selectedCity.find('option')
                  optionList.sort(function (a, b) {
                    return $(a).text() > $(b).text() ? 1 : -1
                  })
                  selectedCity.append(optionList)
                  selectedCity.prepend(`<option selected="true" disabled>${capital}</option>`)
                  selectedCity.prop('selectedIndex', 0)

                  // Get Current Weather from search

                  $('#btnWeather')
                    .unbind()
                    .click(function () {
                      $.ajax({
                        url: 'libs/php/getWeather.php',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                          citysearch: selectedCity.val(),
                          countrycode: selectCountry.val(),
                        },
                        beforeSend: () => {
                          loading.show()
                        },
                        complete: () => {
                          loading.hide()
                        },
                        success: function (result) {
                          if (result.status.name == 'ok') {
                            if (selectedCity.val() === null) {
                              $('#resetWeather').trigger('click')
                            } else if (result.data.cod === '404') {
                              alert('City not found, try again!')
                            } else setWeather(result)
                          }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                          console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
                        },
                      })
                    })
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
              },
            })
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
        },
      })
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
    },
  })
}

$('#resetWeather').click(function () {
  selectedCity.empty()
  getWeatherInfo()
})

$('#modalWeatherBox').on('hide.bs.modal', function () {
  selectedCity.empty()
})

function getWikiInfo() {
  countryName = $('#selectCountry option:selected').text()
  let searchName = countryName.split(' ').join('%20')
  return $.ajax({
    url: 'libs/php/getWikiEntries.php',
    type: 'POST',
    dataType: 'json',
    data: {
      country: searchName,
    },
    beforeSend: () => {
      loading.show()
    },
    complete: () => {
      loading.hide()
    },
    success: function (result) {
      if (result.status.name == 'ok') {
        let unfiltered = result.data.geonames
        let firstFilter = []
        let filteredSearch = []

        for (let i = 0; i < unfiltered.length; i++) {
          if ('summary' in unfiltered[i]) {
            firstFilter.push(unfiltered[i])
          }
        }
        for (let i = 0; i < firstFilter.length; i++) {
          if (firstFilter[i].summary.includes(countryName)) {
            filteredSearch.push(firstFilter[i])
          }
        }

        function strChop(str) {
          if (str.length > 240) {
            return (str = str.substring(0, 240) + '... ')
          } else return str + ' '
        }

        function wikiUrl(mobile) {
          return mobile.substring(0, 3) + 'm.' + mobile.substring(3)
        }

        let nodeBody = $('#wikibody')

        for (let i = 0; i < filteredSearch.length; i++) {
          nodeBody.append(
            `<p style="border-bottom: 1px solid lightgrey; padding-bottom: 1em;"><strong><span class="txtTitle">${
              filteredSearch[i].title
            }: </strong><span class="txtSummary">${strChop(filteredSearch[i].summary)}</span><a class="wikiLinkLoad" href="${
              '//' + wikiUrl(filteredSearch[i].wikipediaUrl)
            }" target="wikiLink">See More</a></p>`
          )
          if (i > 14) break
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.warn(`${jqXHR.status}: ${textStatus}, ${errorThrown}`)
    },
  })
}

$('#modalWikiBox').on('hide.bs.modal', function () {
  $('#wikibody, #wikiframe').empty()
  $('.wikiLinkLoad', '#wikiNewTab').attr('href', '')
  $('#wikiLink').attr('src', '')
})

$(document).on('click', '.wikiLinkLoad', function () {
  let hrefVal = $(this).attr('href')
  $('#wikiNewTab').attr('href', hrefVal)
})



// Exchange Rate Modal

function fetchExchangeRates() {
  $.ajax({
    url: 'libs/php/getExchangeRates.php', // Create this PHP file
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      if (data.status.code === '200') {
        const rates = data.rates;
        const modalBody = $('#modalExchangeRateBody');

        // Clear previous data
        modalBody.empty();

        // Create a table to display exchange rates
        const table = $('<table class="table"></table>');
        const tableBody = $('<tbody></tbody>');

        for (const currency in rates) {
          const rate = rates[currency];
          const row = $('<tr></tr>');
          row.append(`<td>${currency}</td>`);
          row.append(`<td>${rate}</td>`);
          tableBody.append(row);
        }

        table.append(tableBody);
        modalBody.append(table);
      } else {
        // Handle error
        alert('Failed to fetch exchange rates.');
      }
    },
    error: function () {
      // Handle error
      alert('Failed to fetch exchange rates.');
    },
  });
}

// Add an event listener to the Exchange Rate modal when it's shown
$('#modalExchangeRateBox').on('shown.bs.modal', function (e) {
  // Fetch exchange rate data when the modal is shown
  fetchExchangeRates();
});

