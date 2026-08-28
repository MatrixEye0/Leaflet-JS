
    // map initialization
    var map = L.map('map').setView([28.636, 77.304], 13);// here is cordinate and zoom level

    // osm layer
   var osm= L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     }).addTo(map);

     // satelight (we get map style from style leaflet provider github link)
     var stelight = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
    });
    /// stelight.addTo(map) // now it cover osm layer 

 // other map styles ------------------------------------
    var topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }); 
//-------------------------------------------------------------------------------------------------------------

 var Dark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}); 
//--------------------------------------------------------------------------------------------------------------------------
 
var polmap = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 25
    }
);
    
// also add google map by search google leaflet gis.stackexchange.com
//---------------------------------------------------------------------------
// marker add pin tag in map
var marker= L.marker([28.636, 77.304]).addTo(map);
console.log(marker.toGeoJSON())

// layer controller give you power which type map you want satellight normal etc.-----------------------------------------
var baseMaps = {
    "Street Map": osm,  // here define "layer-name": layer variable which declare above
    "Satellight": stelight,
    "Topography":topomap,
    "Dark":Dark,
    "Political":polmap
};

var overlayMaps = {
   "Marker": marker 
};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// mouse effect and give exact coordinate----------------------------------------------------------
map.on('mousemove',function(e){
   var c= document.getElementsByClassName('coordinate')[0].innerHTML=
   ' Latitude : ' + e.latlng.lat.toFixed(5)  +
   '<br>' +
  ' Longitude : ' + e.latlng.lng.toFixed(5);
})

// real time location -------------------------------------------------------------------------------------------
document.getElementById("locationBtn").addEventListener("click", function (){
if(!navigator.geolocation){
    console.log("not available")
}
else{
    navigator.geolocation.getCurrentPosition(getPosition)
}
});
function getPosition (position){
    var lat=position.coords.latitude
    var long=position.coords.longitude
    var acc = position.coords.accuracy

    map.setView([lat, long], 16);

    var marker =L.marker([lat,long]).addTo(map)
    var circle= L.circle([lat,long],{radius: acc}).addTo(map)
}

// routing--------------------------------------------------------------------------------------
map.on('click', function(e){
    var secondMark = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
    L.Routing.control({
      waypoints: [
                    L.latLng(28.636, 77.304),
                    L.latLng(e.latlng.lat, e.latlng.lng)
                 ]
      }).on('routesfound', function(e){
        e.routes[0].coordinates.forEach(function (coord,index){
            setTimeout(()=>{
                    marker.setLatLng([coord.lat,coord.lng])
            },100*index) // this show marker travel distance in settime which i give 100 ms
        })
      })
      .addTo(map);
})
