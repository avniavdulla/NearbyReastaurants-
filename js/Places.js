/**
 * Establishes connection to Geolocation API, then uses that data to
 * Gather and update restaurant data based on location
 * works using Geolocation API, current location must be allowed on browser
 * @constructor
 */
export const Places = function () {
    console.log("Places!!");
    var that = this;
    var ll = '';

    // Get location of user
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(saveLocation);
    } else {
        $('#error').html("Could not find location");
    }

    // saves location and sends API request
    function saveLocation(position) {
        var main = that;
        ll = position.coords.latitude + "," + position.coords.longitude;
        console.log("LL:", ll);
        $.ajax({
            dataType: "json",
            url: "https://api.foursquare.com/v2/venues/search",
            method: 'POST',
            data: {
                client_id : '50AOWNHVJSU20DSLABOAZFYXM1QGWBR1SENHCUOSZDMI4SHY',
                client_secret: 'ZYC2BV3DZM1WKHD3ARVNUI00FXD20ZY5NHKVDHKQKJYPDLEK',
                ll: ll,
                v: '20200602',
                query: 'restaurant'
            },
            success: function( data ) {
                // send the found venues to get processed
                main.update(data.response.venues, data.response.venues.length);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Code for handling errors
                $('#error').html("Error, something went wrong on our end");
            }
        });
    }

};

/**
 * Update the values in the list
 * @param venues list of venues
 */
Places.prototype.update = function (venues, to_print) {

    // hides location error message
    $('#location-error').hide();

    // form the html here
    // then change in restaurants
    var html = "";
    for (var i = 0; i < to_print; i++){

        var name = venues[i].name;
        var address = venues[i].location.address;
        var distance = venues[i].location.distance ; // converted to miles
        console.log("distance:", distance);


        html +=
            "<div class='place'> " +
            "<ul><li>" +
            venues[i].name + "</li><li>" +
            venues[i].location.address + "</li><li>" +
            venues[i].location.distance + " meters away </li>";

        // Categories Exist, place category and icon
        if (venues[i].categories.length != 0) {
            console.log(venues)
            var type = venues[i].categories[0].name;
            var icon_src =  venues[i].categories[0].icon.prefix + 'bg_64' + venues[i].categories[0].icon.suffix;

            html +=
                "<li>" + venues[i].categories[0].name + "</li>" +
                "<li><img src= '" + icon_src + "'></li>"
        }
        // Categories are unavailable
        else {
            html +=
                "<li> Type unavailable </li>" +
                "<li> Icon Unavailable </li>"
        }
        html += "</ul></div>";
        $("#restaurants").append(html);
        html = "";
    }

};