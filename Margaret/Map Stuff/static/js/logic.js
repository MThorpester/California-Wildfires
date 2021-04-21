function createMap(wildfireMarkers, Markers2019, Markers2018, Markers2017, Markers2016, Markers2015, Markers2014, Markers2013) {

  // Create the outdoors tile layer that will be the background of our map
  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });
//  changed from "light-v10"
//   https://api.mapbox.com/styles/v1/mapbox/outdoors-v11.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#2/20/0

 // Create the street tile layer that will be the optional background of our map
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "streets-v11",
  accessToken: API_KEY
});
  // Create a baseMaps object to hold the base map layers
  var baseMaps = {
    "Outdoors Map": outdoorsmap,
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "Other Wildfires": wildfireMarkers,
    "2019 Wildfires": Markers2019,
    "2018 Wildfires": Markers2018,
    "2017 Wildfires": Markers2017,
    "2016 Wildfires": Markers2016,
    "2015 Wildfires": Markers2015,
    "2014 Wildfires": Markers2014,
    "2013 Wildfires": Markers2013

  };
   
  // Create the map object with options (center on Sacramento)
  var map = L.map("map-id", {
    center: [38.58, -121.49],
    zoom: 7,
    layers: [outdoorsmap, wildfireMarkers, Markers2019, Markers2018, Markers2017, Markers2016, Markers2015, Markers2014, Markers2013]
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
  console.log("Length of wildfire_data array: ",wildfire_data.length);

//Initialize an array to hold earthquakes
   var wildfireMarkers = [];
   var Markers2019 = [];
   var Markers2018 = [];
   var Markers2017 = [];
   var Markers2016 = [];
   var Markers2015 = [];
   var Markers2014 = [];
   var Markers2013 = [];
   var wildfireMarkerCount = 0;
  // Loop through the earthquakes array
  for (var index = 0; index < wildfire_data.length; index++) {
    var wildfire = wildfire_data[index];
    // console.log("The type of the Archive Year is: ", typeof(wildfire.properties.ArchiveYear));
    // console.log("Latitude is: ", wildfire.geometry.coordinates[1]);
    // console.log("Longitude is: ", wildfire.geometry.coordinates[0]);
   
    // For each wildfire, create a marker and bind a popup with the earthquake's place
    var wildfireMarker = L.marker([wildfire.geometry.coordinates[1], wildfire.geometry.coordinates[0]])
      .bindPopup("Name: " + wildfire.properties.Name + "<br>Latitude: " + wildfire.geometry.coordinates[1] + " Longitude: " + wildfire.geometry.coordinates[0] +
      "<br>Archived Year: " + wildfire.properties.ArchiveYear);
    
    // Add the marker to the array for the year the wildfire was recorded
    switch(wildfire.properties.ArchiveYear) {
      case 2019:
        console.log("2019 Marker: ",wildfire.properties.ArchiveYear);
        Markers2019.push(wildfireMarker);
        break;
      case 2018:
        console.log("2018 Marker: ",wildfire.properties.ArchiveYear);
        Markers2018.push(wildfireMarker);
        break;
      case 2017:
        console.log("2017 Marker: ",wildfire.properties.ArchiveYear);
        Markers2017.push(wildfireMarker);
        break;
      case 2016:
        console.log("2016 Marker: ",wildfire.properties.ArchiveYear);
        Markers2016.push(wildfireMarker);
        break;
      case 2015:
        console.log("2015 Marker: ",wildfire.properties.ArchiveYear);
        Markers2015.push(wildfireMarker);
        break;
      case 2014:
        console.log("2014 Marker: ",wildfire.properties.ArchiveYear);
        Markers2014.push(wildfireMarker);
        break;
      case 2013:
        console.log("2013 Marker: ",wildfire.properties.ArchiveYear);
        Markers2013.push(wildfireMarker);
        break;
      default:
        wildfireMarkers.push(wildfireMarker);
        console.log("2015 Marker: ",wildfire.properties.ArchiveYear);
    }


  
  // console.log("index value is ", index);
};
   
  // console.log("earthquakeMarkers: ", earthquakeMarkers);
  // console.log("Markers2013 after the Switch statement: ", Markers2013.length);

  
  // Create a layer group made from the wildfire marker arrays, pass it into the createMap function
  createMap(L.layerGroup(wildfireMarkers),L.layerGroup(Markers2019),L.layerGroup(Markers2018),
  L.layerGroup(Markers2017),L.layerGroup(Markers2016), L.layerGroup(Markers2015), L.layerGroup(Markers2014), L.layerGroup(Markers2013));
};
 


// Perform an API call to the USGS API to get earthquake information. Call createMarkers when complete
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);

// d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(function(infoRes) {

// Use this link to get the wildfire data.
var link = "static/data/WildfireIncidents.geojson";
console.log("link is: ", link);
// Get the wildfire GeoJSON file
d3.json(link).then(function(data) {
  // console.log(data);
  createMarkers(data);
});