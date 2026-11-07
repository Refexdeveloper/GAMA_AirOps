import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import PropTypes from 'prop-types';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import React, { useRef, useEffect } from 'react';
import { Icon, Text, Fill, Style } from 'ol/style';

export default function MapComponent({ mapLngLat = {} }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setTarget(null);
    }

    if (mapLngLat) {
      const map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        target: mapRef.current,
        view: new View({
          center: fromLonLat(mapLngLat.coordinates),
          zoom: 12,
        }),
      });

      const markerStyle = (label = '') =>
        new Style({
          image: new Icon({
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAACXBIWXMAAAsTAAALEwEAmpwYAAABqElEQVR4nO3U3StDYRwH8DOGG+Ri4g9wv1x4uRirlZa1jTuUxIUN40byduFGriakYZQUKzUveWmJxSYulNEaNW/JjQtJp1CE7avn1HaczuzivNztW796ep6n59PvOT2HolJJRe4AyMY7XcwUkC0fFDwyYdR6hfqiL2jTwBQZ29vCCB0bpMU8806YCyKooJCwagoj8CxMSYP5V4egz4n+i8VKnxvF4fqAOAzIgE3zxjnYbgWuAkD4FLBbuGiX9hWAUjh47u9gvlXswJEm8DLcyK5r04DQkUU4uDW7xOngZIcPkrm/ezbnFoWDXtc057DDNT7oW+GC3mWHcPD+Qg9dJntYZyXw881iZGzTsOu6LODhUicYZNBewzOnA0spsOkENmaA1hJud32mZwAKceDekgOViuRPghTZs+uaFIUxIKBEv5nbZaIarH0CkC4aZNDT/QYYVf8/flN+FGcHdZJgcdQ9vp3wasmce2JLUoyEXBfs1jseONZ+K+rvkiyg6Tz0VL/Ese4qGo+PKkrO4CZQjmb1J1rUH7gOlMmKxYKgz0gqPpFKKpSM+QWCE9td5se8BQAAAABJRU5ErkJggg==',
          }),
          text: new Text({
            text: label,

            offsetY: -18,
            font: 'bold  15px T',
            fill: new Fill({
              color: 'black',
            }),
          }),
        });

      const markers = new Feature({
        geometry: new Point(fromLonLat(mapLngLat.coordinates)),
        name: mapLngLat.name,
      });
      markers.setStyle(markerStyle());

      const vectorSource = new VectorSource({
        features: [markers],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      map.addLayer(vectorLayer);

      // Save the current map instance
      mapInstance.current = map;
    }
    // Cleanup function when the component unmounts
    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(null);
      }
    };
  }, [mapLngLat]); // Empty dependency array to run the effect only once

  return (
    <div style={{ height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

MapComponent.propTypes = {
  mapLngLat: PropTypes.array,
};
