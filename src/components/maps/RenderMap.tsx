import { useEffect, useRef } from "react";
import {
  Map as MapLibreMap,
  NavigationControl,
  GeolocateControl,
  setWorkerUrl,
} from "maplibre-gl";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
setWorkerUrl(workerUrl);

export function MapRender() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) {
      return;
    }

    const map = new MapLibreMap({
      container,
      style: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,

      // Coordinates must be [longitude, latitude].
      // Start around Lagos, Nigeria.
      center: [3.3792, 6.5244],
      zoom: 10,
    });

    mapRef.current = map;

    map.addControl(
      new NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      "top-right",
    );

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
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive map of Nigeria"
      style={{
        width: "60%",
        height: "100%",
        minHeight: "400px",
      }}
    />
  );
}
