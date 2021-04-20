function createMap(wildfireMarkers) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "Wildfires": wildfireMarkers
  };
 
  // Create the map object with options (center on Petrolia)
  var map = L.map("map-id", {
    center: [40.32, -124.29],
    zoom: 5,
    layers: [lightmap, wildfireMarkers]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {
  // Designate a custom icon
  // Below code isn't working but I need to try this next:
  // https://github.com/coryasilva/Leaflet.ExtraMarkers
  // var myIcon = L.icon({
  //   iconUrl: 'file:///C:/Users/mthor/Bootcamp/leaflet-challenge/static/img',
  //   iconSize:     [38, 95], // size of the icon
  //   iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  //   popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  // });
   // Creates a red marker with the coffee icon
  //  var myIcon = L.ExtraMarkers.icon({
  //   icon: 'fa-coffee',
  //   markerColor: 'red',
  //   shape: 'square',
  //   prefix: 'fa'
  // });


  // Now putting a marker with this icon on a map is easy:
  // L.marker([51.941196,4.512291], {icon: redMarker}).addTo(map);
  // var earthquakeMarker = L.marker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {icon: myIcon})
  // .bindPopup("<h3><h3>Place: " + earthquake.properties.place + "</h3>");
 
  // Pull the features off of response.data
  var wildfire_data = response.features;
  console.log("wildfire is: ", wildfire_data);

//Initialize an array to hold earthquakes
   var wildfireMarkers = [];
  // Loop through the earthquakes array
  for (var index = 0; index < wildfire_data.length; index++) {
    var wildfire = wildfire_data[index];
    console.log("This wildfire is: ", wildfire);
    console.log("Latitude is: ", wildfire.geometry.coordinates[1]);
    console.log("Longitude is: ", wildfire.geometry.coordinates[0]);
   
    // For each earthquake, create a marker and bind a popup with the earthquake's place
    var wildfireMarker = L.marker([wildfire.geometry.coordinates[1], wildfire.geometry.coordinates[0]])
      .bindPopup("<h3><h3>Place: " + wildfire.properties.name + "</h3>");
    // Add the marker to the bikeMarkers array
    wildfireMarkers.push(wildfireMarker);
  }

  // console.log("earthquakeMarkers: ", earthquakeMarkers);
  
  // Create a layer group made from the earthquake markers array, pass it into the createMap function
  createMap(L.layerGroup(wildfireMarkers));
}
 


// Perform an API call to the USGS API to get earthquake information. Call createMarkers when complete
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);

// d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(function(infoRes) {

// Use this link to get the wildfire data.
var link = "static/data/WildfireIncidents.geojson";
console.log("link is: ", link);
// Get the wildfire GeoJSON file
d3.json(link).then(function(data) {
  console.log("Entering callback function");
  console.log(data);
  createMarkers(data);
});
