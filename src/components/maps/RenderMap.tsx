import { useEffect, useRef } from "react";
import { useLocationCoords } from "../../contexts/LocationContext";
import {
  Map as MapLibreMap,
  NavigationControl,
  GeolocateControl,
  setWorkerUrl,
  Marker
} from "maplibre-gl";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
setWorkerUrl(workerUrl);

export function MapRender({geometry}: {
  geometry?: any
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const location = useLocationCoords();

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) {
      return;
    }

    const map = new MapLibreMap({
      container,
      style: `${import.meta.env.MODE === "development"
        ? "https://tiles.openfreemap.org/styles/liberty"
        : "https://api.maptiler.com/maps/openstreetmap/style.json"}?key=${import.meta.env.VITE_MAPTILER_KEY}`,

      center: [location.location.long, location.location.lat],
      zoom: 12,
    });

    mapRef.current = map;

      map.on('load', () => {
    map.addSource('route', {
        "type": "geojson",
        "data": {
            "type": "Feature",
            "properties": {},
            geometry
        }
    }
  );
    map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#885',
            'line-width': 8
        }
    });
});

    map.addControl(
      new NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      "top-right",
    );
    
    new Marker()
    .setLngLat([location.location.long, location.location.lat])
    .addTo(map);

    map.addControl(
      new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
    );

    map.on("error", (event) => {
      console.error("MapLibre error:", event.error);
    });

    // Handles layout changes such as opening a sidebar
    // or resizing the map's parent element.
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div>
      <p className="font-family-display font-bold text-xl my-2">Detailed Map</p>
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive map of Nigeria"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "300px",
        borderRadius: "8px",
      }}
    />
    </div>
  );
}
