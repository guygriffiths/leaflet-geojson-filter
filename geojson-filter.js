import L from 'leaflet'
import './css/geojson-filter.css!'

export default L.Control.extend({
    initialize: function (geoJsonLayer, data, fields, options = {}) {
        this.layer = geoJsonLayer;
        this.data = data;
        this.fields = fields;
        this.filteredOut = {};
        L.Util.setOptions(this, options);
    },
    options: {
        position: 'bottomright'
    },
    onAdd: function (map) {
        this.holder = L.DomUtil.create('div', 'geojson-filter leaflet-bar leaflet-control leaflet-control-custom');
        if(!map.hasLayer(this.layer)) {
            /* Hide the filter box if the layer is not yet visible */
            this.holder.style.display = 'none';
        }
        /* We don't want click events to interact with the map */
        L.DomEvent.disableClickPropagation(this.holder);

        for (let title in this.fields) {
            let fieldId = this.fields[title];
            this.filteredOut[fieldId] = [];

            /* Define the callback to filter all data for the given field */
            let callback = (e) => {
                let changedField = e.target.value;
                let changedTo = e.target.checked;
                if (changedTo == false) {
                    this.filteredOut[fieldId].push(changedField);
                } else {
                    let index = this.filteredOut[fieldId].indexOf(changedField);
                    this.filteredOut[fieldId].splice(index, 1);
                }

                this.layer.clearLayers();
                this.layer.options.filter = (feature) => {
                    for (let group in this.filteredOut) {
                        for (let i = 0; i < this.filteredOut[group].length; i++) {
                            if (feature.properties[group] == this.filteredOut[group][i]) {
                                return false;
                            }
                        }
                    }
                    return true;
                };
                this.layer.addData(this.data);
            };

            /* Create a fieldset with a legend for this filter group */
            let fieldGroup = L.DomUtil.create('fieldset', 'checkboxgroup', this.holder);
            let legend = L.DomUtil.create('legend', '', fieldGroup);
            legend.innerHTML = title;

            /* Find all possible values of this field */
            let valuesSet = new Set();
            for (let i = 0; i < this.data.features.length; i++) {
                valuesSet.add(this.data.features[i].properties[fieldId]);
            }
            let values = Array.from(valuesSet);

            /* Create a checkbox for each possible value */
            for (let i = 0; i < values.length; i++) {
                let cb = L.DomUtil.create('input', '', fieldGroup);
                cb.type = 'checkbox';
                cb.id = values[i];
                cb.checked = 'checked';
                cb.value = values[i];
                cb.onchange = callback;

                let cbLabel = L.DomUtil.create('label', '', fieldGroup);
                cbLabel.setAttribute('for', cb.id);
                cbLabel.innerHTML += values[i];

                L.DomUtil.create('br', '', fieldGroup);
            }
        }

        /* Specific fields required, rather than the "normal" that = this crap */
        let layer = this.layer;
        let holder = this.holder;
        map.on({
            layeradd: function (e) {
                if (e.layer === layer) {
                    holder.style.display = '';
                };
            },
            layerremove: function (e) {
                if (e.layer === layer) {
                    holder.style.display = 'none';
                };
            }
        });

        return this.holder;
    },
    show: function () {
        this.holder.style.display = '';
    },
    hide: function () {
        this.holder.style.display = 'none';
    },
});