import { useEffect, useRef } from "react";
import { useLocationCoords } from "../../contexts/LocationContext";
import {
  Map as MapLibreMap,
  NavigationControl,
  GeolocateControl,
  GeoJSONSource,
  LngLatBounds,
  setWorkerUrl,
  Marker,
} from "maplibre-gl";
import type { Feature, Geometry } from "geojson";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import type { JourneyWaypoint } from "../layout/JourneyStops";
setWorkerUrl(workerUrl);

export interface MapRenderProps {
  geometry?: Geometry;
  waypoints?: JourneyWaypoint[];
}

type Coordinate = [number, number];

function toCoordinate(value: unknown): Coordinate | null {
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  ) {
    return [value[0], value[1]];
  }

  return null;
}

function getRouteCoordinates(geometry?: Geometry): Coordinate[] {
  if (geometry?.type === "MultiLineString") {
    return geometry.coordinates
      .flat()
      .map((coordinate) => toCoordinate(coordinate))
      .filter((coordinate): coordinate is Coordinate => Boolean(coordinate));
  }

  if (geometry?.type === "LineString") {
    return geometry.coordinates
      .map((coordinate) => toCoordinate(coordinate))
      .filter((coordinate): coordinate is Coordinate => Boolean(coordinate));
  }

  return [];
}

function fitRoute(map: MapLibreMap, geometry?: Geometry) {
  const coordinates = getRouteCoordinates(geometry);

  if (coordinates.length === 0) {
    return;
  }

  const bounds = new LngLatBounds(coordinates[0], coordinates[0]);

  for (const coordinate of coordinates.slice(1)) {
    bounds.extend(coordinate);
  }

  map.fitBounds(bounds, {
    padding: 48,
    maxZoom: 15,
    duration: 320,
  });
}

export function MapRender({
  geometry,
  waypoints = [],
}: MapRenderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const location = useLocationCoords();
  const initialLocation = useRef(location.location);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) {
      return;
    }

    const center = initialLocation.current;
    const map = new MapLibreMap({
      container,
      style: `${import.meta.env.MODE === "development"
        ? "https://tiles.openfreemap.org/styles/liberty"
        : "https://api.maptiler.com/maps/openstreetmap/style.json"}?key=${import.meta.env.VITE_MAPTILER_KEY}`,

      center: [center.long, center.lat],
      zoom: 12,
    });

    mapRef.current = map;

    map.addControl(
      new NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      "top-right",
    );

    new Marker().setLngLat([center.long, center.lat]).addTo(map);

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

  // Keep the drawn route in sync when stops are added or removed.
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !geometry) {
      return;
    }

    const applyRoute = () => {
      const routeFeature: Feature<Geometry> = {
        type: "Feature",
        properties: {},
        geometry,
      };

      const routeSource = map.getSource("route");

      if (routeSource instanceof GeoJSONSource) {
        routeSource.setData(routeFeature);
      } else {
        map.addSource("route", {
          type: "geojson",
          data: routeFeature,
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#885",
            "line-width": 8,
          },
        });
      }

      fitRoute(map, geometry);
    };

    if (map.isStyleLoaded()) {
      applyRoute();
    } else {
      map.once("load", applyRoute);
    }

    return () => {
      map.off("load", applyRoute);
    };
  }, [geometry]);

  // Show newly added stops without waiting for the next route render.
  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    let markers: Marker[] = [];

    const addMarkers = () => {
      markers = waypoints.map((waypoint) =>
        new Marker({ color: "#f2a63d" })
          .setLngLat([waypoint.lon, waypoint.lat])
          .addTo(map),
      );
    };

    if (map.isStyleLoaded()) {
      addMarkers();
    } else {
      map.once("load", addMarkers);
    }

    return () => {
      map.off("load", addMarkers);
      markers.forEach((marker) => marker.remove());
    };
  }, [waypoints]);

  return (
    <div>
      <p className="font-display text-heading-m my-2">Detailed Map</p>
      <div
        ref={containerRef}
        role="region"
        aria-label="Interactive map of your journey"
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
