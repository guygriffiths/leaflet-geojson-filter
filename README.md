#leaflet-geojson-filter

A Leaflet control for filtering GeoJSON layers based on the text properties of their features.

It works by providing the control with a GeoJSON layer, the full set of GeoJSON data used to populate it with (as a `FeatureCollection`), and a list of text fields to filter on.  The control will search the data to find all available values of the desired text fields and create a control to allow each term to be filtered out of the data.

##Example usage

After installing the control with:

```bash
$ jspm install leaflet-geojson-filter=github:guygriffiths/leaflet-geojson-filter
```

you can import it and use the control:

```js
import GeoJSONFilter from 'leaflet-geojson-filter'
...
var geojsonData = {...};
/* Add the GeoJSON data to the map */
var filterLayer = L.geoJSON(geojsonData).addTo(map);
/* Create the control.  Give it the layer, the data, and a map of field title to field 
   IDs to filter */
var filterControl = new GeoJSONFilter(filterLayer, geojsonData, {
    'Property 1 Title': 'prop01',
    'Property 2 Title': 'prop02'
});
/* Adding the control will now create two categories to filter: 'Property 1 Title' and
   'Property 2 Title' which will contain all possible values for 'prop01' and 'prop02'
   respectively */
map.addControl(filterControl);
```

A full example can be found at https://github.com/guygriffiths/leaflet-geojson-filter-example
