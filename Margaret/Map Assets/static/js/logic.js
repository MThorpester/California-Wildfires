function createMap(Markers2019, Markers2018, Markers2017, Markers2016, Markers2015, Markers2014, Markers2013) {

  // Create the outdoors tile layer that will be the background of our map
  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

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

  // Create an overlayMaps object to hold the various overlay layers for the map (county boundaries and years)
  counties = L.layerGroup();
  var overlayMaps = {
    "Show County Boundaries": counties, 
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
    layers: [outdoorsmap, Markers2019, Markers2018, Markers2017, Markers2016, Markers2015, Markers2014, Markers2013, counties]
  });

  // Create the map legend and add it to the map

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["<b>Small</b> (< 100 Acres Burned)", "<b>Medium</b> (101-10,000 Acres Burned)","<b>Large</b>) (> 10,000 Acres Burned)"],
        labels = ["static/img/small_fire.png", "static/img/medium_fire.png", "static/img/large_fire.png"];

    // loop through our acres burned intervals and generate a label with the icon for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            grades[i] + (" <img src="+ labels[i] +" height='25' width='25'>") +'<br>';
    }

    return div;
  
  }

  legend.addTo(map);

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

   // Add the county boundaries layer to the map
  var countyLink = "static/data/calicounties.geojson";
  d3.json(countyLink).then(function(countyData) {
    L.geoJson(countyData, {
      style:{
        opacity: 0.75,
        weight: 2,
        color: "#FFF",
        fillcolor: "62B934",
        fillOpacity: 0.0
      }
    }).addTo(counties);
    counties.addTo(map);
  })

  // Remove prior year markers from map upon initial display
  // just leaving the 2019 Wildfire layer selected
  map.removeLayer(Markers2013);
  map.removeLayer(Markers2014);
  map.removeLayer(Markers2015);
  map.removeLayer(Markers2016);
  map.removeLayer(Markers2017);
  map.removeLayer(Markers2018);
}




function createMarkers(response) {
 
  // Define the icons that will be used for the wildfire markers on the map
  // based on the number of acres burned
 
  var bigfireicon = L.ExtraMarkers.icon({
      icon: "ion-flame",
      iconColor: "yellow",
      markerColor: "red",
      shape: "circle"
    })

  var mediumfireicon = L.ExtraMarkers.icon({
    icon: "ion-flame",
    iconColor: "yellow",
    markerColor: "orange",
    shape: "circle"
  })
  var smallfireicon = L.ExtraMarkers.icon({
    icon: "ion-flame",
    iconColor: "yellow",
    markerColor: "yellow",
    shape: "circle"
  }) 

  // Pull the features off of response.data
  var wildfire_data = response.features;
  // console.log("wildfire is: ", wildfire_data);
  // console.log("Length of wildfire_data array: ",wildfire_data.length);

//Initialize an array to hold wildfires for each year
   var Markers2019 = [];
   var Markers2018 = [];
   var Markers2017 = [];
   var Markers2016 = [];
   var Markers2015 = [];
   var Markers2014 = [];
   var Markers2013 = [];
     
   // Loop through the wildfires array
  for (var index = 0; index < wildfire_data.length; index++) {
    var wildfire = wildfire_data[index];
  
    // For each wildfire, create a marker with the icon color based on the acreage burned
    // Bind a popup with the wildfire's details 
    if (wildfire.properties.AcresBurned <= 100) {
      var wildfireMarker = L.marker([wildfire.geometry.coordinates[1], wildfire.geometry.coordinates[0]], {
        icon: smallfireicon});
    } else if (wildfire.properties.AcresBurned <= 10000) {
      var wildfireMarker = L.marker([wildfire.geometry.coordinates[1], wildfire.geometry.coordinates[0]], {
        icon: mediumfireicon});
    } else {
      var wildfireMarker = L.marker([wildfire.geometry.coordinates[1], wildfire.geometry.coordinates[0]], {
        icon: bigfireicon});
    }
    
    var start = wildfire.properties.Started;
    var startDate = (start.slice(0,10));
    var end = wildfire.properties.Extinguished;
    var endDate = (end.slice(0,10));

    wildfireMarker.bindPopup("Name: " + wildfire.properties.Name + "<br>County: " + wildfire.properties.Counties + "<br>Acres burned: " + wildfire.properties.AcresBurned +
      "<br>Date started: " + startDate + "<br>Date extinguished: " + endDate);

    // Add the marker to the array for the year the wildfire was recorded
    switch(wildfire.properties.ArchiveYear) {
      case 2019:
        // console.log("2019 Marker: ",wildfire.properties.ArchiveYear);
        Markers2019.push(wildfireMarker);
        break;
      case 2018:
        // console.log("2018 Marker: ",wildfire.properties.ArchiveYear);
        Markers2018.push(wildfireMarker);
        break;
      case 2017:
        // console.log("2017 Marker: ",wildfire.properties.ArchiveYear);
        Markers2017.push(wildfireMarker);
        break;
      case 2016:
        // console.log("2016 Marker: ",wildfire.properties.ArchiveYear);
        Markers2016.push(wildfireMarker);
        break;
      case 2015:
        // console.log("2015 Marker: ",wildfire.properties.ArchiveYear);
        Markers2015.push(wildfireMarker);
        break;
      case 2014:
        // console.log("2014 Marker: ",wildfire.properties.ArchiveYear);
        Markers2014.push(wildfireMarker);
        break;
      case 2013:
        // console.log("2013 Marker: ",wildfire.properties.ArchiveYear);
        Markers2013.push(wildfireMarker);
        break;
      default:
        console.log("Invalid Archive Year: ", wildfire.properties.ArchiveYear, wildfiremarker);
    }


  }; // end for loop
   
  // Create layer groups made from the wildfire marker arrays, pass them into the createMap function
  createMap(L.layerGroup(Markers2019),L.layerGroup(Markers2018),
  L.layerGroup(Markers2017),L.layerGroup(Markers2016), L.layerGroup(Markers2015), L.layerGroup(Markers2014), L.layerGroup(Markers2013));
}; // end CreateMarker function
 
// Use this link to get the wildfire data.
var link = "static/data/WildfireIncidents.geojson";

// Get the wildfire GeoJSON file
d3.json(link).then(function(data) {
  createMarkers(data);
});