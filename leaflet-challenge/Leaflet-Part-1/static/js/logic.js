// Initialize the map on the "map" div with a given center and zoom
var myMap = L.map('map', {
  center: [0, 0], // Starting at the center of the earth
  zoom: 3 // Zoomed out to see the whole globe
});

// Adding a tile layer (the background map image) to our map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data for earthquakes.
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
  return magnitude * 4;
}

// Function to determine marker color based on earthquake depth
function getColor(depth) {
  return depth > 90 ? '#ea2c2c' :
         depth > 70 ? '#ea822c' :
         depth > 50 ? '#ee9c00' :
         depth > 30 ? '#eecc00' :
         depth > 10 ? '#d4ee00' :
                      '#98ee00';
}

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, create a GeoJSON layer containing the data features
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup('<h3>' + feature.properties.place +
        '</h3><hr><p>Date & Time: ' + new Date(feature.properties.time) + '</p><p>Magnitude: ' +
        feature.properties.mag + '</p><p>Depth: ' + feature.geometry.coordinates[2] + ' km</p>');
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function() {
    var div = L.DomUtil.create
