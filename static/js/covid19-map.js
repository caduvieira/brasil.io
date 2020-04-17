var cityData, cityGeoJSON, cityLayer, colors, map, selectedVar, stateGeoJSON, stateLayer;
selectedVar = "confirmed";
colors = {
	"confirmed": "#00F",
	"confirmed_per_100k_inhabitants": "#80F",
	"deaths": "#F00",
	"death_rate": "#F08",
};

function defineOpacity(value, maxValue) {
	if (value == 0) {
		return 0;
	}
	else if (value == maxValue) {
		return 10;
	}
	else {
		return Math.log2(value + 1) / Math.log2(maxValue + 1);
	}
}
function cityStyle(feature) {
	var ibgeCode = parseInt(feature.properties.CD_GEOCMU);
	var value = cityData[ibgeCode][selectedVar] || 0;
	var maxValue = maxValues[selectedVar];
	var opacity = defineOpacity(value, maxValue);
	return {
		lineJoin: "round",
		weight: 0.25,
		opacity: 0,
		fillOpacity: opacity,
		color: colors[selectedVar],
	}
}
function stateStyle(feature) {
	return {
		color: "#000000",
		fillColor: "#FFFFFF",
		fillOpacity: 0.1,
		opacity: 1,
		weight: 0.5
	};
}

function createMap() {
	map = L.map("map", {
		zoomSnap: 0.25,
		zoomDelta: 0.25,
		minZoom: 4,
		maxZoom: 9,
		attributionControl: false
	});
	map.setView([-15, -54], 4.75);
}
function updateMap() {
	if (stateGeoJSON !== undefined && stateLayer === undefined) {
		stateLayer = L.geoJSON(stateGeoJSON, {style: stateStyle}).addTo(map);
	}

	if (stateLayer !== undefined && cityGeoJSON !== undefined && cityLayer === undefined) {
		cityGeoJSON.features = cityGeoJSON.features.filter(function (item) {
			var ibgeCode = parseInt(item.properties.CD_GEOCMU);
			var city = cityData[ibgeCode];
			return city !== undefined;
		});
		cityLayer = L.geoJSON(cityGeoJSON, {style: cityStyle}).addTo(map);
	}

	if (stateLayer !== undefined && cityLayer !== undefined) {
		var legend = L.control({position: "bottomright"});
		legend.onAdd = function (map) {
			var div = L.DomUtil.create("div", "info legend");
			var lastValue = 0;
			for (var i = 0; i <= 1; i += 0.1) {
				value = parseInt(2 ** (i * Math.log2(maxValues[selectedVar] + 1)) - 1);
				div.innerHTML += '<i style="background: ' + colors[selectedVar] + '; opacity: ' + i + '"></i> ' + lastValue + '&mdash;' + value + '<br>';
				lastValue = value;
			}
			return div;
		};
		legend.addTo(map);
	}
}

function retrieveData() {
	jQuery.getJSON(
		dataURL.cities,
		function (data) {
			cityData = data.cities;
			maxValues = data.max;
			updateMap();
		}
	);
	jQuery.getJSON(
		dataURL.stateGeoJSON,
		function (data) {
			stateGeoJSON = data;
			updateMap();
		}
	);
	jQuery.getJSON(
		dataURL.cityGeoJSON,
		function (data) {
			cityGeoJSON = data;
			updateMap();
		}
	);
}

jQuery(document).ready(function() {
	createMap();
	retrieveData();
});
