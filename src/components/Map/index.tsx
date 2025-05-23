import type { Direction } from "@constants/Maps";
import { Box, type SxProps } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, type ReactNode } from "react";
import markerIconBlue from "@assets/map/marker-icon-blue.png";
import markerIconGreen from "@assets/map/marker-icon-green.png";
import markerShadow from "@assets/map/marker-shadow.png";

type Marker = {
  lat: number;
  lng: number;
  label?: string;
  id: number;
  zoom?: number;
};

type MapProps = {
  height?: number | string;
  lat?: number;
  lng?: number;
  markers?: Marker[];
  isUpdated?: boolean;
  focusId?: number | undefined;
  correctionBias?: number;
  correctionDirection?: Direction;
  correctionZoom?: number;
  children?: ReactNode;
  sx?: SxProps;
};

const Map = ({
  height = 200,
  lat = 38.79,
  lng = -106.53,
  markers = [],
  isUpdated = false,
  focusId = undefined,
  correctionBias = 0,
  correctionDirection = "S",
  correctionZoom = 0,
  children,
  sx,
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  //   const apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

  // rerender markers on focusId
  useEffect(() => {
    if (mapInstanceRef && focusId) {
      setMarkers();
    }
  }, [focusId]);

  // renrender the whole map on isUpdated
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 4);

      if (mapInstanceRef.current && markers.length > 0) {
        setMarkers();
      }

      // https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}@2x.png?key=${apiKey}
      L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isUpdated]);

  const setMarkers = () => {
    const maxZoom = mapInstanceRef.current!.getMaxZoom();

    // remove old markers
    markersRef.current.forEach((m) => mapInstanceRef.current!.removeLayer(m));
    markersRef.current = [];

    markers.forEach((marker) => {
      let zoom = Math.min(marker.zoom ?? mapInstanceRef.current!.getZoom(), maxZoom);
      let isFocus = marker.id === focusId;
      let icon = isFocus ? greenIcon : blueIcon;
      let zIndexOffset = isFocus ? 1000 : 0;

      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon: icon,
        zIndexOffset: zIndexOffset, // This makes the focused marker appear on top
      });

      // add markers to markerRef
      markersRef.current.push(leafletMarker);

      // add markers to the map
      leafletMarker
        .addTo(mapInstanceRef.current!)
        .bindPopup(marker.label || "Attraction");

      // set map zoom level
      if (marker.id === focusId) {
        const markerBiased = getLatLonDelta(
          mapInstanceRef.current!,
          marker.lat,
          marker.lng,
          correctionBias,
          zoom + correctionZoom,
          correctionDirection
        );
        mapInstanceRef.current!.setView(
          [marker.lat + markerBiased.lat, marker.lng + markerBiased.lng],
          zoom + correctionZoom
        );
      }
    });

    // Optionally fit bounds to markers
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    if (!focusId)
      mapInstanceRef.current?.fitBounds(bounds, { padding: [20, 20] });
  };

  // different color markers
  // ref: https://github.com/pointhi/leaflet-color-markers

  const blueIcon = new L.Icon({
    iconUrl: markerIconBlue,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const greenIcon = new L.Icon({
    iconUrl: markerIconGreen,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // calculation
  // *credit to ChatGpt

  /**
   * Calculate the latitude or lnggitude delta equivalent to cm on screen at the given lat and zoom level,
   * depending on the direction (N, E, S, W).
   */
  const getLatLonDelta = (
    map: L.Map,
    lat: number,
    lng: number,
    cm: number,
    zoom: number,
    direction: Direction,
  ): L.LatLng => {
    if (cm <= 0) return new L.LatLng(0, 0);

    // 1 cm in pixels (screen units) — assuming 96 DPI
    const pixels = (96 / 2.54) * cm; // ~37.8px per cm

    const originalPoint = map.project([lat, lng], zoom);

    let offsetPoint: L.Point;

    switch (direction) {
      case "N":
        offsetPoint = L.point(originalPoint.x, originalPoint.y - pixels);
        break;
      case "S":
        offsetPoint = L.point(originalPoint.x, originalPoint.y + pixels);
        break;
      case "E":
        offsetPoint = L.point(originalPoint.x + pixels, originalPoint.y);
        break;
      case "W":
        offsetPoint = L.point(originalPoint.x - pixels, originalPoint.y);
        break;
    }

    const newLatLng = map.unproject(offsetPoint, zoom);

    return new L.LatLng(newLatLng.lat - lat, newLatLng.lng - lng);
  };

  return (
    <Box m={0} ref={mapRef} height={height} width="100%" sx={sx}>
      {children}
    </Box>
  );
};

export default Map;
