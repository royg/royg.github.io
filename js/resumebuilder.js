//  Global Variables
var map;    // declares a global map variable

var infoWindow ; // declare the infowindow global variable
var resizeHandler;
var current_location;

// jQuery Parts simplistic function addition for toggles. and Tabs
$(document).ready(function() {

    var initialWorkToggle = true;
    var initialSchoolToggle = true;

    //---------------TABS-------------\\
    /* hide and reveal the tabs as per their click order */
    $(".cv-tabs a").click(function(e) {
        var clickedTab = e.target.id;
        var whichTabToActivate = "." + clickedTab;
        var whichAnchorToActivate = "." + clickedTab + " a";
        console.log(whichTabToActivate);
        e.preventDefault();
        $(".tabs .active").removeClass("active");
        $(whichAnchorToActivate).addClass("active");
        $(whichTabToActivate).addClass("active");
        if ( (initialWorkToggle) && (whichAnchorToActivate === '.work a') ) {
            $(".work-experience dt").first().next().slideToggle();
            initialWorkToggle = false;
        }
        if ( (initialSchoolToggle) && (whichAnchorToActivate === '.education a') ) {
            $(".education-history dt").first().next().slideToggle();
            initialSchoolToggle = false;
        }
        // if the toggle is for the map, initialize the map again.
        if (whichTabToActivate === ".my-world" ) {
            activeTab = ".my-world";
            // re-initialize the map as the user may have re-sized the window
            initializeMap();
            // just re-apply a resize event.
           resizeHandler.apply();
        }
    });


    //---------------Work Experience accordion layout-------------\\
    $(".work-experience dt").click(function(e) {
        // simply toggle the dd up and down based on the user preferences
        $(this).next().slideToggle();
    });

    //---------------Education history accordion layout-------------\\
    $(".education-history dt").click(function(e) {
        // simply toggle the dd up and down based on the user preferences
        $(this).next().slideToggle();
    });

});

// google map parts from the course for the map to appear.
// call the initialise the map for the start of the page
initgoogleMap();


/*
 This is the fun part. Here's where we generate the custom Google Map for the website.
 See the documentation below for more details.
ç
 */

/*
Start here! initializeMap() is called when page is loaded.
*/
function initializeMap() {

    var locations;

    var mapOptions = {
        disableDefaultUI: true
    };

    // This next line makes `map` a new Google Map JavaScript Object and attaches it to
    // <div id="map">, which is appended as part of an exercise late in the course.
    map = new google.maps.Map(document.querySelector('#map'), mapOptions);


    /*
     locationFinder() returns an array of every location string from the JSONs
     written for bio, education, and work.
     */
    function locationFinder() {

        // initializes an empty array
        var locations = [];
        // retrieve the location from the current html Structure build on "bio_data JSON" file

        // add locations to the location array

        for (var loc in bio_locations.locations) {
            locations.push(bio_locations.locations[loc]) ; // at least one location must be defined
        }


        return locations;
    }

    /*
     createMapMarker(placeData) reads Google Places search results to create map pins.
     placeData is the object returned from search results containing information
     about a single location.
     */
    function createMapMarker(placeData, placetype, LocationRef) {

        // The next lines save location data from the search result object to local variables
        var lat = placeData.geometry.location.k;  // latitude from the place service
        var lon = placeData.geometry.location.D;  // longitude from the place service
        var name = placeData.formatted_address;   // name of the place from the place service
        var bounds = window.mapBounds;            // current boundaries of the map window
        var contentWindow = bio_locations.location_description[current_location];

        console.log("passed parameter", LocationRef);

        // infoWindows are the little helper windows that open when you click
        // or hover over a pin on a map. They usually contain more information
        // about a location.

        var infoWindow = new google.maps.InfoWindow({
           content: bio_locations.location_description[current_location]
        });

        // marker is an object with additional data about the pin for a single location take the correct marker based on
        // where you are
        if (placetype === "live") { // add the green icon
            var marker = new google.maps.Marker({
                map: map,
                position: placeData.geometry.location,
                title: name,
                icon: 'images/greenmarker.png',
                home: '<p>'+bio_locations.location_description[LocationRef] +'</p>'
            });
            // add the appropriate listener
            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent(marker.home);
                infoWindow.open(map, marker);
             });
        }

        if (placetype === "work") { // add the green icon
            var marker = new google.maps.Marker({
                map: map,
                position: placeData.geometry.location,
                title: name,
                icon: 'images/bluemarker.png',
                work: '<p>'+bio_locations.location_description[LocationRef] +'</p>'
            });

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent(marker.work);
                infoWindow.open(map, this);
            });
        }

        if (placetype === "school"){ // add the green icon

            var marker = new google.maps.Marker({
                map: map,
                position: placeData.geometry.location,
                title: name,
                icon: 'images/orangemarker.png',
                info: '<p>'+ bio_locations.location_description[LocationRef] +'</p>'
            });

            // add the appropriate listener
            google.maps.event.addListener(marker, 'click', function() {
                // your code goes here!
                // console.log(name);
                infoWindow.setContent(marker.info);
                infoWindow.open(map, this);
            });
        }

        // this is where the pin actually gets added to the map.
        // bounds.extend() takes in a map location object
        bounds.extend(new google.maps.LatLng(lat, lon));
        // fit the map to the new marker
        map.fitBounds(bounds);
        // center the map
        map.setCenter(bounds.getCenter());

    }

    /*
     callback(results, status) makes sure the search returned results for a location.
     If so, it creates a new map marker for that location.
     */
    var callback = function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            createMapMarker(results[0]);
        }
    }


    function makeCallback(addressIndex) {
        var googleCallBack = function(results, status) {
            var i = addressIndex;
            // alert(locations[i] + " " + results[0].formatted_address);
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                createMapMarker(results[0], bio_locations.location_type[i], i);
            }
        }
        return googleCallBack;
    }
    /*
     pinPoster(locations) takes in the array of locations created by locationFinder()
     and fires off Google place searches for each location
     */
    function pinPoster(locations) {

        // creates a Google place search service object. PlacesService does the work of
        // actually searching for location data.
        var service = new google.maps.places.PlacesService(map);

        // Iterates through the array of locations, creates a search object for each location
        for (var place in locations) {

            // the search request object
            current_location = place; // so that the correct marker and content can be added to the map unfortunately didn' work
            var request = {
                query: locations[place]
            }
            // console.log("requested obj :", place);
            // Actually searches the Google Maps API for location data and runs the callback
            // function with the search results after each search.
            // service.textSearch(request, callback);
            service.textSearch(request,  makeCallback(place));
        }
    }

    // Sets the boundaries of the map based on pin locations
    window.mapBounds = new google.maps.LatLngBounds();

    // locations is an array of location strings returned from locationFinder()
    locations = locationFinder();

    // pinPoster(locations) creates pins on the map for each location in
    // the locations array
    pinPoster(locations);

};

window.onresize = fitGoogleMaps_tabs;

function fitGoogleMaps_tabs(e) {
    map.fitBounds(mapBounds)

}


function initgoogleMap() {
    // Calls the initializeMap() function when the page loads
    window.addEventListener('load', initializeMap);
    // add a listener for the re-size even
    resizeHandler = window.onresize;

}
