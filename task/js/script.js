$(document).ready(function () {
    $('#countryForm').submit(function (e) {
        e.preventDefault();
        var country = $('#countryInput').val();

        // First, get the geonameId
        $.ajax({
            type: 'POST',
            url: 'get_geoname_id.php',
            data: { country: country },
            success: function (data) {
                console.log(data);
                var geonameData = JSON.parse(data);
                if (geonameData.geonameId) {
                    fetchNeighbours(geonameData.geonameId);
                } else {
                    $('#results').html('Error: GeonameId not found.');
                }
            },
            error: function () {
                $('#results').html('Error fetching geonameId.');
            }
        });
    });

    function fetchNeighbours(geonameId) {
        // Now, fetch data using the geonameId
        $.ajax({
            type: 'POST',
            url: 'geonames.php',
            data: { geonameId: geonameId },
            success: function (data) {
                console.log(data);
                displayResults(data);
            },
            error: function () {
                $('#results').html('Error fetching data.');
            }
        });
    }

    function displayResults(data) {
        var resultHtml = '';
        var neighbors = JSON.parse(data);

        if (neighbors && neighbors.status && neighbors.status.code === '200') {
            $.each(neighbors.geonames, function (index, neighbor) {
                resultHtml += '<tr>';
                resultHtml += '<td>' + (index + 1) + '. ' + neighbor.name + '</td>';
                resultHtml += '<td>' + neighbor.countryName + '</td>';
                resultHtml += '<td></td>';
                resultHtml += '</tr>';
            });
        } else {
            resultHtml = '<tr><td colspan="3">No data available.</td></tr>';
        }

        $('#results').html(resultHtml);
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
