// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
    var mapElem = document.getElementById('map');

    var center = {
        lat: 47.6,
        lng: -122.3
    };

    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12

    });// elem which you want map to appear, and the center and zoom level

    var infoWindow = new google.maps.InfoWindow();

    var stations;
    var markers = [];

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            stations = data;

            data.forEach(function(station, itemIndex) {
                var image = 'img/traffic.png';
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(station.location.latitude),
                        lng: Number(station.location.longitude)
                    }, map: map,
                    icon: image
                });
                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {
                    map.panTo(marker.position);

                    var html = '<p>' + station.cameralabel + '</p>';
                    html+= '<img src="' + station.imageurl.url + '">';

                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                    marker.setAnimation(google.maps.Animation.DROP);
                });

                google.maps.event.addListener(map, 'click', function() {
                    infoWindow.close();
                });

                $('#search').bind('search keyup', function() {
                    var search = this.value.toLowerCase();
                    if (station.cameralabel.toLowerCase().indexOf(search) < 0) {
                        marker.setMap(null);
                    } else {
                        marker.setMap(map);
                    }
                });

                $(window).resize(function() {
                    var jMap = $("#map");
                    var position = jMap.position();
                    console.log(position.top);
                    console.log($(window).height());
                    jMap.height(($(window).height() - position.top - 20));

                    google.maps.event.trigger(map, 'resize');
                    //map height = windows height - map.position() absolute top position - 20px
                    //$(window).width()
                    //

                });
            });
        })

        // to remove a marker from a map, set the marker to a variable, call marker.setMap? method and pass null
        // to reshow the markers, setMap = map... and go through the search again

        // every object has camera label which has description of where camera is/what it's looking at
        // don't use angular
        // there is an angular google maps shin library, too complicated
        // think about it not with angular, but with javascript
        // iterate with foreach, .indexOf of a javascript string to see if mthis substring is in the string.
        // remember to ignore case, make both strings lower case, and then compare two lowercase strings
        // index of associated, add corresponding marker in same marker. If I'm on index 5 of stations, the corresponding
        // marker is marker 5.
        // corresponding itemIndex in forEach like above, iterate over traffic cameras, does it satisfy search criteria?
        // if doesn't get corresponding marker and setMap= nul
        // redo markers by foreach and going back over
        // keyup and search can be caught by bind
        .fail(function(err) {
            alert(err.message);
        })

        .always(function() { // like .finally
            $('#ajax-loader').fadeOut();
        });

});